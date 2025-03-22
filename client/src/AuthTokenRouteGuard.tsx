import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useLocation } from "react-router-dom";

const AuthTokenRouteGuard = () => {
  const { getIdTokenClaims, logout } = useAuth0();
  const location = useLocation();

  useEffect(() => {
    const checkTokenExpiry = async () => {
      try {
        const claims = await getIdTokenClaims();
        const exp = claims?.exp;
        const now = Math.floor(Date.now() / 1000);

        if (exp && now > exp) {
          logout({
            logoutParams: {
              returnTo: window.location.origin,
            },
          });
        }
      } catch (err) {
        console.error("Could not get ID token claims", err);
        logout({
          logoutParams: {
            returnTo: window.location.origin,
          },
        });
      }
    };

    checkTokenExpiry();
  }, [location.pathname, getIdTokenClaims, logout]);

  return null;
};

export default AuthTokenRouteGuard;
