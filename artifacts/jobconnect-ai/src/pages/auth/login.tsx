import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation, Link } from "wouter";
import { useLogin, useGetMe } from "@workspace/api-client-react";
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
import { Briefcase, Loader2, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export function LoginPage() {
  const [, setLocation] = useLocation();
  const { data: user, isLoading: isUserLoading } = useGetMe();
  const loginMutation = useLogin();
  const { toast } = useToast();

  useEffect(() => {
    if (!isUserLoading && user) {
      setLocation(`/dashboard/${user.role}`);
    }
  }, [user, isUserLoading, setLocation]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    loginMutation.mutate(
      { data: values },
      {
        onSuccess: (data) => {
          localStorage.setItem("jwtToken", data.token);
          toast({
            title: "Welcome back",
            description: "You have successfully logged in.",
          });
          setLocation(`/dashboard/${data.user.role}`);
        },
        onError: (error: any) => {
          toast({
            title: "Login failed",
            description: error?.message || "Please check your credentials and try again.",
            variant: "destructive",
          });
        },
      }
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay z-0 pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] pointer-events-none z-0"></div>
      
      <div className="w-full max-w-[420px] z-10">
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
          <CardHeader className="space-y-1 text-center pb-8">
            <CardTitle className="text-2xl font-bold tracking-tight">Welcome back</CardTitle>
            <CardDescription className="text-muted-foreground">
              Enter your email to sign in to your account
            </CardDescription>
          </CardHeader>
          <CardContent className="px-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">Email</FormLabel>
                      <FormControl>
                        <Input 
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
                      <div className="flex items-center justify-between">
                        <FormLabel className="text-foreground">Password</FormLabel>
                        <a href="#" className="text-sm text-primary hover:underline" tabIndex={-1}>
                          Forgot password?
                        </a>
                      </div>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="••••••••" 
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
                  className="w-full h-12 text-base font-medium shadow-[0_0_20px_rgba(var(--primary),0.2)] mt-2" 
                  disabled={loginMutation.isPending}
                >
                  {loginMutation.isPending ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      Sign In <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex flex-col border-t border-white/5 pt-6 pb-8 px-8">
            <div className="text-center text-sm text-muted-foreground w-full">
              Don't have an account?{" "}
              <Link href="/auth/register" className="font-medium text-primary hover:underline transition-colors">
                Sign up
              </Link>
            </div>
            
            {/* Mock Data Login Helpers - For dev purposes since we don't have a real DB yet */}
            <div className="mt-8 pt-4 border-t border-white/5 w-full flex flex-col gap-2 text-xs">
              <p className="text-center text-muted-foreground/60 mb-2">Development helpers:</p>
              <Button variant="outline" size="sm" className="h-8 glass justify-start" onClick={() => {
                form.setValue('email', 'student@example.com');
                form.setValue('password', 'password');
              }}>
                Login as Student
              </Button>
              <Button variant="outline" size="sm" className="h-8 glass justify-start" onClick={() => {
                form.setValue('email', 'recruiter@example.com');
                form.setValue('password', 'password');
              }}>
                Login as Recruiter
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}