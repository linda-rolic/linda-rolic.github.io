import { COURSES } from "@/lib/courses";
import { CourseCard } from "@/components/CourseCard";

export const metadata = {
  title: "Course Catalog — DataCred",
};

export default function CatalogPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-white mb-3">Course Catalog</h1>
        <p className="text-gray-400 text-lg">
          Master niche data analytics skills and earn on-chain proof of your expertise.
        </p>
      </div>

      <div className="flex gap-3 mb-8 flex-wrap">
        {["All", "Beginner", "Intermediate", "Advanced"].map((level) => (
          <span
            key={level}
            className="text-sm px-3 py-1.5 rounded-full border border-purple-700/40 text-purple-300 bg-purple-900/20 cursor-pointer hover:border-purple-500 transition-colors"
          >
            {level}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {COURSES.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
}
