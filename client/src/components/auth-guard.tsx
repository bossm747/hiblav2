import { useEffect, useState } from "react";
import { useLocation } from "wouter";

interface User {
  id: string;
  name: string;
  username: string;
  role: string;
  email: string;
}

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: "admin" | "cashier";
  redirectTo?: string;
}

export function AuthGuard({ children, requiredRole, redirectTo = "/login" }: AuthGuardProps) {
  const [, setLocation] = useLocation();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      
      // Check role if required
      if (requiredRole && parsedUser.role !== requiredRole && parsedUser.role !== "admin") {
        setLocation(redirectTo);
        return;
      }
    } else {
      setLocation(redirectTo);
      return;
    }
    
    setIsLoading(false);
  }, [requiredRole, redirectTo, setLocation]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="glass-card p-8 rounded-lg">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-center mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return { user, logout };
}