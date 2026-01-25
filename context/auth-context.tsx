"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "user";
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("admin_token");
        if (token) {
          // In a real app, validate token with your API
          // For now, we'll use a mock user
          setUser({
            id: "1",
            email: "admin@shahzaibautos.com",
            name: "Admin",
            role: "admin",
          });
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        localStorage.removeItem("admin_token");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);

    try {
      // Mock authentication - replace with real API call
      if (email === "admin@shahzaibautos.com" && password === "admin123") {
        const mockUser: User = {
          id: "1",
          email,
          name: "Admin",
          role: "admin",
        };

        setUser(mockUser);
        localStorage.setItem("admin_token", "mock_jwt_token");

        // Set cookie for middleware
        document.cookie = "admin_token=mock_jwt_token; path=/; max-age=86400"; // 24 hours

        return true;
      }

      return false;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("admin_token");

    // Remove cookie
    document.cookie =
      "admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
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
