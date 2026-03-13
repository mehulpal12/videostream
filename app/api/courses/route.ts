import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server"; // Import Clerk Auth
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
    // 1. Get the authenticated User ID from Clerk
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { title, mentor, price, badge, color } = body;

    if (!title || !mentor) {
      return NextResponse.json({ error: "Title and mentor are required" }, { status: 400 });
    }

    // --- SYSTEMATIC "FIND OR CREATE" LOGIC ---
    
    // 2. Check if course with this title already exists FOR THIS USER
    const existingCourse = await prisma.course.findFirst({
      where: { 
        title: { equals: title, mode: "insensitive" },
        userId: userId // Ensure we only match the teacher's own courses
      },
      include: {
        sections: {
          orderBy: { order: "asc" },
          include: { lectures: { orderBy: { order: "asc" } } }
        }
      }
    });

    if (existingCourse) {
      return NextResponse.json(existingCourse, { status: 200 });
    }

    // 3. Create the new course with the required userId
    const newCourse = await prisma.course.create({
      data: {
        userId, // <--- CRITICAL: This fixes your TypeScript error
        title,
        mentor,
        price: parseFloat(price) || 0,
        badge: badge || null,
        color: color || "bg-blue-600",
      },
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