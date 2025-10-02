import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface QuizTimerProps {
  duration: number; // in seconds
  onTimeUp: () => void;
  onTimeUpdate: (seconds: number) => void;
}

export default function QuizTimer({
  duration,
  onTimeUp,
  onTimeUpdate,
}: QuizTimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isRunning, setIsRunning] = useState(true);

  useEffect(() => {
    if (!isRunning || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = prev - 1;
        onTimeUpdate(duration - newTime);

        if (newTime <= 0) {
          onTimeUp();
          return 0;
        }

        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, duration, onTimeUp, onTimeUpdate]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const isLowTime = timeLeft <= 120; // Less than 2 minutes
  const isCriticalTime = timeLeft <= 30; // Less than 30 seconds

  return (
    <Card
      className={`w-32 py-1 ${
        isCriticalTime
          ? "bg-red-100 border-red-300"
          : isLowTime
          ? "bg-amber-100 border-amber-300"
          : "bg-white"
      }`}
    >
      <CardContent className="p-1">
        <div className="text-center">
          <div
            className={`text-lg font-bold ${
              isCriticalTime
                ? "text-red-600"
                : isLowTime
                ? "text-amber-600"
                : "text-slate-800"
            }`}
          >
            {formatTime(timeLeft)}
          </div>
          <div className="text-xs text-slate-500">
            {isCriticalTime
              ? "Time Critical!"
              : isLowTime
              ? "Low Time"
              : "Time Left"}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
