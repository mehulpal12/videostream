import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { CheckCircle2, ShieldCheck, Zap, ArrowLeft, CreditCard } from "lucide-react";
import Link from "next/link";
import CheckoutButton from "@/components/CheckoutButton";

// Next.js 15 requires params to be treated as a Promise
export default async function CheckoutPage({ 
  params 
}: { 
  params: Promise<{ courseId: string }> 
}) {
  // 1. MUST AWAIT params before destructuring
  const resolvedParams = await params;
  const courseId = resolvedParams.courseId;
  
  const { userId: clerkId } = await auth();
  console.log(courseId);
  if(!courseId){
     return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-[#0B0F17] text-white p-4">
        <div className="bg-red-500/10 p-6 rounded-3xl border border-red-500/20 text-center max-w-md">
          <h1 className="text-2xl font-bold text-red-500">Course Id Not Found</h1>
          <p className="text-slate-500 mt-2 text-sm">
            We couldn't find a course with ID: <code className="bg-white/5 px-1 rounded">{courseId}</code>
          </p>
          <Link href="/courses" className="mt-6 inline-flex items-center gap-2 text-blue-500 hover:text-blue-400 font-bold transition-colors">
            <ArrowLeft size={16} /> Browse All Courses
          </Link>
        </div>
      </div>
    );
  }
  

  if (!clerkId) {
    redirect("/sign-in");
  }

  // 2. Fetch Course Details from Prisma
  const course = await prisma.course.findUnique({
    where: { id: courseId },
  });

  // 3. Fallback UI if courseId is invalid or missing in DB
  if (!course) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-[#0B0F17] text-white p-4">
        <div className="bg-red-500/10 p-6 rounded-3xl border border-red-500/20 text-center max-w-md">
          <h1 className="text-2xl font-bold text-red-500">Course Not Found</h1>
          <p className="text-slate-500 mt-2 text-sm">
            We couldn't find a course with ID: <code className="bg-white/5 px-1 rounded">{courseId}</code>
          </p>
          <Link href="/courses" className="mt-6 inline-flex items-center gap-2 text-blue-500 hover:text-blue-400 font-bold transition-colors">
            <ArrowLeft size={16} /> Browse All Courses
          </Link>
        </div>
      </div>
    );
  }

  // 4. Verification: Prevent double payment if already enrolled
  const user = await prisma.user.findUnique({ where: { clerkId } });
  
  if (user) {
    const enrollment = await prisma.enrollment.findUnique({
      where: { 
        userId_courseId: { 
          userId: user.id, 
          courseId: courseId 
        } 
      }
    });

    if (enrollment) {
      redirect(`/courses/${courseId}/watch`);
    }
  }

  return (
    <div className="min-h-screen bg-[#0B0F17] text-slate-100 p-6 md:p-12 lg:p-20">
      <div className="max-w-6xl mx-auto">
        <Link 
          href={`/courses/${courseId}`} 
          className="inline-flex items-center gap-2 text-slate-500 hover:text-white mb-10 transition-colors group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
          Back to Course Details
        </Link>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* LEFT COLUMN: Summary */}
          <div className="space-y-10">
            <div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-4">
                Secure your <span className="text-blue-500">Spot</span>
              </h1>
              <p className="text-slate-400 text-lg">
                You're joining <span className="text-white font-bold">{course.title}</span> by {course.mentor}.
              </p>
            </div>

            <div className="bg-white/5 border border-white/5 rounded-[2rem] p-8 space-y-6 backdrop-blur-sm">
              <div className="flex justify-between items-center pb-6 border-b border-white/5">
                <span className="text-slate-400 font-medium">Original Price</span>
                <span className="text-xl font-bold">₹{course.price.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-3xl font-black">
                <span>Total Due</span>
                <span className="text-blue-500">₹{course.price.toLocaleString()}</span>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
                Enrollment Benefits
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                <BenefitItem text="Unlimited Lifetime Access" />
                <BenefitItem text="HD Video Lectures" />
                <BenefitItem text="Project Source Code" />
                <BenefitItem text="Course Certificate" />
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Payment Card */}
          <div className="bg-[#111622] rounded-[3rem] border border-white/5 p-8 md:p-12 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50" />
            
            <div className="flex items-center gap-5 mb-10">
              <div className="bg-blue-600/10 p-4 rounded-2xl text-blue-500 border border-blue-500/20">
                <ShieldCheck size={28} />
              </div>
              <div>
                <h4 className="font-bold text-lg">Guaranteed Safety</h4>
                <p className="text-xs text-slate-500">SSL Encrypted Payment Processing</p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Client Component Button */}
              <CheckoutButton courseId={courseId} price={course.price} />
              
              <p className="text-[10px] text-center text-slate-500 leading-relaxed px-4">
                By clicking "Proceed to Pay", you agree to the platform's terms of service. Access is granted instantly upon successful payment.
              </p>
            </div>

            <div className="mt-12 flex justify-center gap-8 grayscale opacity-20">
               <Zap size={20} />
               <CheckCircle2 size={20} />
               <CreditCard size={20} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function BenefitItem({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3 text-sm text-slate-300">
      <div className="bg-green-500/20 p-1 rounded-full">
        <CheckCircle2 size={14} className="text-green-500" />
      </div>
      {text}
    </div>
  );
}