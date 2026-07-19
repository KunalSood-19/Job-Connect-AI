import { ReactNode, useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Loader2 } from "lucide-react";

import { getMe } from "@/api/auth";
import { Shell } from "./shell";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string[];
}

export function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const [, setLocation] = useLocation();

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    async function checkAuth() {
      const token = localStorage.getItem("jwtToken");

      if (!token) {
        setLocation("/auth/login");
        return;
      }

      try {
        const response = await getMe(token);

        const currentUser = response.user;

        setUser(currentUser);

        if (
          allowedRoles &&
          !allowedRoles.includes(currentUser.role)
        ) {
          switch (currentUser.role) {
            case "STUDENT":
              setLocation("/dashboard/student");
              return;

            case "RECRUITER":
              setLocation("/dashboard/recruiter");
              return;

            case "ADMIN":
              setLocation("/");
              return;

            default:
              setLocation("/");
              return;
          }
        }
      } catch (err) {
        localStorage.removeItem("jwtToken");
        setLocation("/auth/login");
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, [allowedRoles, setLocation]);

  if (loading) {
    return (
      <Shell>
        <div className="flex min-h-[60vh] items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      </Shell>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}