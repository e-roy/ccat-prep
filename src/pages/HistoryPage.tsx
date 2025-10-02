import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { DonutChart, MiniDonutChart } from "@/components/ui/donut-chart";
import { ReviewQuestionsPage } from "@/pages/ReviewQuestionsPage";
import { ConfirmClearDialog } from "@/components/quiz/ConfirmClearDialog";
import { useQuizHistoryStore } from "@/lib/history/historyStore";
import { QuizCategory, QuizMode, QuizSession } from "@/types/quiz";
import { History, Trash2 } from "lucide-react";
import { useState } from "react";

export default function HistoryPage() {
  const { sessions, getStatistics, clearAllSessions } = useQuizHistoryStore();
  const stats = getStatistics();
  const [reviewSession, setReviewSession] = useState<QuizSession | null>(null);
  const [showClearDialog, setShowClearDialog] = useState(false);

  // Convert string dates back to Date objects for sessions
  const convertedSessions = sessions.map((session) => ({
    ...session,
    startTime: new Date(session.startTime),
    endTime: session.endTime ? new Date(session.endTime) : undefined,
  }));

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const formatDateShort = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "numeric",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const categoryLabels: Record<QuizCategory, string> = {
    [QuizCategory.MATH]: "Maths",
    [QuizCategory.VERBAL_REASONING]: "Verbal Reasoning",
    [QuizCategory.LOGICAL_REASONING]: "Logical Reasoning",
    [QuizCategory.SPATIAL_REASONING]: "Spatial Reasoning",
  };

  const getDomainPerformance = (session: QuizSession) => {
    const domainStats: Record<
      string,
      { correct: number; total: number; percentage: number }
    > = {};

    session.questions.forEach((question) => {
      const category = categoryLabels[question.category];
      if (!domainStats[category]) {
        domainStats[category] = { correct: 0, total: 0, percentage: 0 };
      }
      domainStats[category].total++;
    });

    session.answers.forEach((answer) => {
      const question = session.questions.find(
        (q) => q.id === answer.questionId
      );
      if (question) {
        const category = categoryLabels[question.category];
        if (answer.isCorrect) {
          domainStats[category].correct++;
        }
      }
    });

    // Calculate percentages
    Object.keys(domainStats).forEach((category) => {
      const stats = domainStats[category];
      stats.percentage =
        stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
    });

    return domainStats;
  };

  // If we're reviewing a session, show the review page
  if (reviewSession) {
    return (
      <ReviewQuestionsPage
        session={reviewSession}
        onBack={() => setReviewSession(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto p-4 sm:p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            Quiz History
          </h1>
          <p className="text-slate-600">
            Track your progress and review past quiz sessions
          </p>
        </div>

        {convertedSessions.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <History className="w-12 h-12 mx-auto mb-4 text-slate-400" />
              <h3 className="text-lg font-semibold text-slate-600 mb-2">
                No Quiz History
              </h3>
              <p className="text-slate-500">
                Complete your first quiz to start tracking your progress!
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Statistics Overview */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 text-center">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-slate-600">
                    Total Quizzes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-slate-800">
                    {stats.totalQuizzes}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-slate-600">
                    Average Score
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-slate-800">
                    {stats.averageScore.toFixed(1)}%
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-slate-600">
                    Best Score
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-slate-800">
                    {stats.bestScore}%
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-slate-600">
                    Total Time
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-slate-800">
                    {formatTime(stats.totalTimeSpent)}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sessions List */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-slate-800">
                Past Sessions
              </h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowClearDialog(true)}
                className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear All
              </Button>
            </div>

            <Accordion type="multiple" className="space-y-4">
              {convertedSessions
                .sort((a, b) => b.startTime.getTime() - a.startTime.getTime())
                .map((session) => {
                  const percentage = Math.round(
                    (session.score / session.totalQuestions) * 100
                  );
                  const passed = percentage >= 60;
                  const domainStats = getDomainPerformance(session);

                  return (
                    <AccordionItem
                      key={session.id}
                      value={session.id}
                      className="border border-slate-200 rounded-lg"
                    >
                      <AccordionTrigger
                        value={session.id}
                        className="hover:bg-slate-50"
                      >
                        <div className="flex items-center justify-between w-full pr-4">
                          <div className="flex items-center gap-4">
                            <MiniDonutChart percentage={percentage} />
                            <div className="text-left">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium text-slate-800">
                                  {session.mode === QuizMode.EXAM
                                    ? "Exam mode"
                                    : "Practice mode"}
                                </span>
                                <Badge
                                  variant={passed ? "default" : "destructive"}
                                  className={
                                    passed
                                      ? "bg-green-100 text-green-800"
                                      : "bg-red-100 text-red-800"
                                  }
                                >
                                  {passed ? "Passed!" : "Failed"}
                                </Badge>
                              </div>
                              <div className="text-sm text-slate-600">
                                {percentage}% correct ({session.score}/
                                {session.totalQuestions})
                              </div>
                              <div className="text-sm text-slate-500">
                                {formatTime(session.timeSpent)} •{" "}
                                {formatDateShort(session.startTime)}
                              </div>
                            </div>
                          </div>
                        </div>
                      </AccordionTrigger>

                      <AccordionContent
                        value={session.id}
                        className="px-6 pb-6"
                      >
                        <div className="space-y-6">
                          {/* Overall Score Section */}
                          <div className="text-center">
                            <div className="flex items-center justify-center gap-4 mb-4">
                              <DonutChart percentage={percentage} size={120} />
                              <div className="text-left">
                                <h3 className="text-lg font-semibold text-slate-800 mb-1">
                                  {percentage}% correct ({session.score}/
                                  {session.totalQuestions})
                                </h3>
                                <p className="text-sm text-slate-600 mb-2">
                                  {formatTime(session.timeSpent)} •{" "}
                                  {formatDate(session.startTime)}
                                </p>
                                <Badge
                                  variant={passed ? "default" : "destructive"}
                                  className={
                                    passed
                                      ? "bg-green-100 text-green-800"
                                      : "bg-red-100 text-red-800"
                                  }
                                >
                                  {passed ? "Passed!" : "Failed"} (
                                  {percentage >= 60 ? "60%" : "60%"} required to
                                  pass)
                                </Badge>
                              </div>
                            </div>

                            <Button
                              onClick={() => setReviewSession(session)}
                              className="bg-purple-600 hover:bg-purple-700 text-white"
                            >
                              Review questions
                            </Button>
                          </div>

                          {/* Domains Section */}
                          <div>
                            <h4 className="text-lg font-semibold text-slate-800 mb-4">
                              Domains
                            </h4>
                            <div className="space-y-3">
                              {Object.entries(domainStats).map(
                                ([domain, stats]) => (
                                  <div key={domain} className="space-y-2">
                                    <div className="flex justify-between items-center">
                                      <span className="text-sm font-medium text-slate-700">
                                        {domain} ({stats.total} questions)
                                      </span>
                                      <span className="text-sm font-semibold text-slate-800">
                                        {stats.percentage}%
                                      </span>
                                    </div>
                                    <div className="flex gap-1 h-2">
                                      <div
                                        className="bg-green-500 rounded-l"
                                        style={{
                                          width: `${stats.percentage}%`,
                                        }}
                                      />
                                      <div
                                        className="bg-red-500 rounded-r"
                                        style={{
                                          width: `${100 - stats.percentage}%`,
                                        }}
                                      />
                                    </div>
                                  </div>
                                )
                              )}
                            </div>

                            {/* Legend */}
                            <div className="flex items-center gap-4 mt-4 text-xs text-slate-600">
                              <div className="flex items-center gap-1">
                                <div className="w-3 h-3 bg-green-500 rounded"></div>
                                <span>Correct</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <div className="w-3 h-3 bg-red-500 rounded"></div>
                                <span>Incorrect</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <div className="w-3 h-3 bg-slate-300 rounded"></div>
                                <span>Skipped/Unanswered</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
            </Accordion>
          </>
        )}
      </div>

      {/* Confirmation Dialog */}
      <ConfirmClearDialog
        isOpen={showClearDialog}
        onClose={() => setShowClearDialog(false)}
        onConfirm={clearAllSessions}
      />
    </div>
  );
}
