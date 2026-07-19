import { useEffect } from "react";

export default function useTimer(
  timeLeft: number,
  setTimeLeft: React.Dispatch<
    React.SetStateAction<number>
  >,
  paused: boolean
) {

  useEffect(() => {

    if (paused) return;

    if (timeLeft <= 0) return;

    const interval = setInterval(() => {

      setTimeLeft((prev) => prev - 1);

    }, 1000);

    return () => clearInterval(interval);

  }, [
    timeLeft,
    paused,
    setTimeLeft,
  ]);

}