import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QuizSession, QuizCategory } from "@/types/quiz";
import { CheckCircle, XCircle, Clock, ArrowLeft } from "lucide-react";

interface ReviewQuestionsPageProps {
  session: QuizSession;
  onBack: () => void;
}

export function ReviewQuestionsPage({
  session,
  onBack,
}: ReviewQuestionsPageProps) {
  const categoryLabels: Record<QuizCategory, string> = {
    [QuizCategory.MATH]: "Math",
    [QuizCategory.VERBAL_REASONING]: "Verbal Reasoning",
    [QuizCategory.LOGICAL_REASONING]: "Logical Reasoning",
    [QuizCategory.SPATIAL_REASONING]: "Spatial Reasoning",
  };

  const categoryColors: Record<QuizCategory, string> = {
    [QuizCategory.MATH]: "bg-blue-100 text-blue-800",
    [QuizCategory.VERBAL_REASONING]: "bg-green-100 text-green-800",
    [QuizCategory.LOGICAL_REASONING]: "bg-purple-100 text-purple-800",
    [QuizCategory.SPATIAL_REASONING]: "bg-orange-100 text-orange-800",
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const getAnswerForQuestion = (questionId: string) => {
    return session.answers.find((answer) => answer.questionId === questionId);
  };

  const correctAnswers = session.answers.filter(
    (answer) => answer.isCorrect
  ).length;
  const totalQuestions = session.questions.length;
  const percentage = Math.round((correctAnswers / totalQuestions) * 100);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto p-4 sm:p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="outline"
              onClick={onBack}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to History
            </Button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-slate-800">
                Review Questions - Session {session.id.slice(-8)}
              </h1>
              <p className="text-slate-600">
                Review your answers and see the correct solutions
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={percentage >= 60 ? "default" : "destructive"}>
                {percentage >= 60 ? "Passed" : "Failed"}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {correctAnswers}/{totalQuestions} ({percentage}%)
              </span>
            </div>
          </div>

          {/* Summary Section */}
          <div className="bg-slate-50 p-6 rounded-lg">
            <div className="grid grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-green-600">
                  {correctAnswers}
                </div>
                <div className="text-sm text-slate-600">Correct</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-red-600">
                  {totalQuestions - correctAnswers}
                </div>
                <div className="text-sm text-slate-600">Incorrect</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-slate-800">
                  {percentage}%
                </div>
                <div className="text-sm text-slate-600">Overall Score</div>
              </div>
            </div>
          </div>
        </div>

        {/* Questions */}
        <div className="space-y-6">
          {session.questions.map((question, index) => {
            const answer = getAnswerForQuestion(question.id);
            const isCorrect = answer?.isCorrect ?? false;
            const selectedAnswer = answer?.selectedAnswer ?? -1;

            return (
              <Card
                key={question.id}
                className={`border-l-4 ${
                  isCorrect
                    ? "border-l-green-500 bg-green-50/30"
                    : "border-l-red-500 bg-red-50/30"
                }`}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-lg font-semibold text-slate-800">
                          Question {index + 1}
                        </span>
                        <Badge className={categoryColors[question.category]}>
                          {categoryLabels[question.category]}
                        </Badge>
                        {answer && (
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Clock className="w-4 h-4" />
                            {formatTime(answer.timeSpent)}
                          </div>
                        )}
                        <Badge
                          variant={isCorrect ? "default" : "destructive"}
                          className={
                            isCorrect
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }
                        >
                          {isCorrect ? "Correct" : "Incorrect"}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg leading-relaxed text-slate-800">
                        {question.question}
                      </CardTitle>
                    </div>
                    <div className="ml-6">
                      {isCorrect ? (
                        <CheckCircle className="w-8 h-8 text-green-500" />
                      ) : (
                        <XCircle className="w-8 h-8 text-red-500" />
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    {question.options.map((option, optionIndex) => {
                      const isSelected = selectedAnswer === optionIndex;
                      const isCorrectAnswer =
                        question.correctAnswer === optionIndex;

                      let optionClass =
                        "p-4 rounded-lg border transition-colors";

                      if (isCorrectAnswer) {
                        optionClass +=
                          " bg-green-50 border-green-200 text-green-800";
                      } else if (isSelected && !isCorrectAnswer) {
                        optionClass += " bg-red-50 border-red-200 text-red-800";
                      } else {
                        optionClass +=
                          " bg-slate-50 border-slate-200 text-slate-700";
                      }

                      return (
                        <div key={optionIndex} className={optionClass}>
                          <div className="flex items-center gap-3">
                            <span className="font-semibold text-lg">
                              {String.fromCharCode(65 + optionIndex)}.
                            </span>
                            <span className="flex-1 text-base">{option}</span>
                            <div className="flex gap-2">
                              {isCorrectAnswer && (
                                <Badge
                                  variant="outline"
                                  className="text-green-600 border-green-300 bg-green-50"
                                >
                                  ✓ Correct Answer
                                </Badge>
                              )}
                              {isSelected && !isCorrectAnswer && (
                                <Badge
                                  variant="outline"
                                  className="text-red-600 border-red-300 bg-red-50"
                                >
                                  ✗ Your Answer
                                </Badge>
                              )}
                              {isSelected && isCorrectAnswer && (
                                <Badge
                                  variant="outline"
                                  className="text-green-600 border-green-300 bg-green-50"
                                >
                                  ✓ Correct
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {question.explanation && (
                    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="text-sm font-semibold text-blue-800 mb-2">
                        Explanation:
                      </div>
                      <div className="text-sm text-blue-700">
                        {question.explanation}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-slate-200">
          <div className="flex justify-between items-center">
            <div className="text-sm text-slate-600">
              Session completed on{" "}
              {new Intl.DateTimeFormat("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              }).format(session.startTime)}
            </div>
            <Button onClick={onBack} variant="outline">
              Back to History
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
