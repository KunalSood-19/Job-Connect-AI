import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation, Link, useSearch } from "wouter";
import { register, getMe } from "@/api/auth";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Briefcase, Loader2, ArrowRight, UserSquare2, Building2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["student", "recruiter"]),
});

export function RegisterPage() {
  const [, setLocation] = useLocation();
  const searchString = useSearch();
  const queryParams = new URLSearchParams(searchString);
  const defaultRole = (queryParams.get("role") as "student" | "recruiter") || "student";
  
  const [roleTab, setRoleTab] = useState<"student" | "recruiter">(defaultRole);
  
 
  const { toast } = useToast();

 useEffect(() => {
  async function checkUser() {
    const token = localStorage.getItem("jwtToken");

    if (!token) return;

    try {
      const data = await getMe(token);

      switch (data.user.role) {
        case "STUDENT":
          setLocation("/dashboard/student");
          break;

        case "RECRUITER":
          setLocation("/dashboard/recruiter");
          break;

        case "ADMIN":
          setLocation("/");
          break;

        default:
          setLocation("/");
      }
    } catch {
      localStorage.removeItem("jwtToken");
    }
  }

  checkUser();
}, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: defaultRole,
    },
  });

  const handleTabChange = (value: string) => {
    const role = value as "student" | "recruiter";
    setRoleTab(role);
    form.setValue("role", role);
  };

 async function onSubmit(values: z.infer<typeof formSchema>) {
  try {
    const data = await register({
      name: values.name,
      email: values.email,
      password: values.password,
      role:
        values.role === "student"
          ? "STUDENT"
          : "RECRUITER",
    });

    localStorage.setItem("jwtToken", data.token);

    toast({
      title: "Account created",
      description: "Welcome to JobConnect AI!",
    });

    switch (data.user.role) {
      case "STUDENT":
        setLocation("/dashboard/student");
        break;

      case "RECRUITER":
        setLocation("/dashboard/recruiter");
        break;

      case "ADMIN":
        setLocation("/");
        break;

      default:
        setLocation("/");
    }
  } catch (error: any) {
    toast({
      title: "Registration failed",
      description:
        error?.response?.data?.message ??
        "Registration failed",
      variant: "destructive",
    });
  }
}

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background relative overflow-hidden py-12">
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay z-0 pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-purple-600/20 rounded-full blur-[150px] pointer-events-none z-0"></div>
      
      <div className="w-full max-w-[480px] z-10">
        <div className="flex flex-col items-center mb-8">
          <Link href="/" className="flex items-center gap-2 group mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground group-hover:scale-105 transition-transform shadow-lg shadow-primary/20">
              <Briefcase className="h-6 w-6" />
            </div>
            <span className="font-bold text-3xl tracking-tight">
              JobConnect<span className="text-primary">AI</span>
            </span>
          </Link>
        </div>

        <Card className="glass-card border-white/10 shadow-2xl backdrop-blur-2xl">
          <CardHeader className="space-y-1 text-center pb-6">
            <CardTitle className="text-2xl font-bold tracking-tight">Create an account</CardTitle>
            <CardDescription className="text-muted-foreground">
              Choose your account type to get started
            </CardDescription>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            <Tabs defaultValue={roleTab} onValueChange={handleTabChange} className="w-full mb-8">
              <TabsList className="grid w-full grid-cols-2 h-14 p-1 bg-background/50 border border-white/5 rounded-xl">
                <TabsTrigger value="student" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">
                  <UserSquare2 className="w-4 h-4 mr-2" />
                  Candidate
                </TabsTrigger>
                <TabsTrigger value="recruiter" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">
                  <Building2 className="w-4 h-4 mr-2" />
                  Employer
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">Full Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder={roleTab === "student" ? "John Doe" : "Jane Smith (Company Name)"} 
                          className="h-12 bg-background/50 border-white/10 focus-visible:ring-primary/50" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">Work Email</FormLabel>
                      <FormControl>
                        <Input 
                          type="email"
                          placeholder="name@example.com" 
                          className="h-12 bg-background/50 border-white/10 focus-visible:ring-primary/50" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">Password</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="Create a password (min. 6 chars)" 
                          className="h-12 bg-background/50 border-white/10 focus-visible:ring-primary/50"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button 
                  type="submit" 
                  className="w-full h-12 text-base font-medium shadow-[0_0_20px_rgba(var(--primary),0.2)] mt-4" 
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      Create Account <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex flex-col border-t border-white/5 pt-6 pb-8 px-8">
            <div className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/auth/login" className="font-medium text-primary hover:underline transition-colors">
                Sign in
              </Link>
            </div>
            <p className="text-xs text-muted-foreground/60 text-center mt-6">
              By clicking "Create Account", you agree to our Terms of Service and Privacy Policy.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}