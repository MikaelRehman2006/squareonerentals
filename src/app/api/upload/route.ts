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
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
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
    console.log('Upload request received');
    
    // Always use Cloudinary in production
    const isProd = process.env.NODE_ENV === 'production';
    const url = new URL(request.url);
    const forceLocal = url.searchParams.get('forceLocal') === 'true' && !isProd;
    if (forceLocal) {
      console.log('Forced local upload requested');
    }
    
    // In production, we need to verify Cloudinary is configured
    if (isProd && !isCloudinaryConfigured()) {
      console.error('Cloudinary not configured in production environment');
      return NextResponse.json(
        { error: 'Image upload service not properly configured' },
        { status: 500 }
      );
    }
    
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Get user from session
    const userEmail = session.user.email;
    
    if (!userEmail) {
      return NextResponse.json(
        { error: 'User email not found in session' },
        { status: 401 }
      );
    }
    
    // Connect to the database
    await connectDB();
    
    // Get user with membership information - use email instead of ID to avoid ObjectId issues
    console.log('Looking up user by email:', userEmail);
    const user = await User.findOne({ email: userEmail });
    
    if (!user) {
      console.error('User not found with email:', userEmail);
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    console.log('Found user with ID:', user._id);
    
    // Check if user has an active membership - more robust check
    const hasMembership = !!user.membership;
    const isActive = user.membership?.status === 'active';
    
    console.log('Membership check:', { 
      hasMembership, 
      membershipStatus: user.membership?.status || 'none',
      membershipType: user.membership?.type || 'none',
      isActive
    });

    if (!hasMembership || !isActive) {
      console.error('User does not have an active membership');
      return NextResponse.json(
        { error: 'Active membership required to upload images' },
        { status: 403 }
      );
    }

    // Get the form data with better error handling
    let formData;
    try {
      formData = await request.formData();
      console.log('Form data received, entries:', [...formData.entries()].map(e => e[0]));
    } catch (formError) {
      console.error('Error parsing form data:', formError);
      return NextResponse.json(
        { error: 'Invalid form data submitted' },
        { status: 400 }
      );
    }
    
    const file = formData.get('file') as File;
    console.log('File received:', file ? { name: file.name, type: file.type, size: file.size } : 'No file');

    // Validate file
    if (!file) {
      console.error('No file provided');
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Determine file size limit based on membership type
    const membershipType = user.membership?.type || 'DEFAULT';
    const sizeLimit = STORAGE_LIMITS[membershipType as keyof typeof STORAGE_LIMITS] || STORAGE_LIMITS.DEFAULT;
    
    // Check file size against membership limit
    if (file.size > sizeLimit) {
      console.error('File too large for membership tier:', file.size);
      return NextResponse.json(
        { 
          error: `File size exceeds your membership limit of ${sizeLimit / (1024 * 1024)}MB`, 
          membershipType: membershipType,
          currentLimit: sizeLimit / (1024 * 1024)
        },
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

    // Try to use Cloudinary if configured and not forced to use local storage
    if (isCloudinaryConfigured() && !forceLocal) {
      try {
        console.log('Using Cloudinary for image upload');
        
        // Convert file to buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        
        // Convert buffer to base64 string for Cloudinary upload
        const base64 = buffer.toString('base64');
        const fileStr = `data:${file.type};base64,${base64}`;
        
        // Upload to Cloudinary using the SDK
        const uploadResult = await new Promise<{secure_url: string, public_id: string}>((resolve, reject) => {
          try {
            console.log('Attempting Cloudinary upload with params:', {
              folder: 'listings',
              resource_type: 'image',
              fileType: file.type,
              fileSize: file.size
            });
            
            // Get upload preset if available
            const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'rentals_upload';
            
            console.log('Using upload preset:', uploadPreset);
            
            cloudinary.uploader.upload(fileStr, {
              folder: 'listings',
              resource_type: 'image',
              upload_preset: uploadPreset,
            }, (error, result) => {
              if (error) {
                console.error('Cloudinary upload error:', error);
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
          } catch (innerError) {
            console.error('Error during Cloudinary upload setup:', innerError);
            reject(new Error(`Cloudinary setup error: ${innerError instanceof Error ? innerError.message : String(innerError)}`));
          }
        });

        console.log('Cloudinary upload successful');

        return NextResponse.json({
          secure_url: uploadResult.secure_url,
          public_id: uploadResult.public_id
        });
      } catch (cloudinaryError) {
        console.error('Cloudinary upload failed, falling back to local storage:', cloudinaryError);
        
        // More detailed error logging
        if (cloudinaryError instanceof Error) {
          console.error('Error details:', {
            message: cloudinaryError.message,
            stack: cloudinaryError.stack,
            name: cloudinaryError.name
          });
        } else {
          console.error('Non-Error object thrown:', cloudinaryError);
        }
        
        // Will fall back to local storage below
      }
    } else if (forceLocal) {
      console.log('Forced to use local storage for this upload');
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
    const result = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader.destroy(publicId, (error: any, result: any) => {
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