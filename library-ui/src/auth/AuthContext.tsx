import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { PropsWithChildren } from "react";
import type { User } from "oidc-client-ts";
import { userManager } from "./oidc";
import { attachAccessToken } from "../api/http";

type AuthContextValue = {
  user: User | null;
  isLoading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: PropsWithChildren): JSX.Element {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    userManager.getUser().then((storedUser) => {
      if (!mounted) {
        return;
      }
      const activeUser = storedUser && !storedUser.expired ? storedUser : null;
      setUser(activeUser);
      attachAccessToken(activeUser?.access_token ?? null);
      setIsLoading(false);
    });

    const onUserLoaded = (loadedUser: User) => {
      setUser(loadedUser);
      attachAccessToken(loadedUser.access_token);
    };

    const onUserUnloaded = () => {
      setUser(null);
      attachAccessToken(null);
    };

    userManager.events.addUserLoaded(onUserLoaded);
    userManager.events.addUserUnloaded(onUserUnloaded);

    return () => {
      mounted = false;
      userManager.events.removeUserLoaded(onUserLoaded);
      userManager.events.removeUserUnloaded(onUserUnloaded);
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading,
      login: async () => userManager.signinRedirect(),
      logout: async () => userManager.signoutRedirect()
    }),
    [user, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}

