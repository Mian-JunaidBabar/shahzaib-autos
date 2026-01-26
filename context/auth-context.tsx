"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from "react";
import { authClient } from "@/lib/auth-client";

// Types
interface User {
  id: string;
  email: string;
  name: string;
  role: "ADMIN" | "STAFF";
  image?: string | null;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (
    email: string,
    password: string,
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch current session
  const fetchSession = useCallback(async () => {
    try {
      const session = await authClient.getSession();

      if (session.data?.user) {
        setUser({
          id: session.data.user.id,
          email: session.data.user.email,
          name: session.data.user.name,
          role: (session.data.user as any).role || "STAFF",
          image: session.data.user.image,
        });
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Session fetch failed:", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Check session on mount
  useEffect(() => {
    fetchSession();
  }, [fetchSession]);

  // Login function
  const login = async (
    email: string,
    password: string,
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);

    try {
      const result = await authClient.signIn.email({
        email,
        password,
      });

      if (result.error) {
        return {
          success: false,
          error: result.error.message || "Login failed",
        };
      }

      // Fetch updated session
      await fetchSession();

      return { success: true };
    } catch (error) {
      console.error("Login failed:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Login failed",
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async (): Promise<void> => {
    try {
      await authClient.signOut();
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
      // Still clear user on error
      setUser(null);
    }
  };

  // Refresh session
  const refreshSession = async (): Promise<void> => {
    await fetchSession();
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        login,
        logout,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}

// Hook to check if user has specific role
export function useRequireRole(requiredRole: "ADMIN" | "STAFF") {
  const { user, isAuthenticated } = useAuth();

  const hasRole =
    isAuthenticated &&
    user &&
    (user.role === "ADMIN" || user.role === requiredRole);

  return hasRole;
}

// Hook to check if user is admin
export function useIsAdmin() {
  const { user, isAuthenticated } = useAuth();
  return isAuthenticated && user?.role === "ADMIN";
}
