import { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useLocation } from "wouter";
import { forgotPassword, resetPassword } from "@/api/auth";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Briefcase,
  Loader2,
  ArrowRight,
  MailCheck,
  Lock,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// ─── Step 1 Schema ────────────────────────────────────────────────────────────
const emailSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

// ─── Step 2 Schema ────────────────────────────────────────────────────────────
const resetSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type Step = "request" | "sent" | "reset" | "done";

export function ForgotPasswordPage() {
  const [step, setStep] = useState<Step>("request");
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  // Read ?token= from the URL to auto-switch to reset step
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (token) setStep("reset");
  }, []);

  // ── Step 1 form ─────────────────────────────────────────────────────────────
  const emailForm = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: "" },
  });

  async function onRequestReset(values: z.infer<typeof emailSchema>) {
    try {
      await forgotPassword(values.email);
      setStep("sent");
    } catch {
      toast({
        title: "Something went wrong",
        description: "Could not send reset email. Please try again.",
        variant: "destructive",
      });
    }
  }

  // ── Step 2 form ─────────────────────────────────────────────────────────────
  const resetForm = useForm<z.infer<typeof resetSchema>>({
    resolver: zodResolver(resetSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  async function onResetPassword(values: z.infer<typeof resetSchema>) {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token") ?? "";
    try {
      await resetPassword(token, values.password);
      setStep("done");
    } catch (error: any) {
      toast({
        title: "Reset failed",
        description:
          error?.response?.data?.message ?? "Invalid or expired link.",
        variant: "destructive",
      });
    }
  }

  // ── Shared Background Layout ─────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay z-0 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] pointer-events-none z-0" />

      <div className="w-full max-w-[420px] z-10">
        {/* Logo */}
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

        {/* ── STEP: request ─────────────────────────────────────────────────── */}
        {step === "request" && (
          <Card className="glass-card border-white/10 shadow-2xl backdrop-blur-2xl">
            <CardHeader className="space-y-1 text-center pb-6">
              <div className="flex justify-center mb-3">
                <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center ring-1 ring-primary/30">
                  <Lock className="h-6 w-6 text-primary" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold tracking-tight">
                Forgot password?
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Enter your email and we'll send you a reset link
              </CardDescription>
            </CardHeader>

            <CardContent className="px-8">
              <Form {...emailForm}>
                <form
                  onSubmit={emailForm.handleSubmit(onRequestReset)}
                  className="space-y-5"
                >
                  <FormField
                    control={emailForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground">
                          Email address
                        </FormLabel>
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

                  <Button
                    type="submit"
                    className="w-full h-12 text-base font-medium shadow-[0_0_20px_rgba(124,58,237,0.2)] mt-2"
                    disabled={emailForm.formState.isSubmitting}
                  >
                    {emailForm.formState.isSubmitting ? (
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    ) : (
                      <>
                        Send reset link <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>

            <CardFooter className="flex justify-center border-t border-white/5 pt-5 pb-6 px-8">
              <Link
                href="/auth/login"
                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back to sign in
              </Link>
            </CardFooter>
          </Card>
        )}

        {/* ── STEP: sent ────────────────────────────────────────────────────── */}
        {step === "sent" && (
          <Card className="glass-card border-white/10 shadow-2xl backdrop-blur-2xl">
            <CardHeader className="space-y-1 text-center pb-4">
              <div className="flex justify-center mb-4">
                <div className="h-14 w-14 rounded-full bg-primary/20 flex items-center justify-center ring-1 ring-primary/30 animate-pulse">
                  <MailCheck className="h-7 w-7 text-primary" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold tracking-tight">
                Check your inbox
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                We've sent a password reset link to your email. It expires in{" "}
                <strong className="text-foreground">1 hour</strong>.
              </CardDescription>
            </CardHeader>

            <CardContent className="px-8 pb-2">
              <div className="rounded-xl bg-primary/10 border border-primary/20 p-4 text-sm text-muted-foreground text-center">
                Didn't get it? Check your spam folder, or{" "}
                <button
                  onClick={() => setStep("request")}
                  className="text-primary hover:underline font-medium"
                >
                  try again
                </button>
                .
              </div>
            </CardContent>

            <CardFooter className="flex justify-center border-t border-white/5 pt-5 pb-6 px-8 mt-2">
              <Link
                href="/auth/login"
                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back to sign in
              </Link>
            </CardFooter>
          </Card>
        )}

        {/* ── STEP: reset (via link from email) ─────────────────────────────── */}
        {step === "reset" && (
          <Card className="glass-card border-white/10 shadow-2xl backdrop-blur-2xl">
            <CardHeader className="space-y-1 text-center pb-6">
              <div className="flex justify-center mb-3">
                <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center ring-1 ring-primary/30">
                  <Lock className="h-6 w-6 text-primary" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold tracking-tight">
                Set new password
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Choose a strong password for your account
              </CardDescription>
            </CardHeader>

            <CardContent className="px-8">
              <Form {...resetForm}>
                <form
                  onSubmit={resetForm.handleSubmit(onResetPassword)}
                  className="space-y-5"
                >
                  <FormField
                    control={resetForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground">
                          New password
                        </FormLabel>
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

                  <FormField
                    control={resetForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground">
                          Confirm password
                        </FormLabel>
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
                    className="w-full h-12 text-base font-medium shadow-[0_0_20px_rgba(124,58,237,0.2)] mt-2"
                    disabled={resetForm.formState.isSubmitting}
                  >
                    {resetForm.formState.isSubmitting ? (
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    ) : (
                      <>
                        Reset password{" "}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>

            <CardFooter className="flex justify-center border-t border-white/5 pt-5 pb-6 px-8">
              <Link
                href="/auth/login"
                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back to sign in
              </Link>
            </CardFooter>
          </Card>
        )}

        {/* ── STEP: done ────────────────────────────────────────────────────── */}
        {step === "done" && (
          <Card className="glass-card border-white/10 shadow-2xl backdrop-blur-2xl">
            <CardHeader className="space-y-1 text-center pb-6">
              <div className="flex justify-center mb-4">
                <div className="h-14 w-14 rounded-full bg-green-500/20 flex items-center justify-center ring-1 ring-green-500/30">
                  <CheckCircle2 className="h-7 w-7 text-green-400" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold tracking-tight">
                Password updated!
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Your password has been reset successfully. You can now sign in
                with your new password.
              </CardDescription>
            </CardHeader>

            <CardContent className="px-8 pb-4">
              <Button
                className="w-full h-12 text-base font-medium"
                onClick={() => setLocation("/auth/login")}
              >
                Go to sign in <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
