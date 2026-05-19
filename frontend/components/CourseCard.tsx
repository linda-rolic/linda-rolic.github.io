import Link from "next/link";
import type { Course } from "@/lib/courses";

const LEVEL_COLORS = {
  Beginner: "text-green-400 bg-green-400/10",
  Intermediate: "text-yellow-400 bg-yellow-400/10",
  Advanced: "text-red-400 bg-red-400/10",
};

export function CourseCard({ course }: { course: Course }) {
  return (
    <Link href={`/course/${course.id}`} className="block group">
      <div className="card p-6 h-full flex flex-col gap-4 hover:border-purple-500/50 transition-colors">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-white text-lg group-hover:text-purple-300 transition-colors leading-tight">
            {course.title}
          </h3>
          <span
            className={`text-xs font-medium px-2 py-1 rounded-full shrink-0 ${LEVEL_COLORS[course.level]}`}
          >
            {course.level}
          </span>
        </div>

        <p className="text-gray-400 text-sm leading-relaxed flex-1">{course.description}</p>

        <div className="flex flex-wrap gap-2">
          {course.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs text-purple-300 bg-purple-900/30 px-2 py-1 rounded-md"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500 border-t border-purple-900/20 pt-4">
          <span>{course.modules.length} modules · {course.quiz.length} quiz questions</span>
          <span>{course.duration}</span>
        </div>
      </div>
    </Link>
  );
}
