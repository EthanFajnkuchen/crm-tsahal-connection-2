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
    domain="tsahalco.us.auth0.com"
    clientId="DJ339bZfup4BLe3k31iBx3NtDTnnOt5b"
    cacheLocation="localstorage"
    authorizationParams={{
      redirect_uri: window.location.origin,
      audience: "http://tc-crm.com/",
    }}
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
