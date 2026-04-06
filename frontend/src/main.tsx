import { StrictMode, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "@/hooks/AuthContext";
import App from "./App";
import "./i18n";
import "./globals.css";

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

function GoogleWrapper({ children }: { children: ReactNode }) {
  if (!googleClientId) return <>{children}</>;
  return <GoogleOAuthProvider clientId={googleClientId}>{children}</GoogleOAuthProvider>;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GoogleWrapper>
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </GoogleWrapper>
  </StrictMode>
);
