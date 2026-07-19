import { useEffect, useMemo, useState } from "react";
import { useLocation } from "wouter";

import { submitAnswer, finishInterview } from "@/api/aiInterview";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import { Progress } from "@/components/ui/progress";

import { Brain, Clock, Loader2 } from "lucide-react";

interface Question {
  question: string;
  topic: string;
}

interface InterviewSessionData {
  session: {
    id: string;
  };

  questions: Question[];
}

export default function InterviewSession() {
  const [, navigate] = useLocation();

const sessionData: InterviewSessionData = useMemo(() => {
  const raw = sessionStorage.getItem("interviewSession");

  console.log("RAW =", raw);

  if (!raw) {
    return {
      session: { id: "" },
      questions: [],
    };
  }

  const parsed = JSON.parse(raw);

  console.log("PARSED =", parsed);

  return parsed;
}, []);
const questions = sessionData?.questions ?? [];
const sessionId = sessionData?.session?.id ?? "";
  const [currentIndex, setCurrentIndex] = useState(0);

  const [answer, setAnswer] = useState("");

  const [loading, setLoading] = useState(false);

  interface Feedback {
    score: number;
    feedback: string;
    betterAnswer: string;
    strengths: string[];
    weaknesses: string[];
  }

  const [feedback, setFeedback] = useState<Feedback | null>(null);

  const [showFeedback, setShowFeedback] = useState(false);

  const [timeLeft, setTimeLeft] = useState(300);

  const currentQuestion = questions[currentIndex];
  useEffect(() => {
    if (showFeedback) return;

    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, showFeedback]);

  const minutes = Math.floor(timeLeft / 60);

  const seconds = timeLeft % 60;

  const progress =
    questions.length > 0 ? ((currentIndex + 1) / questions.length) * 100 : 0;

  const handleSubmitAnswer = async () => {
    try {
      setLoading(true);

      const result = await submitAnswer({
        sessionId,
        question: currentQuestion.question,
        answer,
      });

      console.log(result);

      setFeedback(result);

      setShowFeedback(true);
    } catch (err) {
      console.error(err);
      alert("Unable to evaluate answer.");
    } finally {
      setLoading(false);
    }
  };
  const handleNextQuestion = () => {
    if (currentIndex === questions.length - 1) {
      handleFinishInterview();
      return;
    }

    setCurrentIndex((prev) => prev + 1);

    setAnswer("");

    setFeedback(null);

    setShowFeedback(false);

    setTimeLeft(300);
  };
  const handleFinishInterview = async () => {
    try {
      setLoading(true);

      const report = await finishInterview(sessionId);

      sessionStorage.setItem("interviewReport", JSON.stringify(report));

      navigate("/interview/report");
    } catch (err) {
      console.error(err);

      alert("Unable to finish interview.");
    } finally {
      setLoading(false);
    }
  };
  if (!questions.length) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-[500px]">
          <CardContent className="py-16 text-center">
            <Brain className="mx-auto h-12 w-12 mb-4 text-violet-600" />

            <h2 className="text-2xl font-bold">No Interview Found</h2>

            <p className="text-muted-foreground mt-2">
              Start a new interview first.
            </p>

            <Button className="mt-6" onClick={() => navigate("/interview")}>
              Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>AI Interview</CardTitle>

                <p className="text-muted-foreground">
                  Question {currentIndex + 1} of {questions.length}
                </p>
              </div>

              <div className="flex items-center gap-2 text-lg font-semibold">
                <Clock className="h-5 w-5 text-red-500" />
                {minutes}:{seconds.toString().padStart(2, "0")}
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <Progress value={progress} />
          </CardContent>
        </Card>
        {/* ================= QUESTION ================= */}

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-2xl">Technical Question</CardTitle>

                <p className="text-sm text-muted-foreground mt-1">
                  Topic : {currentQuestion.topic}
                </p>
              </div>

              <Brain className="w-8 h-8 text-violet-600" />
            </div>
          </CardHeader>

          <CardContent>
            <div className="bg-muted rounded-xl p-6">
              <h2 className="text-xl font-semibold leading-8">
                {currentQuestion.question}
              </h2>
            </div>
          </CardContent>
        </Card>
        {/* ================= ANSWER BOX ================= */}

        <Card>
          <CardHeader>
            <CardTitle>Your Answer</CardTitle>
          </CardHeader>

          <CardContent>
            <textarea
              rows={12}

              className="
      w-full
      rounded-xl
      border
      p-5
      resize-none
      text-base
      outline-none
      focus:ring-2
      focus:ring-violet-500
      "

              placeholder="Write your answer here..."

              value={answer}

              onChange={(e) => setAnswer(e.target.value)}
            />

            <div className="flex justify-between mt-3">
              <p className="text-sm text-muted-foreground">
                Explain your answer clearly.
              </p>

              <p className="text-sm">{answer.length} Characters</p>
            </div>
          </CardContent>
        </Card>
        {/* ================= SUBMIT ================= */}

        <div className="flex justify-end">
          <Button
            onClick={handleSubmitAnswer}
            disabled={loading || answer.trim().length === 0}
            size="lg"
            className="px-8"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Evaluating...
              </>
            ) : (
              "Submit Answer"
            )}
          </Button>
        </div>
        {/* ================= FEEDBACK ================= */}

        {showFeedback && feedback && (
          <Card className="border-green-500">
            <CardHeader>
              <CardTitle>AI Evaluation</CardTitle>
            </CardHeader>

            <CardContent>
              <div className="space-y-5">
                <div>
                  <p className="font-semibold">Score</p>

                  <p className="text-3xl font-bold text-green-600">
                    {feedback.score}/10
                  </p>
                </div>
                <div>
                  <p className="font-semibold mb-2">Feedback</p>

                  <p>
                    {typeof feedback.feedback === "string"
                      ? feedback.feedback
                      : JSON.stringify(feedback.feedback)}
                  </p>
                </div>

                <div>
                  <p className="font-semibold mb-2">Better Answer</p>

                  <p>{feedback.betterAnswer}</p>
                </div>
                <div>
                  <p className="font-semibold mb-2">Strengths</p>

                  <ul className="list-disc pl-6">
                    {feedback.strengths?.map((item: string, index: number) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="font-semibold mb-2">Weaknesses</p>

                  <ul className="list-disc pl-6">
                    {feedback.weaknesses?.map((item: string, index: number) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
            <div className="flex justify-end mt-6">
              <Button onClick={handleNextQuestion} size="lg">
                {currentIndex === questions.length - 1
                  ? "Finish Interview"
                  : "Next Question"}
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
