import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { v2 as cloudinary } from 'cloudinary';
import { connectDB } from '@/lib/mongodb';
import { User } from '@/models/User';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';

// Storage limits based on membership type (in bytes)
const STORAGE_LIMITS = {
  BASIC: 10 * 1024 * 1024,
  FEATURED: 25 * 1024 * 1024,
  DEFAULT: 5 * 1024 * 1024
};

const isCloudinaryConfigured = () => {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY || process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  const hasUrl = Boolean(process.env.CLOUDINARY_URL);
  const hasCredentials = Boolean(cloudName && apiKey && apiSecret);
  return hasUrl || hasCredentials;
};

async function saveFileLocally(file: File) {
  try {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    const fileExtension = file.name.split('.').pop();
    const filename = `image-${timestamp}-${randomString}.${fileExtension}`;
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }
    const filePath = path.join(uploadDir, filename);
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    await writeFile(filePath, new Uint8Array(buffer));
    return `/uploads/${filename}`;
  } catch (error) {
    console.error('Error saving file locally:', error);
    throw new Error('Failed to save file locally');
  }
}

// Log every request method for debugging
export const dynamic = 'force-dynamic'; // Ensure dynamic route on Vercel

export async function GET() {
  return NextResponse.json({ message: 'Upload API is working. Use POST to upload files.' });
}

export async function POST(request: Request) {
  try {
    // Cloudinary config at runtime
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true,
    });

    console.log("Cloudinary ENV Check", {
      API_KEY: process.env.CLOUDINARY_API_KEY,
      API_SECRET_EXISTS: !!process.env.CLOUDINARY_API_SECRET
    });

    // Auth check
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const user = await User.findOne({ email: session.user.email });
    if (!user?.membership || user.membership.status !== 'active') {
      return NextResponse.json({ error: 'Active membership required' }, { status: 403 });
    }

    const formData = await request.formData();
    const file = formData.get('file');

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'Invalid file type' }, { status: 400 });
    }
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Only image uploads are allowed' }, { status: 400 });
    }

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Upload using stream
    const uploadResult = await new Promise<{ secure_url: string, public_id: string }>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: 'listings',
          resource_type: 'image'
        },
        (error, result) => {
          if (error) {
            console.error("Cloudinary Upload Error", error);
            reject(error);
          } else if (result?.secure_url) {
            resolve({
              secure_url: result.secure_url,
              public_id: result.public_id
            });
          } else {
            reject(new Error("Unexpected Cloudinary result"));
          }
        }
      );
      stream.end(buffer); // Send buffer into the stream
    });

    return NextResponse.json(uploadResult);
  } catch (error) {
    console.error("Upload Failed:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  });
}

export async function PUT() {
  console.log('[UPLOAD API] PUT method called - 405');
  return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 });
}
export async function PATCH() {
  console.log('[UPLOAD API] PATCH method called - 405');
  return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 });
}
export async function DELETE() {
  console.log('[UPLOAD API] DELETE method called - 405');
  return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 });
} 