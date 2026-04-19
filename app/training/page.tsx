"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTrainingStore } from "@/lib/store";
import { FINANCE_MODULES } from "@/lib/questions";
import { ChevronRight, RotateCcw, Award, Terminal, BookOpen } from "lucide-react";
import Link from "next/link";

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

  // 1. Command Center (Module Selection)
  if (quizStatus === "idle") {
    return (
      <div className="min-h-screen bg-midnight pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-8 text-gold">
            <Terminal size={24} />
            <span className="text-xs font-bold tracking-widest uppercase">System Access: BFB Terminal</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-serif text-silver mb-6">Knowledge Assessment</h1>
          <p className="text-silver/60 text-lg mb-12 max-w-2xl">
            Select a specialized module to test your technical proficiency.
            Completion of these modules is highly recommended for aspiring BFB members.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FINANCE_MODULES.map((module) => (
              <motion.div
                key={module.id}
                whileHover={{ scale: 1.02, borderColor: "var(--color-gold)" }}
                onClick={() => startModule(module)}
                className="cursor-pointer p-6 bg-glass border border-silver/10 rounded-sm group hover:bg-glass/50 transition-all duration-300"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 rounded-sm bg-gold/10 text-gold group-hover:bg-gold group-hover:text-midnight transition-colors">
                    <BookOpen size={20} />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-tighter text-silver/40 group-hover:text-gold transition-colors">
                    {module.difficulty}
                  </span>
                </div>
                <h3 className="text-xl font-serif text-silver mb-2 group-hover:text-gold transition-colors">{module.title}</h3>
                <p className="text-silver/60 text-sm leading-relaxed mb-6">{module.description}</p>
                <div className="flex items-center gap-2 text-gold text-xs font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                  Initialize Module <ChevronRight size={14} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 2. Active Quiz Mode
  if (quizStatus === "active" && currentModule) {
    const question = currentModule.questions[currentQuestionIndex];
    const selectedAnswer = answers[question.id];
    const hasSubmitted = selectedAnswer !== undefined;

    return (
      <div className="min-h-screen bg-midnight pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <div className="flex items-center gap-3 text-gold">
              <Terminal size={20} />
              <span className="text-xs font-bold tracking-widest uppercase">{currentModule.title} // {currentModule.id}</span>
            </div>
            <div className="text-silver/40 text-xs font-mono">
              Question {currentQuestionIndex + 1} of {currentModule.questions.length}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-1 bg-silver/10 rounded-full mb-12 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${((currentQuestionIndex + 1) / currentModule.questions.length) * 100}%` }}
              className="h-full bg-gold"
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
              <h2 className="text-2xl md:text-3xl font-serif text-silver leading-snug">
                {question.question}
              </h2>

              <div className="grid grid-cols-1 gap-3">
                {question.options.map((option, idx) => {
                  const isCorrect = idx === question.correctIndex;
                  const isSelected = selectedAnswer === idx;

                  let borderColor = "border-silver/10";
                  let textColor = "text-silver/70";
                  let bgColor = "bg-glass";

                  if (hasSubmitted) {
                    if (isCorrect) {
                      borderColor = "border-gold";
                      textColor = "text-gold";
                      bgColor = "bg-gold/10";
                    } else if (isSelected && !isCorrect) {
                      borderColor = "border-red-500/50";
                      textColor = "text-red-400";
                      bgColor = "bg-red-500/5";
                    }
                  } else if (isSelected) {
                    borderColor = "border-gold";
                    textColor = "text-gold";
                  }

                  return (
                    <button
                      key={idx}
                      disabled={hasSubmitted}
                      onClick={() => submitAnswer(question.id, idx)}
                      className={`p-4 text-left rounded-sm border transition-all duration-200 ${borderColor} ${textColor} ${bgColor} hover:border-gold/50`}
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
                  className="p-6 bg-gold/5 border border-gold/20 rounded-sm"
                >
                  <div className="flex items-center gap-2 text-gold text-xs font-bold uppercase tracking-widest mb-3">
                    <BookOpen size={14} /> Technical Brief
                  </div>
                  <p className="text-silver/80 text-sm leading-relaxed">
                    {question.explanation}
                  </p>
                  <button
                    onClick={nextQuestion}
                    className="mt-6 flex items-center gap-2 px-4 py-2 bg-gold text-midnight text-xs font-bold uppercase tracking-widest rounded-sm hover:bg-gold/90 transition-all"
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

  // 3. Certification Screen
  if (quizStatus === "completed" && currentModule) {
    const percentage = (score / currentModule.questions.length) * 100;
    const isCertified = percentage >= 80;

    return (
      <div className="min-h-screen bg-midnight pt-32 pb-20 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-xl w-full text-center p-12 bg-glass border border-silver/10 rounded-sm relative overflow-hidden"
        >
          {/* Decorative badge bg */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-gold/10 rounded-full blur-3xl" />

          <div className="relative z-10">
            <div className="flex justify-center mb-8">
              <div className={`p-4 rounded-full ${isCertified ? "bg-gold text-midnight" : "bg-silver/10 text-silver/40"}`}>
                <Award size={48} />
              </div>
            </div>

            <h2 className="text-4xl font-serif text-silver mb-4">
              {isCertified ? "Module Certified" : "Assessment Complete"}
            </h2>
            <p className="text-silver/60 mb-8">
              You scored <span className="text-gold font-bold">{score} / {currentModule.questions.length}</span> ({percentage.toFixed(0)}%)
            </p>

            {isCertified ? (
              <p className="text-silver/80 mb-12 leading-relaxed">
                Congratulations. You have demonstrated a strong technical command of {currentModule.title}.
                Your proficiency has been logged in the BFB database.
              </p>
            ) : (
              <p className="text-silver/80 mb-12 leading-relaxed">
                You did not meet the certification threshold. We recommend reviewing the technical briefs
                and attempting the module again to master the material.
              </p>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={resetQuiz}
                className="flex items-center gap-2 px-6 py-3 bg-gold text-midnight font-bold rounded-sm hover:bg-gold/90 transition-all"
              >
                <RotateCcw size={16} /> Try Again
              </button>
              <Link
                href="/"
                className="px-6 py-3 border border-silver/20 text-silver hover:text-gold hover:border-gold transition-all rounded-sm font-medium"
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
