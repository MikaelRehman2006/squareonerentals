import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { v2 as cloudinary } from 'cloudinary';
import { connectDB } from '@/lib/mongodb';
import { User } from '@/models/User';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';

// Storage limits based on membership type (in bytes)
const STORAGE_LIMITS = {
  // 10MB for Basic membership
  BASIC: 10 * 1024 * 1024,
  // 25MB for Featured membership
  FEATURED: 25 * 1024 * 1024,
  // 5MB default for users without membership
  DEFAULT: 5 * 1024 * 1024
};

// Check if Cloudinary is properly configured
const isCloudinaryConfigured = () => {
  // Get cloud name from either prefixed or non-prefixed env var
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  
  // Get API key from either prefixed or non-prefixed env var
  const apiKey = process.env.CLOUDINARY_API_KEY || process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;
  
  // API secret should only be in the non-public variable
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  
  // Alternative way to configure via URL
  const hasUrl = Boolean(process.env.CLOUDINARY_URL);
  
  // Check if we have all required credentials
  const hasCredentials = Boolean(cloudName && apiKey && apiSecret);
  
  console.log('Cloudinary config check:', { 
    hasUrl, 
    hasCredentials,
    cloudName: cloudName ? 'Present' : 'Missing',
    apiKey: apiKey ? 'Present' : 'Missing',
    apiSecret: apiSecret ? 'Present' : 'Missing'
  });
  
  return hasUrl || hasCredentials;
};

// Configure Cloudinary if credentials are available
if (isCloudinaryConfigured()) {
  // Get the cloud name, prefer non-public vars but fall back to public ones
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY || process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  
  cloudinary.config({
    secure: true,
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret
  });
  
  console.log('Cloudinary configured with cloud name:', cloudName);
}

// Helper function to save file locally - note this will not work in production on Vercel
async function saveFileLocally(file: File): Promise<string> {
  try {
    // Create a unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    const fileExtension = file.name.split('.').pop();
    const filename = `image-${timestamp}-${randomString}.${fileExtension}`;
    
    // Ensure the upload directory exists
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }
    
    // Save the file
    const filePath = path.join(uploadDir, filename);
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Use Uint8Array to fix type compatibility issues
    await writeFile(filePath, new Uint8Array(buffer));
    
    // Return the public URL
    return `/uploads/${filename}`;
  } catch (error) {
    console.error('Error saving file locally:', error);
    throw new Error('Failed to save file locally');
  }
}

// Add an OPTIONS handler to support preflight requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  });
}

// Add a GET handler to avoid 405 errors
export async function GET() {
  return NextResponse.json({ message: 'Upload API is working. Use POST to upload files.' });
}

export async function POST(request: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { 
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Get user from session
    const userEmail = session.user?.email;
    if (!userEmail) {
      return NextResponse.json(
        { error: 'User email not found in session' },
        { 
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Connect to database
    await connectDB();

    // Get user with membership information
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { 
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Check if user has an active membership
    const hasMembership = !!user.membership;
    const isActive = user.membership?.status === 'active';

    if (!hasMembership || !isActive) {
      return NextResponse.json(
        { error: 'Active membership required to upload images' },
        { 
          status: 403,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Get the form data
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'File must be an image' },
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Convert buffer to base64 string for Cloudinary upload
    const base64 = buffer.toString('base64');
    const fileStr = `data:${file.type};base64,${base64}`;

    // Upload to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload(fileStr, {
        folder: 'listings',
        resource_type: 'image',
      }, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });

    return NextResponse.json({
      secure_url: (uploadResult as any).secure_url,
      public_id: (uploadResult as any).public_id
    }, {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to upload image' },
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

// Catch-all for unsupported methods
export async function PUT() {
  return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 });
}
export async function PATCH() {
  return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 });
}
export async function DELETE() {
  return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 });
}