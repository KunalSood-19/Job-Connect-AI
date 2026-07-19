import { useEffect, useState } from "react";
import { useLocation } from "wouter";

import { getHistory } from "@/api/aiInterview";

import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import {
  History,
  Trophy,
  Calendar,
  Brain,
} from "lucide-react";

interface InterviewAnswer {
  question: string;
  answer: string;
  score: number;
}

interface InterviewHistoryItem {
  id: string;
  role: string;
  difficulty: string;
  score: number;
  startedAt: string;
  completedAt: string;
  answers: InterviewAnswer[];
}

export default function InterviewHistory() {

  const [, navigate] = useLocation();

  const [loading, setLoading] = useState(true);

  const [history, setHistory] = useState<
    InterviewHistoryItem[]
  >([]);

  useEffect(() => {

    loadHistory();

  }, []);

  async function loadHistory() {

    try {

      const userId =
        localStorage.getItem("userId") || "";

      const data = await getHistory(userId);

      setHistory(data);

    } catch (err) {

      console.error(err);

    } finally {

      setLoading(false);

    }

  }  if (loading) {

    return (

      <div className="min-h-screen flex items-center justify-center">

        <Brain className="w-12 h-12 animate-pulse text-violet-600"/>

      </div>

    );

  }  return (

    <div className="min-h-screen bg-background p-8">

      <div className="max-w-6xl mx-auto">

        <div className="flex justify-between items-center mb-8">

          <div>

            <h1 className="text-4xl font-bold">

              Interview History

            </h1>

            <p className="text-muted-foreground mt-2">

              View all your previous AI interviews

            </p>

          </div>

          <Button
            onClick={() => navigate("/interview")}
          >

            New Interview

          </Button>

        </div>
                {history.length === 0 ? (

          <Card>

            <CardContent className="py-20 text-center">

              <History className="h-14 w-14 mx-auto text-violet-600 mb-4" />

              <h2 className="text-2xl font-bold">

                No Interviews Yet

              </h2>

              <p className="text-muted-foreground mt-2">

                Start your first AI interview to track your progress.

              </p>

              <Button
                className="mt-6"
                onClick={() => navigate("/interview")}
              >

                Start Interview

              </Button>

            </CardContent>

          </Card>

        ) : (

          <div className="grid lg:grid-cols-2 gap-6">

            {history.map((session) => (

              <Card
                key={session.id}
                className="hover:shadow-xl transition-all duration-300"
              >

                <CardHeader>

                  <div className="flex justify-between items-center">

                    <div>

                      <CardTitle className="text-xl">

                        {session.role}

                      </CardTitle>

                      <p className="text-sm text-muted-foreground mt-1">

                        {session.difficulty} Interview

                      </p>

                    </div>

                    <Trophy className="h-8 w-8 text-yellow-500" />

                  </div>

                </CardHeader>

                <CardContent>

                  <div className="grid grid-cols-2 gap-4">

                    <div className="rounded-lg border p-4">

                      <p className="text-sm text-muted-foreground">

                        Score

                      </p>

                      <h2 className="text-3xl font-bold text-violet-600 mt-2">

                        {session.score.toFixed(1)}

                      </h2>

                    </div>

                    <div className="rounded-lg border p-4">

                      <p className="text-sm text-muted-foreground">

                        Questions

                      </p>

                      <h2 className="text-3xl font-bold mt-2">

                        {session.answers.length}

                      </h2>

                    </div>

                  </div>

                  <div className="flex items-center gap-2 mt-5 text-sm text-muted-foreground">

                    <Calendar className="h-4 w-4" />

                    {new Date(session.startedAt).toLocaleDateString()}

                  </div>
                                    <div className="flex gap-3 mt-6">

                    <Button
                      className="flex-1"
                      onClick={() => {

                        sessionStorage.setItem(
                          "interviewReport",
                          JSON.stringify({
                            score: session.score,
                            answers: session.answers,
                          })
                        );

                        navigate("/interview/report");

                      }}
                    >

                      View Report

                    </Button>

                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => {

                        sessionStorage.removeItem(
                          "interviewSession"
                        );

                        navigate("/interview");

                      }}
                    >

                      Practice Again

                    </Button>

                  </div>

                </CardContent>

              </Card>

            ))}

          </div>

        )}

      </div>

    </div>

  );

}