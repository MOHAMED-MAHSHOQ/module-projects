import { UserManager, WebStorageStateStore } from "oidc-client-ts";

export const userManager = new UserManager({
  authority: "http://localhost:8080",
  client_id: "library-client",
  client_secret: "library-secret",
  redirect_uri: "http://localhost:5173/auth/callback",
  post_logout_redirect_uri: "http://localhost:5173",
  response_type: "code",
  scope: "openid library.read library.write",
  // Pin metadata endpoints to the Vite proxy to avoid browser-side CORS on auth-server.
  metadata: {
    issuer: "http://localhost:8080",
    authorization_endpoint: "/oauth2/authorize",
    token_endpoint: "/oauth2/token",
    jwks_uri: "/oauth2/jwks",
    userinfo_endpoint: "/userinfo",
    end_session_endpoint: "/connect/logout",
  },
  disablePKCE: true,
  userStore: new WebStorageStateStore({ store: window.sessionStorage }),
  // Automatically renew tokens in the background
  automaticSilentRenew: false,
  // Don't monitor session via iframe (avoids cross-origin issues in dev)
  monitorSession: false,
});