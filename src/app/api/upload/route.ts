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

if (isCloudinaryConfigured()) {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY || process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  cloudinary.config({
    secure: true,
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret
  });
}

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
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userEmail = session.user?.email;
    if (!userEmail) {
      return NextResponse.json({ error: 'User email not found in session' }, { status: 401 });
    }
    await connectDB();
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    const hasMembership = !!user.membership;
    const isActive = user.membership?.status === 'active';
    if (!hasMembership || !isActive) {
      return NextResponse.json({ error: 'Active membership required to upload images' }, { status: 403 });
    }
    let formData;
    try {
      formData = await request.formData();
    } catch (formError) {
      return NextResponse.json({ error: 'Invalid form data submitted' }, { status: 400 });
    }
    const file = formData.get('file');
    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'Invalid file upload' }, { status: 400 });
    }
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'File must be an image' }, { status: 400 });
    }
    // Upload to Cloudinary
    try {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const base64 = buffer.toString('base64');
      const fileStr = `data:${file.type};base64,${base64}`;
      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload(fileStr, {
          folder: 'listings',
          resource_type: 'image',
        }, (error, result) => {
          if (error) {
            reject(new Error(`Cloudinary upload error: ${error.message || JSON.stringify(error)}`));
          } else if (result && result.secure_url) {
            resolve({
              secure_url: result.secure_url,
              public_id: result.public_id
            });
          } else {
            reject(new Error('Missing result data from Cloudinary'));
          }
        });
      });
      return NextResponse.json(uploadResult);
    } catch (cloudinaryError) {
      return NextResponse.json({ error: 'Image upload failed. Please try again later or contact support.' }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error occurred' }, { status: 500 });
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