import { useMemo } from "react";
import { useLocation } from "wouter";

import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import {
  Trophy,
  Brain,
  CheckCircle,
  AlertTriangle,
  RotateCcw,
  Home,
} from "lucide-react";

interface Feedback {
  score: number;
  feedback: string;
  betterAnswer: string;
  strengths: string[];
  weaknesses: string[];
}

interface Answer {
  question: string;
  answer: string;
  score: number;
  feedback: Feedback;
}
interface Report {
  score: number;
  answers: Answer[];
}

export default function InterviewReport() {
  const [, navigate] = useLocation();

  const report: Report | null = useMemo(() => {
    const raw = sessionStorage.getItem("interviewReport");

    if (!raw) return null;

    return JSON.parse(raw);
  }, []);

  if (!report) {
    return (
      <div className="min-h-screen flex items-center justify-center">

        <Card className="w-[500px]">

          <CardContent className="py-12 text-center">

            <Brain className="h-12 w-12 mx-auto text-violet-600 mb-4" />

            <h2 className="text-2xl font-bold">
              Report Not Found
            </h2>

            <Button
              className="mt-6"
              onClick={() => navigate("/interview")}
            >
              Back
            </Button>

          </CardContent>

        </Card>

      </div>
    );
  }

  const average =
    report.answers.length > 0
      ? report.answers.reduce(
          (sum: number, item: Answer) =>
            sum + item.score,
          0
        ) / report.answers.length
      : 0;

  const strengths = report.answers.filter(
    (item) => item.score >= 8
  );

  const improvements = report.answers.filter(
    (item) => item.score < 8
  );

  return (

    <div className="min-h-screen bg-background p-8">

      <div className="max-w-6xl mx-auto space-y-8">

        <Card>

          <CardHeader>

            <div className="flex items-center gap-4">

              <Trophy className="h-10 w-10 text-yellow-500" />

              <div>

                <CardTitle className="text-3xl">

                  Interview Completed

                </CardTitle>

                <p className="text-muted-foreground mt-1">

                  AI Performance Report

                </p>

              </div>

            </div>

          </CardHeader>

          <CardContent>

            <div className="grid md:grid-cols-3 gap-6">
                              <Card className="border">

                <CardContent className="pt-6 text-center">

                  <p className="text-muted-foreground text-sm">
                    Overall Score
                  </p>

                  <h2 className="text-5xl font-bold mt-3 text-violet-600">
                    {report.score.toFixed(1)}
                  </h2>

                  <p className="mt-2 text-sm text-muted-foreground">
                    Out of 10
                  </p>

                </CardContent>

              </Card>

              <Card className="border">

                <CardContent className="pt-6 text-center">

                  <p className="text-muted-foreground text-sm">
                    Average Score
                  </p>

                  <h2 className="text-5xl font-bold mt-3 text-green-600">
                    {average.toFixed(1)}
                  </h2>

                  <p className="mt-2 text-sm text-muted-foreground">
                    Per Question
                  </p>

                </CardContent>

              </Card>

              <Card className="border">

                <CardContent className="pt-6 text-center">

                  <p className="text-muted-foreground text-sm">
                    Questions Answered
                  </p>

                  <h2 className="text-5xl font-bold mt-3">
                    {report.answers.length}
                  </h2>

                  <p className="mt-2 text-sm text-muted-foreground">
                    Total Questions
                  </p>

                </CardContent>

              </Card>

            </div>

          </CardContent>

        </Card>

        {/* ================= Strengths & Improvements ================= */}

        <div className="grid md:grid-cols-2 gap-6">

          <Card>

            <CardHeader>

              <div className="flex items-center gap-2">

                <CheckCircle className="h-6 w-6 text-green-600" />

                <CardTitle>
                  Strong Areas
                </CardTitle>

              </div>

            </CardHeader>

            <CardContent>

              {strengths.length === 0 ? (

                <p className="text-muted-foreground">
                  No strong areas identified yet.
                </p>

              ) : (

                <ul className="space-y-3">

                  {strengths.map((item, index) => (

                    <li
                      key={index}
                      className="rounded-lg border p-3"
                    >
                      {item.question}
                    </li>

                  ))}

                </ul>

              )}

            </CardContent>

          </Card>

          <Card>

            <CardHeader>

              <div className="flex items-center gap-2">

                <AlertTriangle className="h-6 w-6 text-orange-500" />

                <CardTitle>
                  Needs Improvement
                </CardTitle>

              </div>

            </CardHeader>

            <CardContent>

              {improvements.length === 0 ? (

                <p className="text-muted-foreground">
                  Excellent Performance 🎉
                </p>

              ) : (

                <ul className="space-y-3">

                  {improvements.map((item, index) => (

                    <li
                      key={index}
                      className="rounded-lg border p-3"
                    >
                      {item.question}
                    </li>

                  ))}

                </ul>

              )}

            </CardContent>

          </Card>

        </div>
                {/* ================= Question-wise Analysis ================= */}

        <Card>

          <CardHeader>

            <CardTitle>

              Question-wise Analysis

            </CardTitle>

          </CardHeader>

          <CardContent>

            <div className="space-y-6">

              {report.answers.map((item, index) => (

                <Card
                  key={index}
                  className="border"
                >

                  <CardContent className="pt-6">

                    <h3 className="font-semibold text-lg">

                      Q{index + 1}. {item.question}

                    </h3>

                    <div className="mt-5">

                      <p className="font-semibold">

                        Your Answer

                      </p>

                      <p className="text-muted-foreground mt-1">

                        {item.answer}

                      </p>

                    </div>

                    <div className="mt-5">

                      <p className="font-semibold">

                        AI Feedback

                      </p>

                    <p className="text-muted-foreground mt-1">
  {item.feedback.feedback}
</p>

                    </div>

                    <div className="flex justify-between items-center mt-6">

                      <span className="font-semibold">

                        Score

                      </span>

                      <span className="text-3xl font-bold text-violet-600">

                        {item.score}/10

                      </span>

                    </div>

                  </CardContent>

                </Card>

              ))}

            </div>

          </CardContent>

        </Card>

        {/* ================= ACTION BUTTONS ================= */}

        <div className="flex flex-wrap justify-center gap-4">

          <Button
            size="lg"
            onClick={() => {
              sessionStorage.removeItem("interviewSession");
              sessionStorage.removeItem("interviewReport");
              navigate("/interview");
            }}
          >

            <RotateCcw className="mr-2 h-5 w-5" />

            Practice Again

          </Button>

          <Button
            variant="outline"
            size="lg"
            onClick={() => navigate("/dashboard/student")}
          >

            <Home className="mr-2 h-5 w-5" />

            Dashboard

          </Button>

          <Button
            variant="secondary"
            size="lg"
            onClick={() => window.print()}
          >

            Print Report

          </Button>

        </div>

      </div>

    </div>

  );

}