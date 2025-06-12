import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { v2 as cloudinary } from 'cloudinary';
import { connectDB } from '@/lib/mongodb';
import { User } from '@/models/User';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';
import { CLOUDINARY_CONFIG } from '@/lib/envConfig';

// Storage limits based on membership type (in bytes)
const STORAGE_LIMITS = {
  BASIC: 10 * 1024 * 1024,
  FEATURED: 25 * 1024 * 1024,
  DEFAULT: 5 * 1024 * 1024
};

const isCloudinaryConfigured = () => {
  return CLOUDINARY_CONFIG.isConfigured;
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

// Add better file validation
const validateFile = async (file: File): Promise<{ valid: boolean; error?: string }> => {
  // Check if it's actually an image
  if (!file.type.startsWith('image/')) {
    return { valid: false, error: 'Only image files are allowed' };
  }
  
  // Check file size (5MB limit)
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: `File size exceeds the 5MB limit` };
  }
  
  // Check image dimensions to prevent unusually large images
  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Simple check for image file headers
    // JPEG starts with FF D8
    if (buffer[0] === 0xFF && buffer[1] === 0xD8) {
      // It's a JPEG
    } 
    // PNG starts with 89 50 4E 47
    else if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47) {
      // It's a PNG
    }
    // GIF starts with GIF8
    else if (buffer[0] === 0x47 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x38) {
      // It's a GIF
    } 
    else {
      return { valid: false, error: 'Invalid image format' };
    }
    
    return { valid: true };
  } catch (error) {
    console.error('Error validating file:', error);
    return { valid: false, error: 'Failed to validate file' };
  }
};

export async function POST(request: Request) {
  try {
    // Cloudinary config at runtime - only need cloud_name and api_key for unsigned uploads
    cloudinary.config({
      cloud_name: CLOUDINARY_CONFIG.cloudName,
      api_key: CLOUDINARY_CONFIG.apiKey,
      secure: true,
    });

    console.log("Cloudinary ENV Check", {
      API_KEY: process.env.CLOUDINARY_API_KEY,
      CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME
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

    // Storage check - get user's current storage usage
    // This is an estimation based on the user's uploaded images
    const userId = user._id.toString();
    const storageUsed = await getUserStorageUsed(userId);
    
    const formData = await request.formData();
    const file = formData.get('file');

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'Invalid file type' }, { status: 400 });
    }
    
    // Enhanced file validation
    const fileValidation = await validateFile(file);
    if (!fileValidation.valid) {
      return NextResponse.json({ error: fileValidation.error }, { status: 400 });
    }

    // Get file size
    const fileSize = file.size;
    
    // Check if this upload would exceed the user's storage limit
    const membershipType = user.membership?.type || 'DEFAULT';
    const storageLimit = STORAGE_LIMITS[membershipType] || STORAGE_LIMITS.DEFAULT;
    
    if (storageUsed + fileSize > storageLimit) {
      return NextResponse.json({ 
        error: 'Storage limit exceeded',
        storageUsed,
        storageLimit,
        fileSize
      }, { status: 400 });
    }

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Upload using stream
    const uploadResult = await new Promise<{ secure_url: string, public_id: string, bytes: number }>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          upload_preset: 'listings_upload',
          resource_type: 'image',
          unsigned: true
        },
        (error, result) => {
          if (error) {
            console.error("Cloudinary Upload Error", error);
            reject(error);
          } else if (result?.secure_url) {
            resolve({
              secure_url: result.secure_url,
              public_id: result.public_id,
              bytes: result.bytes || fileSize
            });
          } else {
            reject(new Error("Unexpected Cloudinary result"));
          }
        }
      );
      stream.end(buffer); // Send buffer into the stream
    });

    // Store the file size in the database for accurate tracking
    try {
      await storeImageMetadata({
        userId: userId,
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id,
        size: uploadResult.bytes || fileSize
      });
    } catch (error) {
      console.error("Failed to store image metadata:", error);
      // Continue anyway - the image was uploaded successfully
    }

    return NextResponse.json({
      ...uploadResult,
      size: uploadResult.bytes || fileSize
    });
  } catch (error) {
    console.error("Upload Failed:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}

// Helper function to get a user's total storage used
async function getUserStorageUsed(userId: string): Promise<number> {
  try {
    // Attempt to get from the ImageMetadata collection first (most accurate)
    const result = await fetch(`/api/users/${userId}/storage`);
    if (result.ok) {
      const data = await result.json();
      return data.storageUsage?.bytes || 0;
    }
    return 0;
  } catch (error) {
    console.error("Error getting storage usage:", error);
    return 0; // Default to 0 if there's an error
  }
}

// Helper function to store image metadata
async function storeImageMetadata(metadata: { 
  userId: string, 
  url: string, 
  publicId: string, 
  size: number,
  listingId?: string
}) {
  try {
    const response = await fetch('/api/images/metadata', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(metadata),
    });
    
    if (!response.ok) {
      throw new Error('Failed to store image metadata');
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error storing image metadata:", error);
    throw error;
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