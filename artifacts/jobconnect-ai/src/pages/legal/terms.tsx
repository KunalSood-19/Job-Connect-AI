import { FileText, AlertTriangle, Scale, Users, Briefcase, Ban } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="relative border-b border-white/5 py-20 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/8 rounded-full blur-[120px] pointer-events-none" />
        <div className="container mx-auto px-4 max-w-3xl relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-6">
            <FileText className="w-4 h-4" /> Terms of Service
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms of Service</h1>
          <p className="text-muted-foreground text-lg">Please read these terms carefully before using JobConnect AI. By using our services, you agree to be bound by these terms.</p>
          <p className="text-sm text-muted-foreground mt-6">Last updated: July 2, 2026 · Effective: July 2, 2026</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 max-w-3xl">
        <Card className="glass-card border-amber-500/20 bg-amber-500/5 mb-12">
          <CardContent className="p-6 flex gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-400 mb-1">Important Notice</p>
              <p className="text-sm text-muted-foreground">These terms include an arbitration clause and class action waiver in Section 10. Please read it carefully, as it affects your rights.</p>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-12 text-sm text-muted-foreground leading-relaxed">
          {[
            {
              icon: Scale, num: "1", title: "Acceptance of Terms",
              body: `By accessing or using the JobConnect AI platform (the "Service"), you agree to be bound by these Terms of Service ("Terms") and our Privacy Policy. If you do not agree to all of these terms, do not use the Service.

We may modify these Terms at any time. We will notify you of material changes by email or through the platform. Your continued use of the Service after changes take effect constitutes your acceptance of the new Terms.`
            },
            {
              icon: Users, num: "2", title: "Eligibility & Accounts",
              body: `You must be at least 16 years old to use JobConnect AI. By using the Service, you represent that you meet this requirement.

**Your account:** You are responsible for maintaining the confidentiality of your login credentials. You agree to notify us immediately of any unauthorized use of your account. We are not liable for losses arising from unauthorized use of your account.

**Accurate information:** You must provide accurate, current, and complete information when registering. Impersonating another person or entity is prohibited and may result in immediate account termination.

**One account per person:** Creating multiple accounts for the same individual, or creating accounts for others without their consent, violates these terms.`
            },
            {
              icon: Briefcase, num: "3", title: "Candidate Terms",
              body: `**Resume & profile accuracy:** All information in your profile and resume must be truthful. Misrepresenting your qualifications, experience, or credentials constitutes fraud and may expose you to legal liability.

**Job applications:** When you apply to a job, you consent to your profile and application materials being shared with that employer. You are solely responsible for the accuracy of your applications.

**AI features:** Our AI resume analyzer, interview coach, and recommendation engine are provided as tools to assist you — not as guarantees of employment outcomes. AI suggestions are starting points, not professional career advice.

**No guarantee of employment:** Use of the platform does not guarantee job placement, interviews, or employment.`
            },
            {
              icon: Briefcase, num: "4", title: "Recruiter & Employer Terms",
              body: `**Job postings:** All job postings must be for genuine, legitimate employment opportunities. Postings for pyramid schemes, MLM positions, or deceptive arrangements are strictly prohibited.

**Accurate job descriptions:** Job descriptions must accurately represent the role, requirements, and compensation. Deliberately misleading candidates is prohibited.

**Candidate data:** Candidate data accessed through the platform may only be used for the stated hiring purpose. You may not export, sell, or share candidate data with third parties for other purposes.

**Non-discrimination:** You agree to comply with all applicable employment non-discrimination laws. Using the platform to discriminate based on protected characteristics is prohibited and will result in immediate account termination and may be reported to authorities.

**Compliance:** You are responsible for ensuring your hiring practices comply with all applicable local, state, federal, and international employment laws.`
            },
            {
              icon: Ban, num: "5", title: "Prohibited Conduct",
              body: `You agree not to:

- Scrape, crawl, or systematically extract data from the platform
- Upload malicious code, viruses, or any harmful content
- Attempt to gain unauthorized access to any part of the Service or other users' accounts
- Use the platform to send unsolicited bulk messages (spam)
- Post false, misleading, or deceptive content
- Harass, threaten, or intimidate other users
- Use the platform for any illegal purpose
- Attempt to circumvent any security measures or rate limits
- Create fake profiles or impersonate others
- Share login credentials with others outside your organization

Violations may result in immediate account suspension without refund.`
            },
            {
              icon: Scale, num: "6", title: "Intellectual Property",
              body: `**Our property:** The JobConnect AI platform, including all software, AI models, designs, trademarks, and content we create, is owned by JobConnect AI, Inc. and protected by intellectual property laws.

**Your content:** You retain ownership of the content you submit (resume, profile, cover letters). By submitting content, you grant us a worldwide, non-exclusive, royalty-free license to use, display, and process your content for the purpose of providing the Service.

**Feedback:** Any feedback or suggestions you provide may be used by us without restriction or compensation.`
            },
            {
              icon: AlertTriangle, num: "7", title: "Disclaimers",
              body: `THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND. TO THE MAXIMUM EXTENT PERMITTED BY LAW, JOBCONNECT AI DISCLAIMS ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.

We do not warrant that: the Service will be uninterrupted or error-free; AI recommendations will be accurate or suitable for your situation; job postings are accurate or opportunities will remain available; use of the Service will result in job placement.`
            },
            {
              icon: Scale, num: "8", title: "Limitation of Liability",
              body: `TO THE MAXIMUM EXTENT PERMITTED BY LAW, JOBCONNECT AI AND ITS OFFICERS, DIRECTORS, EMPLOYEES, AND AGENTS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY.

OUR TOTAL LIABILITY TO YOU FOR ANY CLAIM ARISING FROM THESE TERMS OR YOUR USE OF THE SERVICE SHALL NOT EXCEED THE GREATER OF $100 OR THE AMOUNT YOU PAID US IN THE 12 MONTHS PRECEDING THE CLAIM.`
            },
            {
              icon: Scale, num: "9", title: "Governing Law",
              body: `These Terms are governed by the laws of the State of California, without regard to conflict of law principles. Any disputes not subject to arbitration will be resolved in the state or federal courts located in San Francisco, California, and you consent to personal jurisdiction in those courts.`
            },
            {
              icon: Scale, num: "10", title: "Arbitration & Class Action Waiver",
              body: `PLEASE READ THIS SECTION CAREFULLY — IT AFFECTS YOUR LEGAL RIGHTS.

Most disputes can be resolved by contacting us at support@jobconnect.ai. For disputes that cannot be resolved informally, you and JobConnect AI agree to resolve them through binding individual arbitration under the American Arbitration Association's rules, not in court.

YOU WAIVE YOUR RIGHT TO A JURY TRIAL AND TO PARTICIPATE IN CLASS ACTION LAWSUITS. You may opt out of this arbitration agreement by notifying us in writing within 30 days of first accepting these Terms.`
            },
            {
              icon: FileText, num: "11", title: "Contact",
              body: `Questions about these Terms? Contact us:

**Email:** legal@jobconnect.ai
**Address:** JobConnect AI, Inc., 548 Market St, Suite 12345, San Francisco, CA 94104`
            },
          ].map(s => (
            <section key={s.num} id={`section-${s.num}`}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <s.icon className="w-4 h-4 text-primary" />
                </div>
                <h2 className="text-xl font-bold text-foreground">{s.num}. {s.title}</h2>
              </div>
              <div className="space-y-3">
                {s.body.split("\n\n").map((para, i) => {
                  if (para.startsWith("-")) {
                    return (
                      <ul key={i} className="space-y-1.5">
                        {para.split("\n").map((line, j) => (
                          <li key={j} className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                            <span>{line.slice(2)}</span>
                          </li>
                        ))}
                      </ul>
                    );
                  }
                  return <p key={i} className={para === para.toUpperCase() && para.length > 30 ? "text-xs text-foreground/70" : ""} dangerouslySetInnerHTML={{ __html: para.replace(/\*\*(.*?)\*\*/g, "<strong class='text-foreground'>$1</strong>") }} />;
                })}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
