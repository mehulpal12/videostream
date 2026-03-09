import { NextRequest , NextResponse } from "next/server";
import { PrismaClient } from "@/lib/generated/prisma/client";
import { prisma } from "@/lib/prisma";


export async function GET(req: NextRequest) {
    try {
        const videos = await prisma.video.findMany({
            orderBy:{createdAt: 'desc'}
        });
        return NextResponse.json(videos);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch videos" }, { status: 500 });
    } finally{
        await prisma.$disconnect();
    }
}