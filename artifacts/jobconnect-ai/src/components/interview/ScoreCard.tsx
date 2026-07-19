import { Card, CardContent } from "@/components/ui/card";

interface Props {
  title: string;
  value: string | number;
  color?: string;
}

export default function ScoreCard({
  title,
  value,
  color = "text-violet-600",
}: Props) {

  return (

    <Card>

      <CardContent className="pt-6 text-center">

        <p className="text-sm text-muted-foreground">

          {title}

        </p>

        <h2 className={`text-5xl font-bold mt-3 ${color}`}>

          {value}

        </h2>

      </CardContent>

    </Card>

  );

}