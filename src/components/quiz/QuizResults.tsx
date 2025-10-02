import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { QuizSession, QuizCategory } from "@/types/quiz";
import { QuizScore, ScoringEngine } from "@/lib/quiz/scoring";
import { Trophy, Clock, Target, TrendingUp, BookOpen } from "lucide-react";

interface QuizResultsProps {
  session: QuizSession;
  score: QuizScore;
  onRetakeQuiz: () => void;
  onViewHistory: () => void;
}

export default function QuizResults({
  session,
  score,
  onRetakeQuiz,
  onViewHistory,
}: QuizResultsProps) {
  const performance = ScoringEngine.getPerformanceLevel(score.percentage);
  const recommendations = ScoringEngine.generateStudyRecommendations(score);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const categoryLabels: Record<QuizCategory, string> = {
    [QuizCategory.MATH]: "Math",
    [QuizCategory.VERBAL_REASONING]: "Verbal",
    [QuizCategory.LOGICAL_REASONING]: "Logical",
    [QuizCategory.SPATIAL_REASONING]: "Spatial",
  };

  const categoryColors: Record<QuizCategory, string> = {
    [QuizCategory.MATH]: "bg-blue-100 text-blue-800",
    [QuizCategory.VERBAL_REASONING]: "bg-green-100 text-green-800",
    [QuizCategory.LOGICAL_REASONING]: "bg-purple-100 text-purple-800",
    [QuizCategory.SPATIAL_REASONING]: "bg-orange-100 text-orange-800",
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto p-4 sm:p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Trophy className="w-16 h-16 text-yellow-500" />
          </div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            Quiz Completed!
          </h1>
          <p className="text-lg text-slate-600">
            Great job finishing the CCAT practice quiz
          </p>
        </div>

        {/* Overall Score */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Overall Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4 mb-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-slate-800">
                  {score.totalScore}/{score.totalQuestions}
                </div>
                <div className="text-sm text-slate-500">Correct Answers</div>
              </div>

              <div className="text-center">
                <div className={`text-3xl font-bold ${performance.color}`}>
                  {score.percentage.toFixed(1)}%
                </div>
                <div className="text-sm text-slate-500">Overall Score</div>
              </div>

              <div className="text-center">
                <div className="text-3xl font-bold text-slate-800">
                  {formatTime(score.timeSpent)}
                </div>
                <div className="text-sm text-slate-500">Time Spent</div>
              </div>

              <div className="text-center">
                <div className="text-3xl font-bold text-slate-800">
                  {score.averageTimePerQuestion.toFixed(1)}s
                </div>
                <div className="text-sm text-slate-500">Avg per Question</div>
              </div>
            </div>

            <div className="text-center">
              <Badge
                className={`text-lg px-4 py-2 ${performance.color
                  .replace("text-", "bg-")
                  .replace("-600", "-100")} ${performance.color}`}
              >
                {performance.level}
              </Badge>
              <p className="text-sm text-slate-600 mt-2">
                {performance.description}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Category Breakdown */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Category Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(score.categoryScores).map(
                ([category, catScore]) => {
                  if (catScore.total === 0) return null;

                  const categoryPerf =
                    ScoringEngine.getCategoryPerformance(catScore);

                  return (
                    <div key={category} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <Badge
                            className={categoryColors[category as QuizCategory]}
                          >
                            {categoryLabels[category as QuizCategory]}
                          </Badge>
                          <span className="text-sm text-slate-600">
                            {catScore.correct}/{catScore.total} correct
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-semibold ${categoryPerf.color}`}
                          >
                            {catScore.percentage.toFixed(1)}%
                          </span>
                          <Badge
                            variant="outline"
                            className={categoryPerf.color}
                          >
                            {categoryPerf.level}
                          </Badge>
                        </div>
                      </div>
                      <Progress value={catScore.percentage} className="h-2" />
                    </div>
                  );
                }
              )}
            </div>
          </CardContent>
        </Card>

        {/* Study Recommendations */}
        {recommendations.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Study Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {recommendations.map((recommendation, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span className="text-slate-700">{recommendation}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={onRetakeQuiz} size="lg" className="px-8">
            Take Another Quiz
          </Button>
          <Button
            onClick={onViewHistory}
            variant="outline"
            size="lg"
            className="px-8"
          >
            View History
          </Button>
        </div>

        {/* Session Details */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-slate-600">
              Session Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-slate-600">
              <div>
                <span className="font-medium">Session ID:</span> {session.id}
              </div>
              <div>
                <span className="font-medium">Started:</span>{" "}
                {new Intl.DateTimeFormat("en-US", {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                }).format(session.startTime)}
              </div>
              <div>
                <span className="font-medium">Status:</span>{" "}
                <Badge
                  variant={
                    session.status === "completed" ? "default" : "secondary"
                  }
                >
                  {session.status}
                </Badge>
              </div>
              <div>
                <span className="font-medium">Categories:</span>{" "}
                {session.questions
                  .map((q) => categoryLabels[q.category])
                  .filter((value, index, self) => self.indexOf(value) === index)
                  .join(", ")}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
