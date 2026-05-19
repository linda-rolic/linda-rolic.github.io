"use client";

import { useState } from "react";
import { notFound } from "next/navigation";
import { getCourse } from "@/lib/courses";
import { Quiz } from "@/components/Quiz";
import { ClaimCredential } from "@/components/ClaimCredential";

export default function CoursePage({ params }: { params: { id: string } }) {
  const course = getCourse(params.id);
  if (!course) notFound();

  const [activeModuleIdx, setActiveModuleIdx] = useState(0);
  const [completedModules, setCompletedModules] = useState<Set<string>>(new Set());
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizPassed, setQuizPassed] = useState(false);

  const allModulesCompleted = course.modules.every((m) => completedModules.has(m.id));
  const activeModule = course.modules[activeModuleIdx];

  function markModuleComplete(moduleId: string) {
    setCompletedModules((prev) => new Set([...prev, moduleId]));
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
          <a href="/catalog" className="hover:text-purple-400 transition-colors">Courses</a>
          <span>/</span>
          <span className="text-gray-300">{course.title}</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white mb-2">{course.title}</h1>
        <p className="text-gray-400">{course.description}</p>
        <div className="flex gap-4 mt-4 text-sm text-gray-500">
          <span>Instructor: <span className="text-gray-300">{course.instructor}</span></span>
          <span>·</span>
          <span>{course.duration}</span>
          <span>·</span>
          <span>{course.level}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-2">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Modules</p>
          {course.modules.map((mod, idx) => (
            <button
              key={mod.id}
              onClick={() => { setActiveModuleIdx(idx); setShowQuiz(false); }}
              className={`w-full text-left px-4 py-3 rounded-lg text-sm transition-colors flex items-center gap-2 ${
                activeModuleIdx === idx && !showQuiz
                  ? "bg-purple-600/30 text-white border border-purple-500/50"
                  : "text-gray-400 hover:text-white hover:bg-purple-900/20"
              }`}
            >
              <span className={`w-5 h-5 rounded-full border text-xs flex items-center justify-center shrink-0 ${
                completedModules.has(mod.id)
                  ? "bg-green-500 border-green-500 text-white"
                  : "border-gray-600 text-gray-500"
              }`}>
                {completedModules.has(mod.id) ? "✓" : idx + 1}
              </span>
              <span className="truncate">{mod.title}</span>
            </button>
          ))}

          {allModulesCompleted && (
            <button
              onClick={() => setShowQuiz(true)}
              className={`w-full text-left px-4 py-3 rounded-lg text-sm transition-colors flex items-center gap-2 ${
                showQuiz
                  ? "bg-pink-600/30 text-white border border-pink-500/50"
                  : "text-gray-400 hover:text-white hover:bg-purple-900/20"
              }`}
            >
              <span className={`w-5 h-5 rounded-full border text-xs flex items-center justify-center shrink-0 ${
                quizPassed ? "bg-green-500 border-green-500 text-white" : "border-pink-600 text-pink-500"
              }`}>
                {quizPassed ? "✓" : "?"}
              </span>
              Final Quiz
            </button>
          )}

          <div className="pt-4">
            <div className="text-xs text-gray-500 mb-1">
              Progress: {completedModules.size}/{course.modules.length} modules
            </div>
            <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all"
                style={{ width: `${(completedModules.size / course.modules.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="lg:col-span-3 space-y-6">
          {!showQuiz ? (
            <>
              <div className="card p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white">{activeModule.title}</h2>
                  <span className="text-sm text-gray-500">{activeModule.duration}</span>
                </div>
                <div className="prose prose-invert max-w-none text-gray-300 leading-relaxed">
                  {activeModule.content.split("\n").map((line, i) => {
                    if (line.startsWith("## "))
                      return <h2 key={i} className="text-2xl font-bold text-white mt-6 mb-3">{line.slice(3)}</h2>;
                    if (line.startsWith("### "))
                      return <h3 key={i} className="text-lg font-semibold text-purple-300 mt-4 mb-2">{line.slice(4)}</h3>;
                    if (line.startsWith("| ")) {
                      const cells = line.split("|").filter(Boolean).map(c => c.trim());
                      return (
                        <div key={i} className="flex gap-4 border-b border-purple-900/20 py-2 text-sm">
                          {cells.map((c, j) => <span key={j} className={j === 0 ? "text-purple-300 w-40 shrink-0" : "text-gray-300"}>{c}</span>)}
                        </div>
                      );
                    }
                    if (line.startsWith("- "))
                      return <li key={i} className="text-gray-300 ml-4">{line.slice(2)}</li>;
                    if (line.startsWith("```"))
                      return null;
                    if (line.trim() === "") return <br key={i} />;
                    return <p key={i} className="text-gray-300">{line}</p>;
                  })}
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setActiveModuleIdx((i) => Math.max(0, i - 1))}
                  disabled={activeModuleIdx === 0}
                  className="px-6 py-3 rounded-xl border border-purple-700/40 text-gray-400 hover:text-white hover:border-purple-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-sm"
                >
                  ← Previous
                </button>
                <button
                  onClick={() => {
                    markModuleComplete(activeModule.id);
                    if (activeModuleIdx < course.modules.length - 1) {
                      setActiveModuleIdx((i) => i + 1);
                    } else {
                      setShowQuiz(true);
                    }
                  }}
                  className="px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 transition-all text-sm"
                >
                  {completedModules.has(activeModule.id)
                    ? activeModuleIdx < course.modules.length - 1
                      ? "Next Module →"
                      : "Take Quiz →"
                    : "Mark Complete & Continue →"}
                </button>
              </div>
            </>
          ) : (
            <>
              <Quiz
                questions={course.quiz}
                onPass={() => setQuizPassed(true)}
              />
              {quizPassed && (
                <ClaimCredential courseId={course.id} courseName={course.title} />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
