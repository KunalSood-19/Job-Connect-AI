import { Cookie, Settings, BarChart3, Shield, RefreshCw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const cookieTypes = [
  {
    id: "essential", icon: Shield, label: "Essential Cookies", required: true,
    desc: "These cookies are necessary for the platform to function and cannot be disabled. They include session tokens, security cookies, and preference storage.",
    examples: ["session_token (auth)", "csrf_token (security)", "cookie_consent (remembers your choices)"],
  },
  {
    id: "analytics", icon: BarChart3, label: "Analytics Cookies", required: false,
    desc: "Help us understand how visitors interact with our platform so we can improve the experience. All data is anonymized.",
    examples: ["_ga, _gid (Google Analytics)", "ph_session (PostHog)", "amplitude_session"],
  },
  {
    id: "functional", icon: Settings, label: "Functional Cookies", required: false,
    desc: "Enable enhanced features and personalization, such as remembering your preferences, theme, and saved job filters.",
    examples: ["jobconnect-theme (dark/light)", "search_filters (last used)", "interview_progress (session)"],
  },
];

export function CookiesPage() {
  const { toast } = useToast();
  const [prefs, setPrefs] = useState({ analytics: true, functional: true });

  const save = () => toast({ title: "Cookie preferences saved", description: "Your settings have been applied." });

  return (
    <div className="min-h-screen bg-background">
      <div className="relative border-b border-white/5 py-20 overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/8 rounded-full blur-[120px] pointer-events-none" />
        <div className="container mx-auto px-4 max-w-3xl relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-6">
            <Cookie className="w-4 h-4" /> Cookie Policy
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Cookie Policy</h1>
          <p className="text-muted-foreground text-lg">We use cookies to make JobConnect AI work, improve your experience, and understand how people use the platform.</p>
          <p className="text-sm text-muted-foreground mt-6">Last updated: July 2, 2026</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 max-w-3xl space-y-12 text-sm text-muted-foreground">
        <section>
          <h2 className="text-xl font-bold text-foreground mb-4">What are cookies?</h2>
          <p className="leading-relaxed mb-3">Cookies are small text files placed on your device by websites you visit. They are widely used to make websites work, work more efficiently, and to provide information to website owners.</p>
          <p className="leading-relaxed">We also use similar technologies like local storage, session storage, and pixel tags — this policy covers all of them.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-foreground mb-6">Your preferences</h2>
          <div className="space-y-4">
            {cookieTypes.map(ct => (
              <Card key={ct.id} className="glass-card border-white/5">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                        <ct.icon className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-foreground">{ct.label}</h3>
                          {ct.required && <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Always on</span>}
                        </div>
                        <p className="text-sm mb-3 leading-relaxed">{ct.desc}</p>
                        <div className="space-y-1">
                          {ct.examples.map(ex => (
                            <p key={ex} className="text-xs font-mono text-muted-foreground/70 flex items-center gap-1.5">
                              <span className="w-1 h-1 rounded-full bg-muted-foreground/40 shrink-0" />{ex}
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>
                    {!ct.required && (
                      <button
                        role="switch"
                        aria-checked={prefs[ct.id as keyof typeof prefs]}
                        onClick={() => setPrefs(p => ({ ...p, [ct.id]: !p[ct.id as keyof typeof p] }))}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors shrink-0 mt-1 ${prefs[ct.id as keyof typeof prefs] ? "bg-primary" : "bg-white/10"}`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${prefs[ct.id as keyof typeof prefs] ? "translate-x-6" : "translate-x-1"}`} />
                      </button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="flex gap-3 mt-6">
            <Button onClick={save} className="bg-primary hover:bg-primary/90 text-white">Save preferences</Button>
            <Button variant="outline" className="glass" onClick={() => { setPrefs({ analytics: false, functional: false }); toast({ title: "All optional cookies disabled" }); }}>
              Reject optional
            </Button>
            <Button variant="ghost" className="text-muted-foreground" onClick={() => { setPrefs({ analytics: true, functional: true }); toast({ title: "All cookies accepted" }); }}>
              Accept all
            </Button>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold text-foreground mb-4">Third-party cookies</h2>
          <p className="leading-relaxed mb-3">Some features of our platform use services provided by third parties, which may set their own cookies:</p>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { name: "Google Analytics", purpose: "Usage analytics" },
              { name: "PostHog", purpose: "Product analytics" },
              { name: "Intercom", purpose: "Customer support chat" },
              { name: "Cloudflare", purpose: "Security & performance" },
            ].map(tp => (
              <div key={tp.name} className="flex items-center justify-between p-3 rounded-lg bg-white/3 border border-white/5">
                <span className="font-medium text-foreground text-sm">{tp.name}</span>
                <span className="text-xs text-muted-foreground">{tp.purpose}</span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold text-foreground mb-4">How to manage cookies in your browser</h2>
          <p className="leading-relaxed mb-4">You can also control cookies directly in your browser settings. Note that disabling all cookies may affect platform functionality.</p>
          <div className="grid sm:grid-cols-2 gap-2">
            {[
              { browser: "Chrome", url: "chrome://settings/cookies" },
              { browser: "Firefox", url: "about:preferences#privacy" },
              { browser: "Safari", url: "Preferences → Privacy" },
              { browser: "Edge", url: "Settings → Cookies" },
            ].map(b => (
              <div key={b.browser} className="flex items-center gap-2 p-2 text-sm">
                <RefreshCw className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-foreground font-medium">{b.browser}:</span>
                <span className="text-muted-foreground font-mono text-xs">{b.url}</span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold text-foreground mb-4">Contact</h2>
          <p className="leading-relaxed">Questions about our cookie use? Email <a href="mailto:privacy@jobconnect.ai" className="text-primary hover:underline">privacy@jobconnect.ai</a>.</p>
        </section>
      </div>
    </div>
  );
}
