import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { v2 as cloudinary } from 'cloudinary';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';

// 5MB in bytes
const MAX_FILE_SIZE = 5 * 1024 * 1024;

// Check if Cloudinary is properly configured
const isCloudinaryConfigured = () => {
  return Boolean(
    process.env.CLOUDINARY_URL || 
    (process.env.CLOUDINARY_CLOUD_NAME && 
     process.env.CLOUDINARY_API_KEY && 
     process.env.CLOUDINARY_API_SECRET)
  );
};

// Configure Cloudinary if credentials are available
if (isCloudinaryConfigured()) {
  cloudinary.config({
    secure: true,
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
}

// Helper function to save file locally
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
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer as Buffer);
    
    // Return the public URL
    return `/uploads/${filename}`;
  } catch (error) {
    console.error('Error saving file locally:', error);
    throw new Error('Failed to save file locally');
  }
}

export async function POST(request: Request) {
  try {
    console.log('Upload request received');
    
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get the form data
    const formData = await request.formData();
    const file = formData.get('file') as File;

    // Validate file
    if (!file) {
      console.error('No file provided');
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      console.error('File too large:', file.size);
      return NextResponse.json(
        { error: 'File size must be less than 5MB' },
        { status: 400 }
      );
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      console.error('Invalid file type:', file.type);
      return NextResponse.json(
        { error: 'File must be an image' },
        { status: 400 }
      );
    }

    console.log('File validation passed, preparing for upload');

    // Try to use Cloudinary if configured, otherwise fall back to local storage
    if (isCloudinaryConfigured()) {
      try {
        console.log('Using Cloudinary for image upload');
        
        // Convert file to buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        
        // Convert buffer to base64 string for Cloudinary upload
        const base64 = buffer.toString('base64');
        const fileStr = `data:${file.type};base64,${base64}`;
        
        // Upload to Cloudinary using the SDK
        const uploadResult = await new Promise((resolve, reject) => {
          cloudinary.uploader.upload(fileStr, {
            folder: 'listings',
            resource_type: 'image',
          }, (error: any, result: any) => {
            if (error) {
              console.error('Cloudinary upload error:', error);
              reject(error);
            } else {
              resolve(result);
            }
          });
        });

        console.log('Cloudinary upload successful');

        return NextResponse.json({
          secure_url: (uploadResult as any).secure_url,
          public_id: (uploadResult as any).public_id
        });
      } catch (cloudinaryError) {
        console.error('Cloudinary upload failed, falling back to local storage:', cloudinaryError);
        // Fall back to local storage if Cloudinary fails
      }
    } else {
      console.log('Cloudinary not configured, using local storage');
    }
    
    // Local storage fallback
    const fileUrl = await saveFileLocally(file);
    console.log('Local file upload successful:', fileUrl);
    
    return NextResponse.json({
      secure_url: fileUrl,
      public_id: fileUrl
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to upload image', 
        details: error instanceof Error ? error.message : String(error) 
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { publicId } = await request.json();

    if (!publicId) {
      return NextResponse.json(
        { error: 'No public ID provided' },
        { status: 400 }
      );
    }

    console.log('Deleting image from Cloudinary:', publicId);

    // Delete from Cloudinary using the SDK
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(publicId, (error, result) => {
        if (error) {
          console.error('Cloudinary delete error:', error);
          reject(error);
        } else {
          resolve(result);
        }
      });
    });

    return NextResponse.json({
      result: (result as any).result
    });

  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { error: 'Failed to delete image', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}