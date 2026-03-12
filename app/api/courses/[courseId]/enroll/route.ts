import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

// 1. GET: To check if user is enrolled
export async function GET(
  req: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  const { userId: clerkId } = await auth();
  const { courseId } = await params;

  if (!clerkId) return NextResponse.json({ isEnrolled: false });

  const enrollment = await prisma.enrollment.findFirst({
    where: {
      courseId: courseId,
      user: { clerkId: clerkId }
    }
  });

  return NextResponse.json({ isEnrolled: !!enrollment });
}

// 2. POST: To actually enroll (your original code)
export async function POST(
  req: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const { courseId } = await params;
    const { userId: clerkId } = await auth();
    const clerkUser = await currentUser();

    if (!clerkId || !clerkUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const email = clerkUser.emailAddresses[0].emailAddress;

    let user = await prisma.user.findFirst({
      where: { OR: [{ clerkId: clerkId }, { email: email }] }
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          clerkId,
          email,
          username: clerkUser.username || clerkUser.firstName || "User",
          firstName: clerkUser.firstName,
          lastName: clerkUser.lastName,
          imageUrl: clerkUser.imageUrl,
        }
      });
    } else if (user.clerkId !== clerkId) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: { clerkId: clerkId }
      });
    }

    const existingEnrollment = await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId: user.id, courseId: courseId } },
    });

    if (existingEnrollment) {
      return NextResponse.json({ message: "Already enrolled" }, { status: 200 });
    }

    const enrollment = await prisma.enrollment.create({
      data: { userId: user.id, courseId: courseId },
    });

    return NextResponse.json(enrollment, { status: 201 });

  } catch (error: any) {
    console.error("ENROLLMENT_SYSTEM_ERROR:", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}