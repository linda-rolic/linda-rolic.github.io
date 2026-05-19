import { NextResponse } from "next/server";
import { getCourse } from "@/lib/courses";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const course = getCourse(params.id);
  if (!course) {
    return NextResponse.json({ error: "Course not found" }, { status: 404 });
  }
  return NextResponse.json({ course });
}
