import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Progress } from "@/components/ui/progress";

import { Clock } from "lucide-react";

interface Props {
  currentQuestion: number;
  totalQuestions: number;
  timeLeft: number;
}

export default function ProgressHeader({
  currentQuestion,
  totalQuestions,
  timeLeft,
}: Props) {

  const progress =
    totalQuestions > 0
      ? (currentQuestion / totalQuestions) * 100
      : 0;

  const minutes = Math.floor(timeLeft / 60);

  const seconds = timeLeft % 60;

  return (

    <Card className="shadow-lg">

      <CardHeader>

        <div className="flex justify-between items-center">

          <div>

            <CardTitle>

              AI Interview

            </CardTitle>

            <p className="text-muted-foreground">

              Question {currentQuestion} of {totalQuestions}

            </p>

          </div>

          <div className="flex items-center gap-2 text-xl font-bold">

            <Clock className="h-5 w-5 text-red-500" />

            {minutes}:{seconds.toString().padStart(2, "0")}

          </div>

        </div>

      </CardHeader>

      <CardContent>

        <Progress value={progress} />

      </CardContent>

    </Card>

  );

}