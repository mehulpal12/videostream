import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { prisma } from "@/lib/prisma";

// 1. Cloudinary Configuration
try {
  cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
} catch (configError) {
  console.error("Cloudinary Configuration Error:", configError);
}

interface CloudinaryResult {
  public_id: string;
  secure_url: string;
  duration?: number;
  [key: string]: any;
}

export const dynamic = "force-dynamic";
export const maxDuration = 60; 

export async function POST(req: NextRequest) {
  try {
    // 2. Extract Data from FormData
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const title = formData.get("title") as string || "Untitled Lecture";
    const sectionId = formData.get("sectionId") as string | null;
    const order = parseInt(formData.get("order") as string) || 0;

    // 3. Validation Check
    if (!file || !sectionId) {
      return NextResponse.json(
        { error: "Missing required fields: file or sectionId" },
        { status: 400 }
      );
    }

    // 4. Cloudinary Upload Logic (with internal try/catch)
    let cloudinaryResponse: CloudinaryResult;
    try {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      cloudinaryResponse = await new Promise<CloudinaryResult>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            resource_type: "video",
            folder: "course_lectures",
            transformation: [{ quality: "auto", fetch_format: "mp4" }]
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result as CloudinaryResult);
          }
        );
        uploadStream.end(buffer);
      });
    } catch (uploadError: any) {
      console.error("Cloudinary Upload Process Failed:", uploadError);
      return NextResponse.json(
        { error: "Cloudinary upload failed", details: uploadError.message },
        { status: 500 }
      );
    }

    

    // 5. Database Save Logic (with internal try/catch)
    try {
      const lecture = await prisma.lecture.create({
        data: {
          title,
          videoUrl: cloudinaryResponse.secure_url,
          publicId: cloudinaryResponse.public_id,
          duration: cloudinaryResponse.duration || 0,
          order: order,
          sectionId: sectionId, // Must exist in your Section table
          isPreview: false,
        },
      });

      return NextResponse.json(lecture, { status: 201 });
    } catch (dbError: any) {
      console.error("Prisma Database Error:", dbError);
      
      // If DB fails, you might want to delete the video from Cloudinary here
      // await cloudinary.uploader.destroy(cloudinaryResponse.public_id, { resource_type: 'video' });

      if (dbError.code === 'P2003') {
        return NextResponse.json(
          { error: "Foreign key constraint failed: sectionId does not exist." },
          { status: 400 }
        );
      }
      return NextResponse.json(
        { error: "Database save failed", details: dbError.message },
        { status: 500 }
      );
    }

  } catch (globalError: any) {
    console.error("Global API Error:", globalError);
    return NextResponse.json(
      { error: "Internal Server Error", message: globalError.message },
      { status: 500 }
    );
  }
}