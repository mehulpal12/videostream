import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import WatchPageClient from "@/components/WatchPageClient"; // We'll move your UI logic here

export default async function WatchPageServer({ 
  params 
}: { 
  params: Promise<{ courseId: string }> 
}) {
  const { courseId } = await params;
  const { userId: clerkId } = await auth();

  if (!clerkId) {
    redirect("/sign-in");
  }

  // 1. Fetch User from DB
  const user = await prisma.user.findUnique({
    where: { clerkId },
  });

  if (!user) {
    redirect("/sign-in");
  }

  // 2. Systematic Enrollment Check
  const enrollment = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId: user.id,
        courseId: courseId,
      },
    },
  });

  // 3. Security Gate: Redirect if not enrolled
  if (!enrollment) {
    redirect(`/courses/${courseId}/checkout`);
  }

  // 4. Fetch Course Data with Sections and Lectures
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      sections: {
        orderBy: { order: 'asc' },
        include: {
          lectures: {
            orderBy: { order: 'asc' }
          }
        }
      }
    }
  });

  if (!course) {
    return <div className="p-20 text-center text-white font-bold">Course system data missing.</div>;
  }

  // 5. Pass data to the Client Component for the Interactive Player
  return (
    <WatchPageClient 
      initialCourse={JSON.parse(JSON.stringify(course))} 
    />
  );
}