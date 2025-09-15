import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  roleType: string[];
  permissions: string[];
  iss: string;
  sub: string;
  aud: string[];
  iat: number;
  exp: number;
  scope: string;
  azp: string;
}

interface UseUserPermissionsReturn {
  permissions: string[];
  roleType: string[];
  isLoading: boolean;
  error: string | null;
}

// Cache global pour éviter les appels redondants
let cachedUserData: {
  permissions: string[];
  roleType: string[];
  timestamp: number;
  userId?: string;
} | null = null;

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
let ongoingRequest: Promise<void> | null = null;

export const useUserPermissions = (): UseUserPermissionsReturn => {
  const { getAccessTokenSilently, isAuthenticated, user } = useAuth0();
  const [permissions, setPermissions] = useState<string[]>([]);
  const [roleType, setRoleType] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAndDecodeToken = async () => {
      if (!isAuthenticated || !user) {
        setIsLoading(false);
        return;
      }

      const now = Date.now();
      const currentUserId = user.sub;

      // Vérifier le cache
      if (
        cachedUserData &&
        cachedUserData.userId === currentUserId &&
        now - cachedUserData.timestamp < CACHE_DURATION
      ) {
        setPermissions(cachedUserData.permissions);
        setRoleType(cachedUserData.roleType);
        setIsLoading(false);
        return;
      }

      // Si une requête est déjà en cours, l'attendre
      if (ongoingRequest) {
        try {
          await ongoingRequest;
          if (cachedUserData && cachedUserData.userId === currentUserId) {
            setPermissions(cachedUserData.permissions);
            setRoleType(cachedUserData.roleType);
            setIsLoading(false);
            return;
          }
        } catch (err) {
          // Continue avec une nouvelle requête si l'attente échoue
        }
      }

      // Créer une nouvelle requête
      ongoingRequest = (async () => {
        try {
          setIsLoading(true);
          setError(null);

          const token = await getAccessTokenSilently({
            timeoutInSeconds: 15,
            cacheMode: "on",
          });
          console.log("token", token);
          const decodedToken = jwtDecode<DecodedToken>(token);
          console.log("decodedToken", decodedToken);

          // Mettre à jour le cache
          cachedUserData = {
            permissions: decodedToken.permissions || [],
            roleType: decodedToken.roleType || [],
            timestamp: now,
            userId: currentUserId,
          };

          setPermissions(cachedUserData.permissions);
          setRoleType(cachedUserData.roleType);
        } catch (err) {
          console.error("Error decoding token:", err);

          // En cas d'erreur, utiliser le cache s'il existe pour le même utilisateur
          if (cachedUserData && cachedUserData.userId === currentUserId) {
            setPermissions(cachedUserData.permissions);
            setRoleType(cachedUserData.roleType);
            setError(null); // Annuler l'erreur si on a des données en cache
            console.log("Using cached user data due to token error");
          } else {
            // Si pas de cache, essayer une approche de fallback
            try {
              // Tentative sans cache
              const fallbackToken = await getAccessTokenSilently({
                timeoutInSeconds: 10,
                cacheMode: "off",
              });
              const decodedToken = jwtDecode<DecodedToken>(fallbackToken);

              cachedUserData = {
                permissions: decodedToken.permissions || [],
                roleType: decodedToken.roleType || [],
                timestamp: now,
                userId: currentUserId,
              };

              setPermissions(cachedUserData.permissions);
              setRoleType(cachedUserData.roleType);
              setError(null);
            } catch (fallbackErr) {
              setError("Impossible de récupérer les permissions utilisateur");
              console.error("Fallback token request also failed:", fallbackErr);
            }
          }
        } finally {
          setIsLoading(false);
          ongoingRequest = null;
        }
      })();

      await ongoingRequest;
    };

    fetchAndDecodeToken();
  }, [getAccessTokenSilently, isAuthenticated, user]);

  return {
    permissions,
    roleType,
    isLoading,
    error,
  };
};
