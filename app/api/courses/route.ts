import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";

    const courses = await prisma.course.findMany({
      where: {
        ...(search && {
          title: { contains: search, mode: "insensitive" },
        }),
      },
      // Include the hierarchy so the builder/frontend can see existing content
      include: {
        sections: {
          orderBy: { order: "asc" },
          include: {
            lectures: {
              orderBy: { order: "asc" },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(courses);
  } catch (error) {
    console.error("Fetch courses failed:", error);
    return NextResponse.json({ error: "Failed to fetch courses" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, mentor, price, badge, color } = body;

    if (!title || !mentor) {
      return NextResponse.json({ error: "Title and mentor are required" }, { status: 400 });
    }

    // --- SYSTEMATIC "FIND OR CREATE" LOGIC ---
    
    // 1. Check if course with this exact title already exists
    const existingCourse = await prisma.course.findFirst({
      where: { 
        title: { equals: title, mode: "insensitive" } 
      },
      // Also include sections so the teacher can resume where they left off
      include: {
        sections: {
          include: { lectures: true }
        }
      }
    });

    if (existingCourse) {
      // Return the existing course instead of creating a duplicate
      return NextResponse.json(existingCourse, { status: 200 });
    }

    // 2. If not found, create the new course
    const newCourse = await prisma.course.create({
      data: {
        title,
        mentor,
        price: parseFloat(price) || 0,
        badge: badge || null,
        color: color || "bg-blue-600",
      },
      // Return with empty arrays for consistency
      include: {
        sections: {
          include: { lectures: true }
        }
      }
    });

    return NextResponse.json(newCourse, { status: 201 });

  } catch (error) {
    console.error("Course operation failed:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to process course", details: message },
      { status: 500 }
    );
  }
}