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
import mongoose from 'mongoose';

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
  
  // Accept all common image formats
  const allowedTypes = [
    'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 
    'image/webp', 'image/bmp', 'image/tiff', 'image/svg+xml',
    'image/avif', 'image/heic', 'image/heif'
  ];
  
  if (!allowedTypes.includes(file.type.toLowerCase())) {
    return { valid: false, error: `Unsupported image format: ${file.type}. Supported formats: JPG, PNG, GIF, WebP, BMP, TIFF, SVG, AVIF, HEIC` };
  }
  
  // Check image dimensions to prevent unusually large images
  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Check for common image file headers
    const isJPEG = buffer[0] === 0xFF && buffer[1] === 0xD8;
    const isPNG = buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47;
    const isGIF = buffer[0] === 0x47 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x38;
    const isWebP = buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46;
    const isBMP = buffer[0] === 0x42 && buffer[1] === 0x4D;
    const isTIFF = (buffer[0] === 0x49 && buffer[1] === 0x49) || (buffer[0] === 0x4D && buffer[1] === 0x4D);
    
    // If it's a recognized image format, accept it
    if (isJPEG || isPNG || isGIF || isWebP || isBMP || isTIFF) {
      return { valid: true };
    }
    
    // For other formats (SVG, AVIF, HEIC), trust the MIME type
    if (file.type.startsWith('image/')) {
      return { valid: true };
    }
    
    return { valid: false, error: 'Invalid image format' };
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
    const userId = user._id.toString();
    const storageUsed = await getUserStorageUsed(userId);
    console.log(`Current storage used for user ${userId}: ${storageUsed} bytes (${(storageUsed / (1024 * 1024)).toFixed(2)} MB)`);
    
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
    
    console.log(`Storage check: used=${storageUsed}, fileSize=${fileSize}, limit=${storageLimit}, membershipType=${membershipType}`);
    
    if (storageUsed + fileSize > storageLimit) {
      console.log(`Storage limit exceeded: ${storageUsed + fileSize} > ${storageLimit}`);
      return NextResponse.json({ 
        error: 'Storage limit exceeded',
        storageUsed,
        storageLimit,
        fileSize
      }, { status: 400 });
    }

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Upload using stream with unsigned upload
    const uploadResult = await new Promise<{ secure_url: string, public_id: string, bytes: number }>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'image',
          folder: 'listings',
          upload_preset: 'listings_upload', // Use an unsigned upload preset
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
      console.log(`Storing image metadata: userId=${userId}, url=${uploadResult.secure_url}, size=${uploadResult.bytes || fileSize}`);
      await storeImageMetadata({
        userId: userId,
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id,
        size: uploadResult.bytes || fileSize
      });
      console.log('Image metadata stored successfully');
    } catch (error) {
      console.error("Failed to store image metadata:", error);
      // Continue anyway - the image was uploaded successfully
    }

    // Ensure we're sending the correct response format
    return NextResponse.json({
      secure_url: uploadResult.secure_url,
      public_id: uploadResult.public_id,
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
    await connectDB();
    
    // Get or initialize the ImageMetadata model
    let ImageMetadata: mongoose.Model<any>;
    try {
      ImageMetadata = mongoose.model('ImageMetadata');
    } catch (e) {
      const ImageMetadataSchema = new mongoose.Schema({
        userId: { type: String, required: true, index: true },
        url: { type: String, required: true, unique: true },
        publicId: { type: String, required: true },
        size: { type: Number, required: true },
        listingId: { type: String, index: true },
        createdAt: { type: Date, default: Date.now }
      });
      
      ImageMetadata = mongoose.model('ImageMetadata', ImageMetadataSchema);
    }

    // Get all image metadata for the user
    const metadata = await ImageMetadata.find({ userId }).lean();
    console.log(`Found ${metadata.length} image metadata records for user ${userId}`);
    
    // Calculate total size from actual metadata
    const totalSize = metadata.reduce((total: number, item: any) => {
      const itemSize = item && typeof item.size === 'number' ? item.size : 0;
      return total + itemSize;
    }, 0);
    
    console.log(`Total storage used for user ${userId}: ${totalSize} bytes (${(totalSize / (1024 * 1024)).toFixed(2)} MB)`);
    return totalSize;
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
    await connectDB();
    
    // Get or initialize the ImageMetadata model
    let ImageMetadata: mongoose.Model<any>;
    try {
      ImageMetadata = mongoose.model('ImageMetadata');
    } catch (e) {
      const ImageMetadataSchema = new mongoose.Schema({
        userId: { type: String, required: true, index: true },
        url: { type: String, required: true, unique: true },
        publicId: { type: String, required: true },
        size: { type: Number, required: true },
        listingId: { type: String, index: true },
        createdAt: { type: Date, default: Date.now }
      });
      
      ImageMetadata = mongoose.model('ImageMetadata', ImageMetadataSchema);
    }

    // Create or update the image metadata
    const result = await ImageMetadata.findOneAndUpdate(
      { url: metadata.url },
      {
        userId: metadata.userId,
        url: metadata.url,
        publicId: metadata.publicId,
        size: metadata.size,
        listingId: metadata.listingId || null
      },
      { upsert: true, new: true }
    );

    return result;
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
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
      'Access-Control-Max-Age': '86400'
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