import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { findUser, findUserByEmail } from "../services/academics";
import type { User } from "../types";
import { useData } from "./DataContext";

interface AuthContextValue {
  /** The signed-in user, always read fresh from the data. */
  user: User | null;
  /** Returns false when the email or password is wrong. */
  login: (email: string, password: string) => boolean;
  logout: () => void;
  tourOpen: boolean;
  startTour: () => void;
  finishTour: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data } = useData();
  const [userId, setUserId] = useState<string | null>(null);
  const [tourSeenBy, setTourSeenBy] = useState<string[]>([]);
  const [tourReplay, setTourReplay] = useState(false);

  const user = userId ? (findUser(data, userId) ?? null) : null;

  const login = useCallback(
    (email: string, password: string) => {
      const match = findUserByEmail(data, email);
      const valid = match?.password === password;
      if (match && valid) setUserId(match.id);
      return valid;
    },
    [data],
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      login,
      logout: () => setUserId(null),
      // The tour opens automatically on a user's first visit and again on request.
      tourOpen: !!user && (tourReplay || !tourSeenBy.includes(user.id)),
      startTour: () => setTourReplay(true),
      finishTour: () => {
        setTourReplay(false);
        if (user) setTourSeenBy((ids) => [...ids, user.id]);
      },
    }),
    [user, login, tourReplay, tourSeenBy],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}

/** For pages behind the auth guard, where a user always exists. */
export function useCurrentUser(): User {
  const { user } = useAuth();
  if (!user) throw new Error("useCurrentUser must be used behind RequireAuth");
  return user;
}
