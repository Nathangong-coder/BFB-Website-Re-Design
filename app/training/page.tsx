"use client";

import React, { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTrainingStore } from "@/lib/store";
import { FINANCE_MODULES } from "@/lib/questions";
import { ChevronRight, RotateCcw, Award, Terminal, BookOpen, CheckCircle } from "lucide-react";
import Link from "next/link";
import { sendQuizPerfectEmail } from "@/app/actions/quizPerfect";

// ─── Perfect Score Form ───────────────────────────────────────────────────────

function PerfectScoreForm({ moduleName, onReset }: { moduleName: string; onReset: () => void }) {
  const [pending, startTransition] = useTransition();
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.set("module", moduleName);
    startTransition(async () => {
      const res = await sendQuizPerfectEmail(formData);
      if (res.success) setSent(true);
      else setError(res.error ?? "Something went wrong.");
    });
  }

  if (sent) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-xl w-full text-center mx-auto px-4"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-50 dark:bg-green-900/20 mb-6">
          <CheckCircle size={32} className="text-green-500" />
        </div>
        <h2 className="text-3xl font-serif text-slate-900 dark:text-silver mb-4">We&apos;ll Be in Touch</h2>
        <p className="text-slate-500 dark:text-silver/60 mb-10 leading-relaxed">
          Your information has been saved in our database. Congratulations again on your perfect score!
        </p>
        <button
          onClick={onReset}
          className="flex items-center gap-2 px-6 py-3 bg-bfb-blue text-white font-bold rounded-sm hover:bg-bfb-blue/90 transition-all mx-auto"
        >
          <RotateCcw size={16} /> Take Another Module
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-xl w-full mx-auto px-4"
    >
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 mb-6">
          <Award size={32} className="text-green-600 dark:text-green-400" />
        </div>
        <h2 className="text-3xl md:text-4xl font-serif text-slate-900 dark:text-silver mb-3">
          Perfect Score!
        </h2>
        <p className="text-slate-500 dark:text-silver/60 text-sm leading-relaxed max-w-sm mx-auto">
          You aced the <span className="font-semibold text-slate-700 dark:text-silver">{moduleName}</span> module.
          Share your info and our team will reach out.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-silver/80 mb-1.5">
            Full Name <span className="text-red-400">*</span>
          </label>
          <input
            name="name"
            type="text"
            required
            placeholder="Your full name"
            className="w-full px-4 py-3 bg-white dark:bg-glass border border-slate-200 dark:border-white/10 rounded-sm text-slate-900 dark:text-silver placeholder-slate-400 dark:placeholder-silver/30 focus:outline-none focus:border-bfb-blue transition-colors text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-silver/80 mb-1.5">
            Email <span className="text-red-400">*</span>
          </label>
          <input
            name="email"
            type="email"
            required
            placeholder="you@ucla.edu"
            className="w-full px-4 py-3 bg-white dark:bg-glass border border-slate-200 dark:border-white/10 rounded-sm text-slate-900 dark:text-silver placeholder-slate-400 dark:placeholder-silver/30 focus:outline-none focus:border-bfb-blue transition-colors text-sm"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-silver/80 mb-1.5">
              Year <span className="text-red-400">*</span>
            </label>
            <select
              name="year"
              required
              className="w-full px-4 py-3 bg-white dark:bg-glass border border-slate-200 dark:border-white/10 rounded-sm text-slate-900 dark:text-silver focus:outline-none focus:border-bfb-blue transition-colors text-sm"
            >
              <option value="">Select year</option>
              <option>Freshman</option>
              <option>Sophomore</option>
              <option>Junior</option>
              <option>Senior</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-silver/80 mb-1.5">
              Major <span className="text-red-400">*</span>
            </label>
            <input
              name="major"
              type="text"
              required
              placeholder="e.g. Economics"
              className="w-full px-4 py-3 bg-white dark:bg-glass border border-slate-200 dark:border-white/10 rounded-sm text-slate-900 dark:text-silver placeholder-slate-400 dark:placeholder-silver/30 focus:outline-none focus:border-bfb-blue transition-colors text-sm"
            />
          </div>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={pending}
          className="w-full py-4 bg-bfb-blue text-white font-bold rounded-sm hover:bg-bfb-blue/90 transition-all duration-300 hover:-translate-y-0.5 shadow-lg shadow-bfb-blue/20 disabled:opacity-50 disabled:cursor-not-allowed text-sm mt-2"
        >
          {pending ? "Sending..." : "Submit"}
        </button>
      </form>

      <button
        onClick={onReset}
        className="mt-6 w-full text-center text-sm text-slate-400 dark:text-silver/40 hover:text-slate-600 dark:hover:text-silver/70 transition-colors"
      >
        Skip and go back home
      </button>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function TrainingPage() {
  const {
    currentModule,
    currentQuestionIndex,
    score,
    quizStatus,
    answers,
    startModule,
    submitAnswer,
    nextQuestion,
    resetQuiz,
  } = useTrainingStore();

  // 1. Module selection
  if (quizStatus === "idle") {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-midnight pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-8 text-bfb-blue dark:text-gold">
            <Terminal size={24} />
            <span className="text-xs font-bold tracking-widest uppercase">BFB Knowledge Assessment</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-serif text-slate-900 dark:text-silver mb-6">Knowledge Assessment</h1>
          <p className="text-slate-500 dark:text-silver/60 text-lg mb-12 max-w-2xl">
            Select a module to test your technical proficiency. 5 questions are chosen at random from a pool of 50.
            A perfect score gets you in touch with our team.
          </p>

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
      <div className="min-h-screen bg-slate-50 dark:bg-midnight pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <div className="flex items-center gap-3 text-bfb-blue dark:text-gold">
              <Terminal size={20} />
              <span className="text-xs font-bold tracking-widest uppercase text-slate-600 dark:text-gold">{currentModule.title}</span>
            </div>
            <div className="text-slate-400 dark:text-silver/40 text-xs font-mono">
              Question {currentQuestionIndex + 1} of {currentModule.questions.length}
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
              <h2 className="text-2xl md:text-3xl font-serif text-slate-900 dark:text-silver leading-snug">
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

    // Perfect score → show contact form
    if (isPerfect) {
      return (
        <div className="min-h-screen bg-slate-50 dark:bg-midnight pt-32 pb-20 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
          <PerfectScoreForm moduleName={currentModule.title} onReset={resetQuiz} />
        </div>
      );
    }

    // Non-perfect completion
    const percentage = (score / currentModule.questions.length) * 100;
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-midnight pt-32 pb-20 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
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
              You need a perfect 5/5 to unlock the next step. Review the explanations and try again — you&apos;ve got this.
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
