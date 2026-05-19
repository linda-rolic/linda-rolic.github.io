import Link from "next/link";
import { COURSES } from "@/lib/courses";
import { CourseCard } from "@/components/CourseCard";

export default function HomePage() {
  const featuredCourses = COURSES.slice(0, 3);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-pink-900/10 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <div className="inline-flex items-center gap-2 bg-purple-900/30 border border-purple-700/40 rounded-full px-4 py-2 text-sm text-purple-300 mb-8">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            Built for ETHWomen 2026
          </div>

          <h1 className="text-5xl sm:text-6xl font-extrabold text-white mb-6 leading-tight">
            Prove What You Know{" "}
            <span className="gradient-text">On-Chain</span>
          </h1>

          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
            Complete niche data analytics courses and earn soulbound NFT credentials that live on
            Ethereum — verifiable by anyone, owned by you forever.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/catalog"
              className="px-8 py-4 rounded-xl font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 transition-all shadow-lg shadow-purple-900/30"
            >
              Browse Courses
            </Link>
            <Link
              href="/verify"
              className="px-8 py-4 rounded-xl font-semibold text-white border border-purple-700/50 hover:border-purple-500 hover:bg-purple-900/20 transition-all"
            >
              Verify a Credential
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-white text-center mb-12">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              step: "01",
              title: "Learn",
              desc: "Pick a niche data analytics course — dbt, Spark, data storytelling, and more.",
            },
            {
              step: "02",
              title: "Pass the Quiz",
              desc: "Complete the modules and score 75%+ on the final quiz to unlock your credential.",
            },
            {
              step: "03",
              title: "Mint On-Chain",
              desc: "Connect your wallet. We mint a soulbound NFT to your address — it's yours forever and can't be transferred.",
            },
          ].map((item) => (
            <div key={item.step} className="card p-8 text-center">
              <div className="text-4xl font-extrabold gradient-text mb-4">{item.step}</div>
              <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured courses */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-white">Featured Courses</h2>
          <Link href="/catalog" className="text-purple-400 hover:text-purple-300 text-sm font-medium">
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y border-purple-900/30 bg-purple-900/10 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 gap-8 text-center">
            {[
              { value: `${COURSES.length}`, label: "Courses" },
              { value: "100%", label: "On-Chain Verified" },
              { value: "Soulbound", label: "Non-Transferable" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-3xl font-extrabold gradient-text">{stat.value}</div>
                <div className="text-gray-400 text-sm mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
