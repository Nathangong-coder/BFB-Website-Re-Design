import { create } from "zustand";
import { Module } from "./questions";

interface TrainingState {
  currentModule: Module | null;
  currentQuestionIndex: number;
  score: number;
  quizStatus: "idle" | "active" | "completed";
  answers: Record<string, number>;

  // Actions
  startModule: (module: Module) => void;
  submitAnswer: (questionId: string, answerIndex: number) => void;
  nextQuestion: () => void;
  resetQuiz: () => void;
}

export const useTrainingStore = create<TrainingState>((set) => ({
  currentModule: null,
  currentQuestionIndex: 0,
  score: 0,
  quizStatus: "idle",
  answers: {},

  startModule: (module) => {
    console.log("Starting module:", module.title);
    set({
      currentModule: module,
      currentQuestionIndex: 0,
      score: 0,
      quizStatus: "active",
      answers: {},
    });
  },

  submitAnswer: (questionId, answerIndex) => set((state) => {
    console.log(`Submitting answer for ${questionId}:`, answerIndex);
    const isCorrect = state.currentModule?.questions[state.currentQuestionIndex].correctIndex === answerIndex;
    return {
      answers: { ...state.answers, [questionId]: answerIndex },
      score: isCorrect ? state.score + 1 : state.score,
    };
  }),

  nextQuestion: () => set((state) => {
    const nextIndex = state.currentQuestionIndex + 1;
    const isFinished = nextIndex >= (state.currentModule?.questions.length || 0);
    console.log(`Moving to next question. Current: ${state.currentQuestionIndex}, Next: ${nextIndex}, Finished: ${isFinished}`);
    return {
      currentQuestionIndex: nextIndex,
      quizStatus: isFinished ? "completed" : "active",
    };
  }),

  resetQuiz: () => {
    console.log("Resetting quiz");
    set({
      currentModule: null,
      currentQuestionIndex: 0,
      score: 0,
      quizStatus: "idle",
      answers: {},
    });
  },
}));
