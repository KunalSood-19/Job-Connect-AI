import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  CheckCircle,
  AlertTriangle,
  Star,
  Lightbulb,
} from "lucide-react";

interface Feedback {
  score: number;
  feedback: string;
  betterAnswer: string;
  strengths: string[];
  weaknesses: string[];
}

interface Props {
  feedback: Feedback;
}

export default function FeedbackCard({ feedback }: Props) {
  return (
    <Card className="border-green-500 shadow-lg">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>AI Evaluation</CardTitle>

          <div className="flex items-center gap-2">
            <Star className="w-6 h-6 text-yellow-500" />

            <span className="text-3xl font-bold text-green-600">
              {feedback?.score ?? 0}/10
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Feedback */}
        <div>
          <h3 className="font-semibold text-lg mb-2">
            Feedback
          </h3>

          <p className="text-muted-foreground">
            {typeof feedback?.feedback === "string"
              ? feedback.feedback
              : JSON.stringify(feedback?.feedback ?? "")}
          </p>
        </div>

        {/* Better Answer */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="w-5 h-5 text-yellow-500" />

            <h3 className="font-semibold">
              Better Answer
            </h3>
          </div>

          <p className="text-muted-foreground">
            {typeof feedback?.betterAnswer === "string"
              ? feedback.betterAnswer
              : JSON.stringify(feedback?.betterAnswer ?? "")}
          </p>
        </div>

        {/* Strengths */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-5 h-5 text-green-600" />

            <h3 className="font-semibold">
              Strengths
            </h3>
          </div>

          {feedback?.strengths?.length ? (
            <ul className="list-disc pl-6 space-y-2">
              {feedback.strengths.map((item, index) => (
                <li key={index}>
                  {typeof item === "string"
                    ? item
                    : JSON.stringify(item)}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground">
              No strengths available.
            </p>
          )}
        </div>

        {/* Weaknesses */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-orange-500" />

            <h3 className="font-semibold">
              Areas to Improve
            </h3>
          </div>

          {feedback?.weaknesses?.length ? (
            <ul className="list-disc pl-6 space-y-2">
              {feedback.weaknesses.map((item, index) => (
                <li key={index}>
                  {typeof item === "string"
                    ? item
                    : JSON.stringify(item)}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground">
              No improvements suggested.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}