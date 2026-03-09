import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { prisma } from '@/lib/prisma';

// Configuration
cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET 
});

interface CloudinaryUploadResult {
    public_id: string;
    bytes: number;
    duration?: number;
    secure_url: string; // Added this to fix Prisma 'url' requirement
    [key: string]: unknown;
}

export async function POST(request: NextRequest) {
    try {
        // 1. Config Check
        if (!process.env.CLOUDINARY_API_SECRET) {
            return NextResponse.json({ error: "Cloudinary credentials not found" }, { status: 500 });
        }

        // 2. Content-Type Check (Prevents the "Failed to parse body" crash)
        const contentType = request.headers.get("content-type") || "";
        if (!contentType.includes("multipart/form-data")) {
            return NextResponse.json({ error: "Invalid Content-Type. Use form-data." }, { status: 400 });
        }

        const formData = await request.formData();
        const file = formData.get("file") as File | null;
        const title = formData.get("title") as string | null;
        const description = formData.get("description") as string | null;
        const originalSize = formData.get("originalSize") as string | null;

        if (!file) {
            return NextResponse.json({ error: "File not found" }, { status: 400 });
        }

        // 3. Process Buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // 4. Upload to Cloudinary with Promise
        const result = await new Promise<CloudinaryUploadResult>((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    resource_type: "video",
                    folder: "videoStream-video",
                    transformation: [
                        { quality: "auto" },
                        { fetch_format: "mp4" } // mp4 is safer for general video playback
                    ]
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result as CloudinaryUploadResult);
                }
            );
            uploadStream.end(buffer);
        });

        // 5. Save to Prisma (Ensuring all required fields like 'url' are present)
        const video = await prisma.video.create({
            data: {
                title: title || "Untitled",
                description: description || "",
                publicId: result.public_id,
                id: result.public_id,
                duration: result.duration || 0,
                originalSize: originalSize || String(file.size), // Fallback to actual file size
                compressedSize: String(result.bytes)
            }
        });

        return NextResponse.json(video, { status: 200 });

    } catch (error) {
        console.error("Upload video failed:", error);
        const message = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json(
            { error: "Upload failed", details: message }, 
            { status: 500 }
        );
    }
}