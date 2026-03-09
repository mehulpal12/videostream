import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";

    const courses = await prisma.course.findMany({
      where: {
        ...(search && {
          title: { contains: search, mode: "insensitive" as const },
        }),
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(courses);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch courses" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, mentor, price, badge, color } = body;

    if (!title || !mentor) {
      return NextResponse.json(
        { error: "Title and mentor are required" },
        { status: 400 }
      );
    }

    const course = await prisma.course.create({
      data: {
        title,
        mentor,
        price: parseFloat(price) || 0,
        badge: badge || null,
        color: color || "bg-blue-600",
      },
    });

    return NextResponse.json(course, { status: 201 });
  } catch (error: any) {
    console.error("Create course failed:", error);
    return NextResponse.json(
      { error: "Failed to create course", details: error.message },
      { status: 500 }
    );
  }
}
