import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Fetch everything for the dashboard overview
    const [users, courses, enrollments] = await Promise.all([
      prisma.user.findMany({ include: { _count: { select: { enrollments: true } } } }),
      prisma.course.findMany({ include: { _count: { select: { sections: true, enrollments: true } } } }),
      prisma.enrollment.findMany({ include: { user: true, course: true } }),
    ]);

    return NextResponse.json({ users, courses, enrollments });
  } catch (error) {
    return NextResponse.json({ error: "Admin fetch failed" }, { status: 500 });
  }
}

// Global Delete Handler
export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type"); // 'user' | 'course' | 'lecture'
  const id = searchParams.get("id");

  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

  try {
    if (type === "user") await prisma.user.delete({ where: { id } });
    if (type === "course") await prisma.course.delete({ where: { id } });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}