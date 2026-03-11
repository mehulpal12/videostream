import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const { courseId } = await params; // Crucial: Await the params
    const { title, order } = await req.json();

    const section = await prisma.section.create({
      data: {
        title,
        order: parseInt(order),
        courseId: courseId, // Link it to the course
      },
    });

    return NextResponse.json(section);
  } catch (error) {
    console.error("SECTION_ERROR:", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}