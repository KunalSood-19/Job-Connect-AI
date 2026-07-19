import { useEffect, useState } from "react";
import { getRecruiterAnalytics } from "@/api/analytics";

export default function Analytics() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    loadAnalytics();
  }, []);

  async function loadAnalytics() {
    const analytics = await getRecruiterAnalytics();
    setData(analytics);
  }

  if (!data) {
    return (
      <div className="p-8">
        Loading...
      </div>
    );
  }

  return (
    <div className="p-8">

      <h1 className="text-3xl font-bold mb-8">
        Recruiter Analytics
      </h1>

      <div className="grid md:grid-cols-3 gap-6">

        <Card
          title="Jobs Posted"
          value={data.totalJobs}
        />

        <Card
          title="Applicants"
          value={data.totalApplicants}
        />

        <Card
          title="Interviews"
          value={data.interviews}
        />

        <Card
          title="Offers Sent"
          value={data.offers}
        />

        <Card
          title="Accepted"
          value={data.accepted}
        />

        <Card
          title="Rejected"
          value={data.rejected}
        />

      </div>

    </div>
  );
}

function Card({
  title,
  value,
}: {
  title: string;
  value: number;
}) {
  return (
    <div className="rounded-xl border bg-card p-6 shadow">

      <p className="text-sm text-muted-foreground">
        {title}
      </p>

      <h2 className="text-4xl font-bold mt-2">
        {value}
      </h2>

    </div>
  );
}