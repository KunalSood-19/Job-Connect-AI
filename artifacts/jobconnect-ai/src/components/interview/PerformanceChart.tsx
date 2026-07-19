import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Answer {
  question: string;
  score: number;
}

interface Props {
  answers: Answer[];
}

export default function PerformanceChart({
  answers,
}: Props) {

  const data = answers.map((item, index) => ({
    question: `Q${index + 1}`,
    score: item.score,
  }));

  return (

    <Card>

      <CardHeader>

        <CardTitle>

          Performance Graph

        </CardTitle>

      </CardHeader>

      <CardContent>

        <div className="h-[350px]">

          <ResponsiveContainer
            width="100%"
            height="100%"
          >

            <LineChart data={data}>

              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="question" />

              <YAxis
                domain={[0, 10]}
              />

              <Tooltip />

              <Line
                type="monotone"
                dataKey="score"
                stroke="#7c3aed"
                strokeWidth={4}
              />

            </LineChart>

          </ResponsiveContainer>

        </div>

      </CardContent>

    </Card>

  );

}