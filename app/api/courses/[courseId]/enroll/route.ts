import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

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

    // 1. SYSTEMATIC SYNC: Find by clerkId OR email to avoid P2002
    let user = await prisma.user.findFirst({
      where: {
        OR: [
          { clerkId: clerkId },
          { email: email }
        ]
      }
    });

    if (!user) {
      // Create new user if neither exists
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
      // Update existing email record with new clerkId if they don't match
      user = await prisma.user.update({
        where: { id: user.id },
        data: { clerkId: clerkId }
      });
    }

    // 2. CHECK ENROLLMENT: Use the found user.id
    const existingEnrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId: courseId,
        },
      },
    });

    if (existingEnrollment) {
      return NextResponse.json({ message: "Already enrolled" }, { status: 200 });
    }

    // 3. CREATE ENROLLMENT
    const enrollment = await prisma.enrollment.create({
      data: {
        userId: user.id,
        courseId: courseId,
      },
    });

    return NextResponse.json(enrollment, { status: 201 });

  } catch (error: any) {
    console.error("ENROLLMENT_SYSTEM_ERROR:", error);
    return NextResponse.json(
      { error: "Database Sync Error", details: error.code === 'P2002' ? "Email conflict" : error.message },
      { status: 500 }
    );
  }
}