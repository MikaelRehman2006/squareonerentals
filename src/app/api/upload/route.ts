import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { v2 as cloudinary } from 'cloudinary';

// 5MB in bytes
const MAX_FILE_SIZE = 5 * 1024 * 1024;

// Configure Cloudinary - it will automatically use CLOUDINARY_URL from env
cloudinary.config({
  secure: true
});

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

    // Log cloudinary configuration for debugging
    console.log('Cloudinary config:', { 
      cloud_name: cloudinary.config().cloud_name,
      api_key: cloudinary.config().api_key?.substring(0, 5) + '...' // just show first few chars for security
    });

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Convert buffer to base64 string for Cloudinary upload
    const base64 = buffer.toString('base64');
    const fileStr = `data:${file.type};base64,${base64}`;
    
    console.log('Uploading to Cloudinary...');
    
    // Upload to Cloudinary using the SDK
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload(fileStr, {
        folder: 'listings',
        resource_type: 'image',
      }, (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          reject(error);
        } else {
          resolve(result);
        }
      });
    });

    console.log('Cloudinary upload successful:', uploadResult);

    return NextResponse.json({
      secure_url: (uploadResult as any).secure_url,
      public_id: (uploadResult as any).public_id
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