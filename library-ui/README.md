# Library UI (React + Vite)

This SPA follows the current backend handshake model:

- Browser/React calls only `library-service` (`http://localhost:8081`)
- `library-service` calls `book-service` internally (`http://localhost:8082`)
- OAuth2 login is handled by `auth-server` (`http://localhost:8080`)

## Security Flow

1. User clicks **Continue with SSO** in React.
2. Browser is redirected to `auth-server` for login and consent.
3. `auth-server` redirects back to `http://localhost:5173/auth/callback` with authorization code.
4. SPA completes Authorization Code + PKCE flow and stores access token in `sessionStorage`.
5. React sends `Authorization: Bearer <token>` only to `library-service` endpoints.

## Required Backend Settings

- `auth-server` must register client:
  - `client_id=library-client`
  - public client (`ClientAuthenticationMethod.NONE`)
  - `AuthorizationGrantType.AUTHORIZATION_CODE`
  - PKCE required (`requireProofKey=true`)
  - redirect URI `http://localhost:5173/auth/callback`
- `library-service` and `auth-server` should allow CORS from `http://localhost:5173`.

## Run

```powershell
cd C:\Users\mohamed.ms\IdeaProjects\new\library-app\library-ui
npm install
npm run dev
```

## Build

```powershell
cd C:\Users\mohamed.ms\IdeaProjects\new\library-app\library-ui
npm run build
```

