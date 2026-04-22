import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./auth/AuthContext";
import { DashboardPage } from "./pages/DashboardPage";
import { AuthCallbackPage } from "./pages/AuthCallbackPage";

function LoginScreen(): JSX.Element {
  const { login, isLoading } = useAuth();

  return (
    <div className="state-screen">
      <div className="hero-card">
        <h1>University Library Console</h1>
        <p>
          Secure access with OAuth2 Authorization Code + PKCE. React talks only to the Library API.
        </p>
        <button type="button" onClick={() => login()} disabled={isLoading}>
          {isLoading ? "Preparing session..." : "Continue with SSO"}
        </button>
      </div>
    </div>
  );
}

function ProtectedHome(): JSX.Element {
  const { user, isLoading, logout } = useAuth();

  if (isLoading) {
    return (
      <div className="state-screen">
        <h1>Loading session...</h1>
      </div>
    );
  }

  if (!user) {
    return <LoginScreen />;
  }

  return (
    <div className="page-shell">
      <header className="app-header">
        <div>
          <h1>Library Operations</h1>
          <p>Signed in as {user.profile.sub ?? "student"}</p>
        </div>
        <button type="button" className="button-secondary" onClick={() => logout()}>
          Logout
        </button>
      </header>
      <DashboardPage />
    </div>
  );
}

export default function App(): JSX.Element {
  return (
    <Routes>
      <Route path="/" element={<ProtectedHome />} />
      <Route path="/auth/callback" element={<AuthCallbackPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

