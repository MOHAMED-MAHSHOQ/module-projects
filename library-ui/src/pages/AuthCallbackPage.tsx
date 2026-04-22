import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { userManager } from "../auth/oidc";

export function AuthCallbackPage(): JSX.Element {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    userManager
      .signinRedirectCallback()
      .then(() => {
        navigate("/", { replace: true });
      })
      .catch((err: unknown) => {
        const message = err instanceof Error ? err.message : "Unable to complete sign in.";
        setError(message);
      });
  }, [navigate]);

  if (error) {
    return (
      <div className="state-screen">
        <h1>Sign-in failed</h1>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="state-screen">
      <h1>Signing you in...</h1>
      <p>Please wait while we validate your session.</p>
    </div>
  );
}

