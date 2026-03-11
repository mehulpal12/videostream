import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@/lib/generated/prisma/client";

export async function GET(req: NextRequest) {
  try {
    const sortOrder: Prisma.SortOrder = 'desc';
    const videos = await prisma.lecture.findMany({
      orderBy: { createdAt: sortOrder },
    });
    return NextResponse.json(videos);
  } catch (error) {
    console.error("Failed to fetch videos:", error);
    return NextResponse.json(
      { error: "Failed to fetch videos" },
      { status: 500 }
    );
  } 
}