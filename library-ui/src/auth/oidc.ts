import { UserManager, WebStorageStateStore } from "oidc-client-ts";

export const userManager = new UserManager({
  authority: "http://localhost:8080",
  client_id: "library-spa",
  redirect_uri: "http://localhost:5173/auth/callback",
  post_logout_redirect_uri: "http://localhost:5173",
  response_type: "code",
  scope: "openid library.read library.write",
  userStore: new WebStorageStateStore({ store: window.sessionStorage })
});

