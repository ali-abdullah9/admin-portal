"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { toast } from 'sonner';

// Define authorized admin users
const AUTHORIZED_ADMINS = [
  { username: "admin1", password: "admin123", role: "Admin" },
  { username: "admin2", password: "admin456", role: "Admin" },
  { username: "moderator", password: "mod123", role: "Moderator" }
];

// Define the Auth context interface
interface AuthContextType {
  user: { username: string; role: string } | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  isAuthorized: () => boolean;
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => false,
  logout: () => {},
  isAuthorized: () => false
});

// Hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// AuthProvider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<{ username: string; role: string } | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  // Check local storage for existing user session on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem('nustac_user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem('nustac_user');
      }
    }
  }, []);

  // Redirect to login if not authenticated and not already on login page
  useEffect(() => {
    if (!user && pathname !== '/login') {
      router.push('/login');
    }
  }, [user, pathname, router]);

  // Login function
  const login = (username: string, password: string): boolean => {
    const foundUser = AUTHORIZED_ADMINS.find(
      admin => admin.username === username && admin.password === password
    );

    if (foundUser) {
      const userInfo = { username: foundUser.username, role: foundUser.role };
      setUser(userInfo);
      localStorage.setItem('nustac_user', JSON.stringify(userInfo));
      toast.success('Login successful', {
        description: `Welcome back, ${foundUser.username}!`
      });
      router.push('/');
      return true;
    } else {
      toast.error('Login failed', {
        description: 'Invalid username or password.'
      });
      return false;
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('nustac_user');
    toast.info('Logged out', {
      description: 'You have been successfully logged out.'
    });
    router.push('/login');
  };

  // Check if user is authorized
  const isAuthorized = (): boolean => {
    return user !== null;
  };

  // Return the provider with the auth context
  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthorized }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;