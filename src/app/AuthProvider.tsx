"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";

// Define authorized admin users
const AUTHORIZED_ADMINS = [
  { username: "admin1", password: "Nust@cAdmin123", role: "Admin" },
  { username: "admin2", password: "admin456", role: "Admin" },
  { username: "moderator", password: "mod123", role: "Moderator" },
];

// Define the User type
interface User {
  username: string;
  role: string;
  lastLogin?: string;
}

// Define the Auth context interface
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthorized: () => boolean;
  hasRole: (role: string | string[]) => boolean;
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => false,
  logout: () => {},
  isAuthorized: () => false,
  hasRole: () => false,
});

// Hook to use the auth context
export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

// AuthProvider component
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const LOCAL_STORAGE_KEY = "nustac_user_session";
  const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

  // Check local storage for existing user session on component mount
  useEffect(() => {
    const checkAuthStatus = () => {
      setIsLoading(true);

      const storedSession = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedSession) {
        try {
          const { user: storedUser, timestamp } = JSON.parse(storedSession);

          // Check if session is still valid (not expired)
          const now = new Date().getTime();
          if (now - timestamp < SESSION_DURATION) {
            setUser(storedUser);
          } else {
            // Session expired
            localStorage.removeItem(LOCAL_STORAGE_KEY);
            toast.info("Session expired", {
              description: "Please log in again to continue.",
            });
          }
        } catch (error) {
          console.error("Failed to parse stored session:", error);
          localStorage.removeItem(LOCAL_STORAGE_KEY);
        }
      }

      setIsLoading(false);
    };

    checkAuthStatus();

    // Set up an interval to periodically check session validity
    const intervalId = setInterval(() => {
      const storedSession = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedSession) {
        try {
          const { timestamp } = JSON.parse(storedSession);
          const now = new Date().getTime();

          // If session is about to expire in the next 5 minutes, show a warning
          const timeLeft = timestamp + SESSION_DURATION - now;
          if (timeLeft > 0 && timeLeft < 5 * 60 * 1000) {
            toast.warning("Session expiring soon", {
              description: "Your session will expire in the next few minutes.",
            });
          }

          // If session has expired, log out
          if (now - timestamp >= SESSION_DURATION) {
            logout();
          }
        } catch (error) {
          console.error(
            "Failed to parse stored session during interval check:",
            error
          );
        }
      }
    }, 60 * 1000); // Check every minute

    return () => clearInterval(intervalId);
  }, []);

  // Redirect to login if not authenticated and not already on login page
  useEffect(() => {
    if (!isLoading && !user && pathname !== "/login") {
      router.push("/login");
    } else if (user && pathname === "/login") {
      // If already logged in and on login page, redirect to dashboard
      router.push("/");
    }
  }, [user, pathname, router, isLoading]);

  // Login function
  const login = async (
    username: string,
    password: string
  ): Promise<boolean> => {
    // Simulate network request
    await new Promise((resolve) => setTimeout(resolve, 500));

    const foundUser = AUTHORIZED_ADMINS.find(
      (admin) => admin.username === username && admin.password === password
    );

    if (foundUser) {
      const currentTime = new Date();
      const userInfo: User = {
        username: foundUser.username,
        role: foundUser.role,
        lastLogin: currentTime.toISOString(),
      };

      // Store user info and timestamp
      const sessionData = {
        user: userInfo,
        timestamp: currentTime.getTime(),
      };

      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(sessionData));
      setUser(userInfo);

      toast.success("Login successful", {
        description: `Welcome back, ${foundUser.username}!`,
      });

      router.push("/");
      return true;
    } else {
      toast.error("Login failed", {
        description: "Invalid username or password.",
      });
      return false;
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem(LOCAL_STORAGE_KEY);

    // Only show toast if user was actually logged in
    if (user) {
      toast.info("Logged out", {
        description: "You have been successfully logged out.",
      });
    }

    router.push("/login");
  };

  // Refresh session - extends the session duration
  const refreshSession = () => {
    if (user) {
      const sessionData = {
        user,
        timestamp: new Date().getTime(),
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(sessionData));
    }
  };

  // Check if user is authorized
  const isAuthorized = (): boolean => {
    return user !== null;
  };

  // Check if user has specific role(s)
  const hasRole = (role: string | string[]): boolean => {
    if (!user) return false;

    if (Array.isArray(role)) {
      return role.includes(user.role);
    }

    return user.role === role;
  };

  // Extend session on user activity
  useEffect(() => {
    if (!user) return;

    const activityEvents = [
      "mousedown",
      "mousemove",
      "keypress",
      "scroll",
      "touchstart",
    ];

    const handleUserActivity = () => {
      refreshSession();
    };

    // Add event listeners
    activityEvents.forEach((event) => {
      window.addEventListener(event, handleUserActivity);
    });

    // Cleanup
    return () => {
      activityEvents.forEach((event) => {
        window.removeEventListener(event, handleUserActivity);
      });
    };
  }, [user]);

  // Return the provider with the auth context
  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        isAuthorized,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
