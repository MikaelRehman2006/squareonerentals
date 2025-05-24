import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { v2 as cloudinary } from 'cloudinary';
import { connectDB } from '@/lib/mongodb';
import { User } from '@/models/User';
import { promises as fs } from 'fs';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user from session
    const userEmail = session.user?.email;
    if (!userEmail) {
      return NextResponse.json({ error: 'User email not found in session' }, { status: 401 });
    }

    // Connect to database
    await connectDB();

    // Get user with membership information
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if user has an active membership
    const hasMembership = !!user.membership;
    const isActive = user.membership?.status === 'active';
    if (!hasMembership || !isActive) {
      return NextResponse.json({ error: 'Active membership required to upload images' }, { status: 403 });
    }

    // Parse the incoming form data using formidable
    const formidable = (await import('formidable')).default;
    const form = formidable({});
    // formidable expects a Node.js IncomingMessage, so we need to get the raw request
    const reqNode = (req as any).req;
    const [fields, files] = await new Promise<[Record<string, any>, Record<string, any>]>((resolve, reject) => {
      form.parse(reqNode, (err, fields, files) => {
        if (err) reject(err);
        else resolve([fields, files]);
      });
    });
    let file = files.file;
    if (Array.isArray(file)) {
      file = file[0];
    }

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    if (!file.mimetype?.startsWith('image/')) {
      return NextResponse.json({ error: 'File must be an image' }, { status: 400 });
    }

    // Read the file
    const fileBuffer = await fs.readFile(file.filepath);

    // Convert buffer to base64 string for Cloudinary upload
    const base64 = fileBuffer.toString('base64');
    const fileStr = `data:${file.mimetype};base64,${base64}`;

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

    // Clean up the temporary file
    await fs.unlink(file.filepath);

    return NextResponse.json({
      secure_url: (uploadResult as any).secure_url,
      public_id: (uploadResult as any).public_id
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Failed to upload image'
    }, { status: 500 });
  }
} 