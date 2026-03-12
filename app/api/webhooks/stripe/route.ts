import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-01-27.acacia",
});

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  if (event.type === "checkout.session.completed") {
    const userId = session?.metadata?.clerkId;
    const courseId = session?.metadata?.courseId;

    if (!userId || !courseId) {
      return new NextResponse("Webhook Error: Missing metadata", { status: 400 });
    }

    // SYSTEMATIC ENROLLMENT
    const user = await prisma.user.findUnique({ where: { clerkId: userId } });
    
    if (user) {
      await prisma.enrollment.create({
        data: {
          userId: user.id,
          courseId: courseId,
        },
      });
    }
  }

  return new NextResponse(null, { status: 200 });
}