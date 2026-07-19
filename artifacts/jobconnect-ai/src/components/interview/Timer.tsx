import { Clock } from "lucide-react";

interface Props {
  seconds: number;
}

export default function Timer({
  seconds,
}: Props) {

  const min = Math.floor(seconds / 60);

  const sec = seconds % 60;

  const danger = seconds <= 60;

  return (

    <div
      className={`
      flex
      items-center
      gap-2
      font-bold
      text-xl
      ${
        danger
          ? "text-red-600"
          : "text-violet-600"
      }
      `}
    >

      <Clock className="w-5 h-5"/>

      {min}:{sec.toString().padStart(2, "0")}

    </div>

  );

}