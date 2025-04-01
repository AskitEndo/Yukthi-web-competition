// context/AuthContext.tsx
"use client";

import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  username: string;
  isAdmin: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean; // To handle initial load
  login: (userData: User) => void; // Function called after successful API login
  logout: () => Promise<void>; // Function to trigger logout flow
  checkAuth: () => Promise<void>; // Function to manually re-check auth
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper Function (can move to lib/auth-utils.ts later)
async function fetchCurrentUser(): Promise<User | null> {
  try {
    // We need an API route to verify the cookie and return user data
    const response = await fetch("/api/auth/me"); // We'll create this next
    if (response.ok) {
      const data = await response.json();
      return data.user;
    }
    return null;
  } catch (error) {
    console.error("Failed to fetch current user:", error);
    return null;
  }
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Start loading initially
  const router = useRouter();

  // Function to check auth status (e.g., on initial load)
  const checkAuth = useCallback(async () => {
    setIsLoading(true);
    const currentUser = await fetchCurrentUser();
    setUser(currentUser);
    setIsLoading(false);
  }, []);

  // Check auth on component mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Login function (called by AuthForm after successful API call)
  const login = (userData: User) => {
    // The cookie is already set by the API route.
    // We just need to update the client-side state.
    setUser(userData);
    // Redirect logic is handled in AuthForm now, could move here if preferred
  };

  // Logout function
  const logout = async () => {
    setIsLoading(true);
    try {
      // Call the API to clear the cookie
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (error) {
      console.error("Logout failed:", error);
      // Handle error display if needed
    } finally {
      setUser(null); // Clear client-side state
      setIsLoading(false);
      router.push("/login"); // Redirect to login page
      router.refresh(); // Force refresh potentially needed for server components relying on cookie state implicitly
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
