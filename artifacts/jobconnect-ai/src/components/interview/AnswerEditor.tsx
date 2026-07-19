import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  answer: string;
  setAnswer: (value: string) => void;
  disabled?: boolean;
}

export default function AnswerEditor({
  answer,
  setAnswer,
  disabled = false,
}: Props) {
  const words = answer
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  const wordCount = words.length;

  return (
    <Card className="shadow-lg">

      <CardHeader>

        <CardTitle>Your Answer</CardTitle>

      </CardHeader>

      <CardContent>

        <textarea
          rows={12}
          value={answer}
          disabled={disabled}
          placeholder="Write your answer here..."
          onChange={(e) => setAnswer(e.target.value)}
          className="
            w-full
            rounded-xl
            border
            p-5
            resize-none
            outline-none
            text-base
            focus:ring-2
            focus:ring-violet-500
          "
        />

        <div className="flex justify-between items-center mt-4">

          <div className="text-sm text-muted-foreground">

            Characters : {answer.length}

          </div>

          <div className="text-sm text-muted-foreground">

            Words : {wordCount}

          </div>

        </div>

        {answer.length > 0 && answer.length < 40 && (

          <p className="mt-3 text-sm text-orange-500">

            Try writing a more detailed answer for better AI evaluation.

          </p>

        )}

      </CardContent>

    </Card>
  );
}