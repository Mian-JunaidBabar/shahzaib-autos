"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from "react";
import { supabase } from "@/lib/auth-client";
import type { User as SupabaseUser, Session } from "@supabase/supabase-js";

// Types
interface User {
  id: string;
  email: string;
  name: string;
  isAdmin: boolean;
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
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Convert Supabase user to our User type
  const mapSupabaseUser = useCallback(
    (supabaseUser: SupabaseUser | null): User | null => {
      if (!supabaseUser) return null;

      return {
        id: supabaseUser.id,
        email: supabaseUser.email || "",
        name:
          supabaseUser.user_metadata?.name ||
          supabaseUser.email?.split("@")[0] ||
          "User",
        isAdmin: supabaseUser.user_metadata?.is_admin === true,
        image: supabaseUser.user_metadata?.avatar_url,
      };
    },
    [],
  );

  // Fetch current session
  const fetchSession = useCallback(async () => {
    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        console.error("Session fetch error:", error);
        setUser(null);
        return;
      }

      setUser(mapSupabaseUser(session?.user ?? null));
    } catch (error) {
      console.error("Session fetch failed:", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, [mapSupabaseUser]);

  // Check session on mount and listen for auth changes
  useEffect(() => {
    fetchSession();

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(mapSupabaseUser(session?.user ?? null));
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchSession, mapSupabaseUser]);

  // Login function using Supabase
  const login = async (
    email: string,
    password: string,
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return {
          success: false,
          error: error.message || "Login failed",
        };
      }

      setUser(mapSupabaseUser(data.user));
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

  // Logout function using Supabase
  const logout = async (): Promise<void> => {
    try {
      await supabase.auth.signOut();
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

  // Refresh user data (force re-fetch from Supabase)
  const refreshUser = async (): Promise<void> => {
    try {
      const {
        data: { user: supabaseUser },
        error,
      } = await supabase.auth.getUser();

      if (error) {
        console.error("User refresh error:", error);
        return;
      }

      setUser(mapSupabaseUser(supabaseUser));
    } catch (error) {
      console.error("User refresh failed:", error);
    }
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
        refreshUser,
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

// Hook to check if user is admin
export function useIsAdmin() {
  const { user, isAuthenticated } = useAuth();
  return isAuthenticated && user?.isAdmin === true;
}
