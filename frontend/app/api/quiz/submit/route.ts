import { NextResponse } from "next/server";
import { getCourse } from "@/lib/courses";

const PASS_THRESHOLD = 0.75;

export async function POST(req: Request) {
  const body = await req.json();
  const { courseId, answers } = body as {
    courseId: string;
    answers: Record<string, number>;
  };

  if (!courseId || !answers) {
    return NextResponse.json({ error: "courseId and answers are required" }, { status: 400 });
  }

  const course = getCourse(courseId);
  if (!course) {
    return NextResponse.json({ error: "Course not found" }, { status: 404 });
  }

  let correct = 0;
  const details = course.quiz.map((q) => {
    const isCorrect = answers[q.id] === q.correctIndex;
    if (isCorrect) correct++;
    return {
      questionId: q.id,
      correct: isCorrect,
      correctIndex: q.correctIndex,
      selectedIndex: answers[q.id] ?? null,
    };
  });

  const score = correct / course.quiz.length;
  const passed = score >= PASS_THRESHOLD;

  return NextResponse.json({
    passed,
    score: Math.round(score * 100),
    correct,
    total: course.quiz.length,
    details,
  });
}
