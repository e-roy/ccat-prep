import { create } from "zustand";
import { persist } from "zustand/middleware";
import { QuizSession, QuizStatistics, QuizCategory } from "@/types/quiz";

interface QuizHistoryStore {
  sessions: QuizSession[];

  // Actions
  addSession: (session: QuizSession) => void;
  removeSession: (sessionId: string) => void;
  clearAllSessions: () => void;
  updateSession: (sessionId: string, updates: Partial<QuizSession>) => void;
  removeDuplicateSessions: () => void;

  // Getters
  getSessionById: (id: string) => QuizSession | undefined;
  getRecentSessions: (limit: number) => QuizSession[];
  getStatistics: () => QuizStatistics;
  getCategoryStatistics: (category: QuizCategory) => {
    totalAttempts: number;
    averageScore: number;
    bestScore: number;
    improvementTrend: number[];
  };
}

// Helper function to convert string dates back to Date objects
const convertSessionDates = (session: QuizSession): QuizSession => ({
  ...session,
  startTime: new Date(session.startTime),
  endTime: session.endTime ? new Date(session.endTime) : undefined,
});

export const useQuizHistoryStore = create<QuizHistoryStore>()(
  persist(
    (set, get) => ({
      sessions: [],

      addSession: (session) => {
        set((state) => {
          // Check if session already exists to prevent duplicates
          const existingSession = state.sessions.find(
            (s) => s.id === session.id
          );
          if (existingSession) {
            console.warn(
              `Session ${session.id} already exists, skipping duplicate`
            );
            return state;
          }
          return {
            sessions: [...state.sessions, session],
          };
        });
      },

      removeSession: (sessionId) => {
        set((state) => ({
          sessions: state.sessions.filter(
            (session) => session.id !== sessionId
          ),
        }));
      },

      clearAllSessions: () => {
        set({ sessions: [] });
      },

      updateSession: (sessionId, updates) => {
        set((state) => ({
          sessions: state.sessions.map((session) =>
            session.id === sessionId ? { ...session, ...updates } : session
          ),
        }));
      },

      removeDuplicateSessions: () => {
        set((state) => {
          const uniqueSessions = state.sessions.reduce((acc, session) => {
            const existingIndex = acc.findIndex((s) => s.id === session.id);
            if (existingIndex === -1) {
              acc.push(session);
            } else {
              // Keep the most recent session if there are duplicates
              const existing = acc[existingIndex];
              const sessionTime = new Date(session.startTime).getTime();
              const existingTime = new Date(existing.startTime).getTime();
              if (sessionTime > existingTime) {
                acc[existingIndex] = session;
              }
            }
            return acc;
          }, [] as QuizSession[]);

          const removedCount = state.sessions.length - uniqueSessions.length;
          if (removedCount > 0) {
            console.log(`Removed ${removedCount} duplicate sessions`);
          }

          return { sessions: uniqueSessions };
        });
      },

      getSessionById: (id) => {
        const session = get().sessions.find((session) => session.id === id);
        return session ? convertSessionDates(session) : undefined;
      },

      getRecentSessions: (limit) => {
        return get()
          .sessions.map(convertSessionDates)
          .sort((a, b) => b.startTime.getTime() - a.startTime.getTime())
          .slice(0, limit);
      },

      getStatistics: () => {
        const sessions = get()
          .sessions.filter((s) => s.status === "completed")
          .map(convertSessionDates);

        if (sessions.length === 0) {
          return {
            totalQuizzes: 0,
            averageScore: 0,
            bestScore: 0,
            categoryAverages: {
              [QuizCategory.MATH]: 0,
              [QuizCategory.SPATIAL_REASONING]: 0,
              [QuizCategory.VERBAL_REASONING]: 0,
              [QuizCategory.LOGICAL_REASONING]: 0,
            },
            improvementTrend: [],
            totalTimeSpent: 0,
          };
        }

        const scores = sessions.map((s) => s.score);
        const averageScore =
          scores.reduce((sum, score) => sum + score, 0) / scores.length;
        const bestScore = Math.max(...scores);
        const totalTimeSpent = sessions.reduce(
          (sum, s) => sum + s.timeSpent,
          0
        );

        // Calculate category averages
        const categoryAverages = Object.values(QuizCategory).reduce(
          (acc, category) => {
            const categorySessions = sessions.filter(
              (s) => s.categoryScores[category] > 0
            );
            if (categorySessions.length > 0) {
              acc[category] =
                categorySessions.reduce(
                  (sum, s) => sum + s.categoryScores[category],
                  0
                ) / categorySessions.length;
            } else {
              acc[category] = 0;
            }
            return acc;
          },
          {} as Record<QuizCategory, number>
        );

        // Calculate improvement trend (last 10 sessions)
        const recentSessions = sessions
          .sort((a, b) => a.startTime.getTime() - b.startTime.getTime())
          .slice(-10);
        const improvementTrend = recentSessions.map((s) => s.score);

        return {
          totalQuizzes: sessions.length,
          averageScore: Math.round(averageScore * 100) / 100,
          bestScore,
          categoryAverages,
          improvementTrend,
          totalTimeSpent,
        };
      },

      getCategoryStatistics: (category) => {
        const sessions = get()
          .sessions.filter(
            (s) => s.status === "completed" && s.categoryScores[category] > 0
          )
          .map(convertSessionDates);

        if (sessions.length === 0) {
          return {
            totalAttempts: 0,
            averageScore: 0,
            bestScore: 0,
            improvementTrend: [],
          };
        }

        const scores = sessions.map((s) => s.categoryScores[category]);
        const averageScore =
          scores.reduce((sum, score) => sum + score, 0) / scores.length;
        const bestScore = Math.max(...scores);

        // Improvement trend for this category
        const recentSessions = sessions
          .sort((a, b) => a.startTime.getTime() - b.startTime.getTime())
          .slice(-10);
        const improvementTrend = recentSessions.map(
          (s) => s.categoryScores[category]
        );

        return {
          totalAttempts: sessions.length,
          averageScore: Math.round(averageScore * 100) / 100,
          bestScore,
          improvementTrend,
        };
      },
    }),
    {
      name: "quiz-history-store",
      partialize: (state) => ({
        sessions: state.sessions,
      }),
      onRehydrateStorage: () => (state) => {
        // Clean up duplicates when store is rehydrated from localStorage
        if (state && state.sessions.length > 0) {
          const uniqueSessions = state.sessions.reduce((acc, session) => {
            const existingIndex = acc.findIndex((s) => s.id === session.id);
            if (existingIndex === -1) {
              acc.push(session);
            } else {
              // Keep the most recent session if there are duplicates
              const existing = acc[existingIndex];
              const sessionTime = new Date(session.startTime).getTime();
              const existingTime = new Date(existing.startTime).getTime();
              if (sessionTime > existingTime) {
                acc[existingIndex] = session;
              }
            }
            return acc;
          }, [] as QuizSession[]);

          const removedCount = state.sessions.length - uniqueSessions.length;
          if (removedCount > 0) {
            console.log(
              `Removed ${removedCount} duplicate sessions during rehydration`
            );
            state.sessions = uniqueSessions;
          }
        }
      },
    }
  )
);
