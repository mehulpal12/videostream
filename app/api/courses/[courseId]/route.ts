import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ courseId: string | string[] }> } // Type as a Promise
) {
  try {
    // 1. Unwrap the params Promise
    const resolvedParams = await params;
    
    // 2. Handle both single and catch-all route structures
    const courseId = Array.isArray(resolvedParams.courseId) 
      ? resolvedParams.courseId[0] 
      : resolvedParams.courseId;

    if (!courseId) {
      return NextResponse.json({ error: "Missing course ID" }, { status: 400 });
    }

   const course = await prisma.course.findUnique({
  where: { 
    id: courseId 
  },
  include: {
    sections: {
      orderBy: { 
        order: "asc" 
      },
      include: {
        lectures: {
          orderBy: { 
            order: "asc" 
          }
        }
      }
    }
  }
});
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    return NextResponse.json(course);
  } catch (error) {
    console.error("API_ERROR:", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}