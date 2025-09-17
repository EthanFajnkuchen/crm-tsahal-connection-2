import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Auth0Provider } from "@auth0/auth0-react";
import { Provider } from "react-redux";
import { store } from "@/store/store.ts";
import AuthWrapper from "./AuthWrapper.tsx";
import { Toaster } from "@/components/ui/sonner";

createRoot(document.getElementById("root")!).render(
  <Auth0Provider
    domain="dev-j678f0np5nacflly.us.auth0.com"
    clientId="nlrAya6gNRWwFq1ugK79JlV8zG9BogZL"
    cacheLocation="localstorage"
    useRefreshTokens={true}
    useRefreshTokensFallback={true}
    authorizationParams={{
      redirect_uri: window.location.origin,
      audience: "http://tc-crm.com/",
      scope: "openid profile email",
    }}
    httpTimeoutInSeconds={15}
    onRedirectCallback={(appState) => {
      window.history.replaceState(
        {},
        document.title,
        appState?.returnTo || "/"
      );
    }}
  >
    <Provider store={store}>
      <AuthWrapper>
        <App />
        <Toaster />
      </AuthWrapper>
    </Provider>
  </Auth0Provider>
);
