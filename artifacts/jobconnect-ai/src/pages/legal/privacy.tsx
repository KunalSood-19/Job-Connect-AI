import { Shield, Lock, Eye, Database, Bell, Mail } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const sections = [
  {
    id: "collect", icon: Database, title: "Information We Collect",
    content: `We collect information you provide directly to us, information we collect automatically when you use our services, and information from third parties.

**Information you provide:**
- Account information (name, email, password) when you register
- Profile information (skills, experience, education, location)
- Resume content you upload or create using our Resume Builder
- Job applications, cover letters, and application materials
- Communications you send to us or other users through the platform

**Information collected automatically:**
- Usage data (pages visited, features used, search queries, clicks)
- Device information (browser type, operating system, IP address)
- Log data (access times, pages viewed, referring URLs)
- Cookies and similar tracking technologies

**Information from third parties:**
- OAuth providers if you sign in with Google or LinkedIn (with your permission)
- Public professional information from LinkedIn when you connect your profile`,
  },
  {
    id: "use", icon: Eye, title: "How We Use Your Information",
    content: `We use the information we collect to operate and improve JobConnect AI, including to:

- Create and maintain your account and profile
- Match you with relevant job opportunities and candidates
- Power our AI features (resume analysis, job recommendations, interview coaching)
- Send you notifications about job matches, application updates, and platform news
- Improve our recommendation algorithms and AI models (using anonymized/aggregated data only)
- Detect and prevent fraud, abuse, and security incidents
- Comply with legal obligations

**We never:**
- Sell your personal data to third parties
- Use your resume data to train AI models without your explicit opt-in consent
- Share your application status with your current employer`,
  },
  {
    id: "share", icon: Shield, title: "How We Share Your Information",
    content: `We share your information only in the following circumstances:

**With employers (your choice):** When you apply to a job or make your profile discoverable, relevant portions of your profile are shared with that employer. You control what's visible.

**With service providers:** We work with trusted vendors (cloud hosting, analytics, email delivery) who process data on our behalf under strict data processing agreements.

**For legal reasons:** We may disclose information when required by law, court order, or to protect the rights and safety of JobConnect AI and our users.

**With your consent:** Any other sharing requires your explicit permission.

**Business transfers:** If JobConnect AI is acquired or merges, user data may transfer to the new entity with equivalent privacy protections.`,
  },
  {
    id: "security", icon: Lock, title: "Data Security",
    content: `We take security seriously and implement industry-standard protections:

- All data is encrypted in transit (TLS 1.3) and at rest (AES-256)
- Passwords are hashed using bcrypt with unique salts — we never store plain-text passwords
- Access to production systems is restricted, logged, and requires multi-factor authentication
- We conduct regular security audits and penetration testing
- API tokens are HMAC-signed and expire automatically

**Your responsibilities:** Use a strong, unique password. Enable two-factor authentication when available. Log out from shared devices.

**Data breaches:** In the unlikely event of a breach affecting your personal data, we will notify you within 72 hours as required by applicable law.`,
  },
  {
    id: "rights", icon: Bell, title: "Your Rights & Choices",
    content: `You have meaningful control over your data:

**Access & Portability:** Download a copy of all data we hold about you from your account settings (Profile → Export My Data).

**Correction:** Update or correct your profile information at any time through your account settings.

**Deletion:** Request deletion of your account and associated data. We will delete your data within 30 days, except where we're required to retain it by law.

**Opt-outs:**
- Marketing emails: unsubscribe link in every email, or manage from Notification Settings
- Profile discoverability: toggle on/off in Privacy Settings
- AI training data opt-out: available in Account Settings → AI & Data

**Residents of the EU, EEA, UK, and California** have additional rights under GDPR and CCPA including the right to object to processing, restrict processing, and lodge a complaint with your local data protection authority.`,
  },
  {
    id: "contact", icon: Mail, title: "Contact Us",
    content: `If you have questions, concerns, or requests related to your privacy, please contact us:

**Privacy Team:** privacy@jobconnect.ai

**Mailing address:**
JobConnect AI, Inc.
548 Market St, Suite 12345
San Francisco, CA 94104

**Data Protection Officer (EU):**
dpo@jobconnect.ai

We will respond to all requests within 30 days. For urgent matters, please mark your email "URGENT – Privacy Request."`,
  },
];

export function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="relative border-b border-white/5 py-20 overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/8 rounded-full blur-[120px] pointer-events-none" />
        <div className="container mx-auto px-4 max-w-3xl relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-6">
            <Shield className="w-4 h-4" /> Privacy Policy
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Your privacy matters</h1>
          <p className="text-muted-foreground text-lg">
            We built JobConnect AI to help people find opportunities, not to exploit their data. This policy explains exactly what we collect, why, and how you stay in control.
          </p>
          <p className="text-sm text-muted-foreground mt-6 pb-1 border-b border-white/10 inline-block">
            Last updated: July 2, 2026 · Effective: July 2, 2026
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 max-w-3xl">
        {/* Quick summary */}
        <Card className="glass-card border-emerald-500/20 bg-emerald-500/5 mb-12">
          <CardContent className="p-6">
            <h2 className="font-semibold text-emerald-400 mb-3">The short version</h2>
            <ul className="space-y-2">
              {[
                "We collect only what we need to run the service",
                "We never sell your personal data — ever",
                "You can export or delete your data at any time",
                "Your resume content is not used to train AI without opt-in",
                "We use HMAC-signed tokens and AES-256 encryption",
              ].map(item => (
                <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Shield className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> {item}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Table of contents */}
        <div className="mb-12">
          <h2 className="font-semibold mb-4 text-sm text-muted-foreground uppercase tracking-wider">Contents</h2>
          <div className="grid sm:grid-cols-2 gap-2">
            {sections.map(s => (
              <a key={s.id} href={`#${s.id}`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors py-1.5 group">
                <s.icon className="w-4 h-4 group-hover:text-primary transition-colors" />
                {s.title}
              </a>
            ))}
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-14">
          {sections.map(s => (
            <section key={s.id} id={s.id}>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <s.icon className="w-4 h-4 text-primary" />
                </div>
                <h2 className="text-xl font-bold">{s.title}</h2>
              </div>
              <div className="text-muted-foreground leading-relaxed space-y-4">
                {s.content.split("\n\n").map((para, i) => {
                  if (para.startsWith("**") && para.endsWith("**")) {
                    return <h3 key={i} className="font-semibold text-foreground text-sm">{para.slice(2, -2)}</h3>;
                  }
                  if (para.startsWith("-")) {
                    return (
                      <ul key={i} className="space-y-1.5">
                        {para.split("\n").map((line, j) => (
                          <li key={j} className="flex items-start gap-2 text-sm">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                            <span dangerouslySetInnerHTML={{ __html: line.slice(2).replace(/\*\*(.*?)\*\*/g, "<strong class='text-foreground'>$1</strong>") }} />
                          </li>
                        ))}
                      </ul>
                    );
                  }
                  return <p key={i} className="text-sm" dangerouslySetInnerHTML={{ __html: para.replace(/\*\*(.*?)\*\*/g, "<strong class='text-foreground'>$1</strong>") }} />;
                })}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
