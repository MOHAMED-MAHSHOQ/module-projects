import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { userManager } from "../auth/oidc";

export function AuthCallbackPage(): JSX.Element {
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);
    const handled = useRef(false);

    useEffect(() => {
        // Guard against double-invoke in React StrictMode
        if (handled.current) return;
        handled.current = true;

        userManager
            .signinRedirectCallback()
            .then(() => {
                navigate("/", { replace: true });
            })
            .catch((err: unknown) => {
                console.error("Signin callback error:", err);
                const message =
                    err instanceof Error ? err.message : "Unable to complete sign in.";
                setError(message);
            });
    }, [navigate]);

    if (error) {
        return (
            <div className="state-screen">
                <div className="hero-card">
                    <h1>Sign-in failed</h1>
                    <p style={{ color: "#fecaca" }}>{error}</p>
                    <button type="button" onClick={() => navigate("/", { replace: true })}>
                        Back to Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="state-screen">
            <div className="hero-card">
                <h1>Signing you in…</h1>
                <p>Please wait while we validate your session.</p>
            </div>
        </div>
    );
}