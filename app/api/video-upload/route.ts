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
    secure_url: string;
    [key: string]: unknown;
}

export async function POST(request: NextRequest) {
    try {
        if (!process.env.CLOUDINARY_API_SECRET) {
            return NextResponse.json({ error: "Cloudinary credentials not found" }, { status: 500 });
        }

        const formData = await request.formData();
        const file = formData.get("file") as File | null;
        const title = formData.get("title") as string | null;
        
        // --- NEW FIELDS REQUIRED BY YOUR SCHEMA ---
        const sectionId = formData.get("sectionId") as string | null;
        const order = parseInt(formData.get("order") as string || "0");
        const isPreview = formData.get("isPreview") === "true";

        if (!file || !sectionId) {
            return NextResponse.json({ error: "File or Section ID missing" }, { status: 400 });
        }

        // 1. Process Buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // 2. Upload to Cloudinary
        const result = await new Promise<CloudinaryUploadResult>((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    resource_type: "video",
                    folder: "videoStream-lectures",
                    transformation: [{ quality: "auto" }, { fetch_format: "mp4" }]
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result as CloudinaryUploadResult);
                }
            );
            uploadStream.end(buffer);
        });

        // 3. Save to Prisma (Using the 'Lecture' model from your new schema)
        const lecture = await prisma.lecture.create({
            data: {
                title: title || "Untitled Lecture",
                videoUrl: result.secure_url, // Your schema needs 'videoUrl'
                publicId: result.public_id,
                duration: result.duration || 0,
                order: order,                // Position in the chapter
                isPreview: isPreview,        // Can students see this for free?
                sectionId: sectionId,        // The link to the Chapter
            }
        });

        return NextResponse.json(lecture, { status: 200 });

    } catch (error) {
        console.error("Upload failed:", error);
        return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }
}