"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTrainingStore } from "@/lib/store";
import { FINANCE_MODULES } from "@/lib/questions";
import { ChevronRight, RotateCcw, Award, Terminal, BookOpen, Timer, X } from "lucide-react";
import Link from "next/link";
import { fadeInUp } from "@/lib/animations";

// ─── Training Quiz ────────────────────────────────────────────────────────────

export default function TrainingQuiz() {
  const {
    currentModule,
    currentQuestionIndex,
    score,
    quizStatus,
    answers,
    timeLeft,
    startModule,
    submitAnswer,
    nextQuestion,
    tickTimer,
    resetQuiz,
  } = useTrainingStore();

  useEffect(() => {
    if (quizStatus === "active") {
      const timer = setInterval(() => {
        tickTimer();
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [quizStatus, tickTimer]);

  // Stop the quiz if the person navigates away or closes the page mid-attempt.
  useEffect(() => {
    return () => {
      resetQuiz();
    };
  }, [resetQuiz]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // 1. Module selection
  if (quizStatus === "idle") {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-midnight relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-bfb-blue/[0.05] via-transparent to-transparent" />
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-bfb-blue/10 rounded-full blur-3xl opacity-50" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-bfb-blue/10 rounded-full blur-3xl opacity-40" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto pt-page pb-section px-gutter">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center gap-4 text-center mb-16"
          >
            <span className="flex items-center gap-2 text-eyebrow font-bold tracking-[0.25em] uppercase text-bfb-blue dark:text-bfb-blue/70">
              <Terminal size={16} />
              BFB Knowledge Assessment
            </span>

            <h2 className="text-hero font-serif text-slate-900 dark:text-silver leading-tight text-center">
              Knowledge Assessment
            </h2>

            <div className="w-24 h-px bg-gradient-to-r from-transparent via-bfb-blue to-transparent opacity-30" />

            <p className="italic font-light text-slate-400 dark:text-silver/40 text-body-lg leading-relaxed max-w-2xl mx-auto">
              Select a module to test your technical proficiency.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FINANCE_MODULES.map((module) => (
              <motion.div
                key={module.id}
                whileHover={{ scale: 1.02 }}
                onClick={() => startModule(module)}
                className="cursor-pointer p-6 bg-white dark:bg-glass border border-slate-200 dark:border-silver/10 rounded-sm group hover:border-bfb-blue/40 dark:hover:border-gold/40 transition-all duration-300 shadow-sm dark:shadow-none"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 rounded-sm bg-bfb-blue/10 dark:bg-gold/10 text-bfb-blue dark:text-gold group-hover:bg-bfb-blue group-hover:text-white dark:group-hover:bg-gold dark:group-hover:text-midnight transition-colors">
                    <BookOpen size={20} />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-tighter text-slate-400 dark:text-silver/40 group-hover:text-bfb-blue dark:group-hover:text-gold transition-colors">
                    {module.difficulty}
                  </span>
                </div>
                <h3 className="text-xl font-serif text-slate-900 dark:text-silver mb-2 group-hover:text-bfb-blue dark:group-hover:text-gold transition-colors">{module.title}</h3>
                <p className="text-slate-500 dark:text-silver/60 text-sm leading-relaxed mb-6">{module.description}</p>
                <div className="flex items-center gap-2 text-bfb-blue dark:text-gold text-xs font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                  Start Module <ChevronRight size={14} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 2. Active Quiz
  if (quizStatus === "active" && currentModule) {
    const question = currentModule.questions[currentQuestionIndex];
    const selectedAnswer = answers[question.id];
    const hasSubmitted = selectedAnswer !== undefined;
    const isAnswerCorrect = hasSubmitted && selectedAnswer === question.correctIndex;

    return (
      <div className="min-h-screen bg-slate-50 dark:bg-midnight pt-page pb-section px-gutter">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <div className="flex items-center gap-3 text-bfb-blue dark:text-gold">
              <Terminal size={20} />
              <span className="text-xs font-bold tracking-widest uppercase text-slate-600 dark:text-gold">{currentModule.title}</span>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-slate-400 dark:text-silver/40 text-xs font-mono">
                <Timer size={14} />
                <span>{formatTime(timeLeft)}</span>
              </div>
              <div className="text-slate-400 dark:text-silver/40 text-xs font-mono">
                Question {currentQuestionIndex + 1} of {currentModule.questions.length}
              </div>
              <button
                onClick={resetQuiz}
                aria-label="Exit quiz and return to module selection"
                className="flex items-center gap-1.5 text-slate-400 dark:text-silver/40 hover:text-red-500 dark:hover:text-red-400 text-xs font-bold uppercase tracking-widest transition-colors"
              >
                <X size={14} /> Exit
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-1 bg-slate-200 dark:bg-silver/10 rounded-full mb-12 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${((currentQuestionIndex + 1) / currentModule.questions.length) * 100}%` }}
              className="h-full bg-bfb-blue dark:bg-gold"
            />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={question.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <h2 className="text-h2 font-serif text-slate-900 dark:text-silver leading-snug">
                {question.question}
              </h2>

              <div className="grid grid-cols-1 gap-3">
                {question.options.map((option, idx) => {
                  const isCorrect = idx === question.correctIndex;
                  const isSelected = selectedAnswer === idx;

                  let className =
                    "p-4 text-left rounded-sm border transition-all duration-200 ";

                  if (hasSubmitted) {
                    if (isCorrect) {
                      className += "border-green-500 text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-500/10";
                    } else if (isSelected) {
                      className += "border-red-400 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/5";
                    } else {
                      className += "border-slate-200 dark:border-silver/10 text-slate-400 dark:text-silver/40 bg-white dark:bg-glass";
                    }
                  } else if (isSelected) {
                    className += "border-bfb-blue dark:border-gold text-bfb-blue dark:text-gold bg-bfb-blue/5 dark:bg-gold/5";
                  } else {
                    className += "border-slate-200 dark:border-silver/10 text-slate-700 dark:text-silver/70 bg-white dark:bg-glass hover:border-bfb-blue/50 dark:hover:border-gold/50";
                  }

                  return (
                    <button
                      key={idx}
                      disabled={hasSubmitted}
                      onClick={() => submitAnswer(question.id, idx)}
                      className={className}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>

              {hasSubmitted && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-6 rounded-sm border ${
                    isAnswerCorrect
                      ? "bg-green-50 dark:bg-green-500/5 border-green-300 dark:border-green-500/30"
                      : "bg-red-50 dark:bg-red-500/5 border-red-300 dark:border-red-500/30"
                  }`}
                >
                  <div
                    className={`flex items-center gap-2 text-xs font-bold uppercase tracking-widest mb-3 ${
                      isAnswerCorrect
                      ? "text-green-700 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    <BookOpen size={14} />
                    {isAnswerCorrect ? "Correct" : "Wrong"}
                  </div>
                  <p className="text-slate-700 dark:text-silver/80 text-sm leading-relaxed">
                    {question.explanation}
                  </p>
                  <button
                    onClick={nextQuestion}
                    className="mt-6 flex items-center gap-2 px-4 py-2 bg-bfb-blue dark:bg-gold text-white dark:text-midnight text-xs font-bold uppercase tracking-widest rounded-sm hover:opacity-90 transition-all"
                  >
                    Continue <ChevronRight size={14} />
                  </button>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    );
  }

  // 3. Completion
  if (quizStatus === "completed" && currentModule) {
    const isPerfect = score === currentModule.questions.length;
    const percentage = (score / currentModule.questions.length) * 100;
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-midnight pt-page pb-section px-gutter flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-xl w-full text-center p-12 bg-white dark:bg-glass border border-slate-200 dark:border-silver/10 rounded-sm relative overflow-hidden shadow-sm dark:shadow-none"
        >
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-bfb-blue/5 dark:bg-gold/10 rounded-full blur-3xl" />

          <div className="relative z-10">
            <div className="flex justify-center mb-8">
              <div className="p-4 rounded-full bg-slate-100 dark:bg-silver/10 text-slate-400 dark:text-silver/40">
                <Award size={48} />
              </div>
            </div>

            <h2 className="text-4xl font-serif text-slate-900 dark:text-silver mb-4">Assessment Complete</h2>
            <p className="text-slate-500 dark:text-silver/60 mb-8">
              You scored{" "}
              <span className="text-bfb-blue dark:text-gold font-bold">
                {score} / {currentModule.questions.length}
              </span>{" "}
              ({percentage.toFixed(0)}%)
            </p>

            <p className="text-slate-600 dark:text-silver/80 mb-12 leading-relaxed text-sm">
              {isPerfect
                ? "Perfect score! Great work on the " + currentModule.title + " module."
                : "Review the explanations and try again — you’ve got this."}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={resetQuiz}
                className="flex items-center gap-2 px-6 py-3 bg-bfb-blue text-white font-bold rounded-sm hover:bg-bfb-blue/90 transition-all"
              >
                <RotateCcw size={16} /> Try Again
              </button>
              <Link
                href="/"
                className="px-6 py-3 border border-slate-200 dark:border-silver/20 text-slate-600 dark:text-silver hover:text-bfb-blue dark:hover:text-gold hover:border-bfb-blue/40 dark:hover:border-gold transition-all rounded-sm font-medium text-sm"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return null;
}
