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

export const useUserPermissions = (): UseUserPermissionsReturn => {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();
  const [permissions, setPermissions] = useState<string[]>([]);
  const [roleType, setRoleType] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAndDecodeToken = async () => {
      if (!isAuthenticated) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const token = await getAccessTokenSilently();
        const decodedToken = jwtDecode<DecodedToken>(token);

        setPermissions(decodedToken.permissions || []);
        setRoleType(decodedToken.roleType || []);
      } catch (err) {
        setError("Erreur lors du décodage du token");
        console.error("Error decoding token:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAndDecodeToken();
  }, [getAccessTokenSilently, isAuthenticated]);

  return {
    permissions,
    roleType,
    isLoading,
    error,
  };
};
