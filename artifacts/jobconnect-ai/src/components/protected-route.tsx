import { useGetMe } from "@workspace/api-client-react";
import { useLocation } from "wouter";
import { ReactNode, useEffect } from "react";
import { Shell } from "./shell";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { data: user, isLoading } = useGetMe();
  const [location, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && !user) {
      setLocation(`/auth/login?redirect=${encodeURIComponent(location)}`);
    } else if (!isLoading && user && allowedRoles && !allowedRoles.includes(user.role)) {
      setLocation(`/dashboard/${user.role}`);
    }
  }, [user, isLoading, location, setLocation, allowedRoles]);

  if (isLoading) {
    return (
      <Shell>
        <div className="flex-1 flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="text-muted-foreground animate-pulse">Authenticating...</p>
          </div>
        </div>
      </Shell>
    );
  }

  if (!user || (allowedRoles && !allowedRoles.includes(user.role))) {
    return null; // Will redirect in useEffect
  }

  return <>{children}</>;
}