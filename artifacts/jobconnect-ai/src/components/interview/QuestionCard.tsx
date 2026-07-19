import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

import { Brain } from "lucide-react";

interface Props {
  question: string;
  topic: string;
  questionNumber: number;
  totalQuestions: number;
}

export default function QuestionCard({
  question,
  topic,
  questionNumber,
  totalQuestions,
}: Props) {

  return (

    <Card className="shadow-lg border">

      <CardHeader>

        <div className="flex justify-between items-center">

          <div>

            <CardTitle className="text-2xl">

              Technical Question

            </CardTitle>

            <p className="text-muted-foreground mt-2">

              Question {questionNumber} of {totalQuestions}

            </p>

          </div>

          <Brain className="w-9 h-9 text-violet-600"/>

        </div>

      </CardHeader>

      <CardContent>
                <Badge
          variant="secondary"
          className="mb-5"
        >

          {topic}

        </Badge>

        <div
          className="
          rounded-xl
          bg-muted
          p-6
          border
          "
        >

          <h2
            className="
            text-2xl
            font-semibold
            leading-10
            "
          >

            {question}

          </h2>

        </div>

      </CardContent>

    </Card>

  );

}