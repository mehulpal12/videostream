import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server"; // Assuming you use Clerk as per your schema

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const { userId: clerkId } = await auth();
    const { courseId } = await params;

    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 1. Find the internal DB user ID using the Clerk ID
    const user = await prisma.user.findUnique({
      where: { clerkId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 2. Create the enrollment
    // Prisma will throw an error if this combination already exists due to @@unique
    const enrollment = await prisma.enrollment.create({
      data: {
        userId: user.id,
        courseId: courseId,
      },
    });

    return NextResponse.json(enrollment, { status: 201 });
  } catch (error: any) {
    // Handle unique constraint violation (User already enrolled)
    if (error.code === 'P2002') {
      return NextResponse.json({ error: "Already enrolled" }, { status: 400 });
    }
    return NextResponse.json({ error: "Enrollment failed" }, { status: 500 });
  }
}