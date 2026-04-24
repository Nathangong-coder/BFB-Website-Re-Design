import { create } from "zustand";
import { Module } from "./questions";

interface TrainingState {
  currentModule: Module | null;
  currentQuestionIndex: number;
  score: number;
  quizStatus: "idle" | "active" | "completed";
  answers: Record<string, number>;

  startModule: (module: Module) => void;
  submitAnswer: (questionId: string, answerIndex: number) => void;
  nextQuestion: () => void;
  resetQuiz: () => void;
}

function pickRandom<T>(arr: T[], n: number): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, n);
}

export const useTrainingStore = create<TrainingState>((set) => ({
  currentModule: null,
  currentQuestionIndex: 0,
  score: 0,
  quizStatus: "idle",
  answers: {},

  startModule: (module) => {
    const selected = pickRandom(module.questions, 5);
    set({
      currentModule: { ...module, questions: selected },
      currentQuestionIndex: 0,
      score: 0,
      quizStatus: "active",
      answers: {},
    });
  },

  submitAnswer: (questionId, answerIndex) => set((state) => {
    const isCorrect =
      state.currentModule?.questions[state.currentQuestionIndex].correctIndex === answerIndex;
    return {
      answers: { ...state.answers, [questionId]: answerIndex },
      score: isCorrect ? state.score + 1 : state.score,
    };
  }),

  nextQuestion: () => set((state) => {
    const nextIndex = state.currentQuestionIndex + 1;
    const isFinished = nextIndex >= (state.currentModule?.questions.length || 0);
    return {
      currentQuestionIndex: nextIndex,
      quizStatus: isFinished ? "completed" : "active",
    };
  }),

  resetQuiz: () => {
    set({
      currentModule: null,
      currentQuestionIndex: 0,
      score: 0,
      quizStatus: "idle",
      answers: {},
    });
  },
}));
