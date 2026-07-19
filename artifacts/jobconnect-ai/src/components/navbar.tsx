import { Link, useLocation } from "wouter";
import { useEffect, useState } from "react";
import { getMe } from "@/api/auth";
import { Button } from "@/components/ui/button";
import { Briefcase, LogOut, Menu, User, UserCircle, Search, Home } from "lucide-react";
import NotificationBell from "@/components/common/NotificationBell";
import { ModeToggle } from "./mode-toggle";
import { socket } from "@/lib/socket";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [location] = useLocation();
  useEffect(() => {
  async function loadUser() {
    const token = localStorage.getItem("jwtToken");

    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await getMe(token);
      setUser(response.user);
      socket.connect();
socket.emit("join", response.user.id);
    } catch {
      localStorage.removeItem("jwtToken");
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }

  loadUser();
}, []);

 const handleLogout = () => {
  socket.disconnect();

  localStorage.removeItem("jwtToken");
  setUser(null);
  window.location.href = "/";
};

  const NavLinks = () => (
    <>
      <Link href="/jobs" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
        Find Jobs
      </Link>
      <Link href="/companies" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
        Companies
      </Link>
      <Link href="/resume-builder" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
        Resume Builder
      </Link>
      <Link href="/interview" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
        Practice Interviews
      </Link>
    </>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 glass">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground group-hover:scale-105 transition-transform">
              <Briefcase className="h-5 w-5" />
            </div>
            <span className="font-bold text-xl tracking-tight hidden sm:inline-block">
              JobConnect<span className="text-primary">AI</span>
            </span>
          </Link>
          <nav className="hidden md:flex gap-6 items-center ml-6">
            <NavLinks />
          </nav>
        </div>

       <div className="flex items-center gap-4">
  <ModeToggle />

  {user && <NotificationBell />}

  {isLoading ? (
            <div className="h-9 w-9 rounded-full bg-muted animate-pulse" />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  <Avatar className="h-9 w-9 border border-white/10">
                    <AvatarImage src={user.avatarUrl || ""} alt={user.name} />
                    <AvatarFallback className="bg-primary/20 text-primary">
                      {(user.name || user.email || "U").charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 glass" align="end" forceMount>
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">{user.name}</p>
                    <p className="w-[200px] truncate text-sm text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem asChild>
                  <Link
  href={
    user?.role === "STUDENT"
      ? "/dashboard/student"
      : user?.role === "RECRUITER"
      ? "/dashboard/recruiter"
      : user?.role === "ADMIN"
      ? "/dashboard/admin"
      : "/"
  }
  className="w-full cursor-pointer flex items-center"
>
                    <Home className="mr-2 h-4 w-4" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="w-full cursor-pointer flex items-center">
                    <UserCircle className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem
                  className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Button variant="ghost" asChild className="hover:bg-white/5">
                <Link href="/auth/login">Log in</Link>
              </Button>
              <Button asChild className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20">
                <Link href="/auth/register">Sign up</Link>
              </Button>
            </div>
          )}

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="glass w-[300px] sm:w-[400px]">
              <div className="flex flex-col gap-6 py-6">
                <Link href="/" className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <Briefcase className="h-5 w-5" />
                  </div>
                  <span className="font-bold text-xl tracking-tight">
                    JobConnect<span className="text-primary">AI</span>
                  </span>
                </Link>
                <nav className="flex flex-col gap-4">
                  <NavLinks />
                </nav>
                {!user && (
                  <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-white/10">
                    <Button variant="outline" asChild className="w-full justify-start">
                      <Link href="/auth/login">Log in</Link>
                    </Button>
                    <Button asChild className="w-full justify-start bg-primary text-white">
                      <Link href="/auth/register">Sign up</Link>
                    </Button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}