import { useAuth0 } from "@auth0/auth0-react";
import { RoleType } from "@/types/role-types";
import { ReactNode } from "react";

interface ProtectedComponentProps {
  children: ReactNode;
  showUnauthorizedMessage?: boolean;
  errorMessage?: string;
}

const ProtectedComponent = ({
  children,
  showUnauthorizedMessage = false,
  errorMessage,
}: ProtectedComponentProps) => {
  const { user } = useAuth0();

  if (user?.roleType?.[0] === RoleType.ADMINISTRATEUR) {
    return <>{children}</>;
  }

  if (showUnauthorizedMessage) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-red-50 border border-red-200 h-[90vh]">
        <div className="text-red-600 text-lg font-semibold mb-2">
          🚫 Accès refusé
        </div>
        <div className="text-red-700 text-center">{errorMessage}</div>
        <div className="text-red-600 text-sm mt-2">
          Contactez un administrateur si vous pensez que c'est une erreur.
        </div>
      </div>
    );
  }

  return null;
};

export default ProtectedComponent;
