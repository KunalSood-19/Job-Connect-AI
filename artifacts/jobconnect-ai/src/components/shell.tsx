import { ReactNode } from "react";
import { Navbar } from "./navbar";
import { Footer } from "./footer";

interface ShellProps {
  children: ReactNode;
}

export function Shell({ children }: ShellProps) {
  return (
    <div className="min-h-[100dvh] flex flex-col bg-background text-foreground selection:bg-primary/30">
      <div className="fixed inset-0 pointer-events-none z-[-1] bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-background to-background"></div>
      <div className="fixed inset-0 pointer-events-none z-[-1] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay"></div>
      <Navbar />
      <main className="flex-1 flex flex-col w-full relative">
        {children}
      </main>
      <Footer />
    </div>
  );
}