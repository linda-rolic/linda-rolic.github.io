"use client";

import { useState } from "react";
import type { QuizQuestion } from "@/lib/courses";

interface QuizProps {
  questions: QuizQuestion[];
  onPass: () => void;
}

const PASS_SCORE = 0.75;

export function Quiz({ questions, onPass }: QuizProps) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const allAnswered = questions.every((q) => answers[q.id] !== undefined);

  function handleSubmit() {
    let correct = 0;
    questions.forEach((q) => {
      if (answers[q.id] === q.correctIndex) correct++;
    });
    const pct = correct / questions.length;
    setScore(pct);
    setSubmitted(true);
    if (pct >= PASS_SCORE) onPass();
  }

  function handleRetry() {
    setAnswers({});
    setSubmitted(false);
    setScore(0);
  }

  if (submitted && score >= PASS_SCORE) {
    return (
      <div className="card p-8 text-center">
        <div className="text-5xl mb-4">🎉</div>
        <h3 className="text-2xl font-bold text-white mb-2">Quiz Passed!</h3>
        <p className="text-gray-400 mb-1">
          You scored{" "}
          <span className="text-green-400 font-semibold">
            {Math.round(score * 100)}%
          </span>{" "}
          ({Math.round(score * questions.length)}/{questions.length} correct)
        </p>
        <p className="text-gray-500 text-sm mt-4">
          Scroll down to claim your on-chain credential.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <h2 className="text-xl font-bold text-white mb-1">Final Quiz</h2>
        <p className="text-gray-400 text-sm">
          Score {Math.round(PASS_SCORE * 100)}% or higher to earn your credential.
        </p>
      </div>

      {submitted && score < PASS_SCORE && (
        <div className="card p-4 border-red-500/30 bg-red-500/5 text-center">
          <p className="text-red-400 font-medium">
            You scored {Math.round(score * 100)}% — need {Math.round(PASS_SCORE * 100)}% to pass.
          </p>
          <button
            onClick={handleRetry}
            className="mt-3 text-sm text-purple-400 hover:text-purple-300 underline"
          >
            Try again
          </button>
        </div>
      )}

      {questions.map((q, idx) => {
        const selected = answers[q.id];
        const showResult = submitted;
        return (
          <div key={q.id} className="card p-6 space-y-4">
            <p className="font-medium text-white">
              {idx + 1}. {q.question}
            </p>
            <div className="space-y-2">
              {q.options.map((option, optIdx) => {
                let optClass =
                  "w-full text-left px-4 py-3 rounded-lg border text-sm transition-colors ";
                if (!showResult) {
                  optClass +=
                    selected === optIdx
                      ? "border-purple-500 bg-purple-500/20 text-white"
                      : "border-purple-900/30 bg-purple-900/10 text-gray-300 hover:border-purple-500/50";
                } else {
                  if (optIdx === q.correctIndex) {
                    optClass += "border-green-500 bg-green-500/20 text-green-300";
                  } else if (selected === optIdx && optIdx !== q.correctIndex) {
                    optClass += "border-red-500 bg-red-500/20 text-red-300";
                  } else {
                    optClass += "border-purple-900/20 bg-purple-900/5 text-gray-500";
                  }
                }
                return (
                  <button
                    key={optIdx}
                    className={optClass}
                    disabled={showResult}
                    onClick={() => setAnswers((a) => ({ ...a, [q.id]: optIdx }))}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

      {!submitted && (
        <button
          onClick={handleSubmit}
          disabled={!allAnswered}
          className="w-full py-4 rounded-xl font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          Submit Quiz
        </button>
      )}
    </div>
  );
}
