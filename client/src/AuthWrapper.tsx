import { useAuth0 } from "@auth0/auth0-react";
import Logo from "@/assets/pictures/Logo Tsahal Conection.png";
import "./App.css";

function AuthWrapper({ children }: { children: React.ReactNode }) {
  const { isLoading } = useAuth0();

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <img
          src={Logo}
          alt="Logo Tsahal Connection"
          className="w-32 h-32 loading-logo"
        />
      </div>
    );

  return <>{children}</>;
}

export default AuthWrapper;
