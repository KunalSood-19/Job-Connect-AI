import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { getMe } from "@/api/auth";

import StudentProfile from "./StudentProfile";
import RecruiterProfile from "./RecruiterProfile";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");

    if (!token) {
      setError(true);
      setIsLoading(false);
      return;
    }

    getMe(token)
      .then((res) => {
        setUser(res.user);
      })
      .catch(() => {
        setError(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="text-center">
          <h2 className="text-2xl font-semibold">
            Unable to load profile
          </h2>
          <p className="text-muted-foreground mt-2">
            Please login again and try.
          </p>
        </div>
      </div>
    );
  }

  switch (user.role) {
    case "STUDENT":
      return <StudentProfile />;

    case "RECRUITER":
      return <RecruiterProfile />;

    case "ADMIN":
      return (
        <div className="container mx-auto py-10">
          <div className="rounded-xl border p-8 text-center">
            <h1 className="text-3xl font-bold">
              Admin Profile
            </h1>
            <p className="text-muted-foreground mt-2">
              Admin profile page is not implemented yet.
            </p>
          </div>
        </div>
      );

    default:
      return (
        <div className="flex items-center justify-center min-h-[70vh]">
          <h2 className="text-xl font-semibold">
            Invalid User Role: {user.role}
          </h2>
        </div>
      );
  }
}