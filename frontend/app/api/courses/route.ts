import { NextResponse } from "next/server";
import { COURSES } from "@/lib/courses";

export async function GET() {
  const summary = COURSES.map(({ id, title, description, level, duration, tags, instructor, modules, quiz }) => ({
    id,
    title,
    description,
    level,
    duration,
    tags,
    instructor,
    moduleCount: modules.length,
    quizCount: quiz.length,
  }));
  return NextResponse.json({ courses: summary });
}
