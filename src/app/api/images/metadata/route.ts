import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import mongoose, { Model } from 'mongoose';

// Define interface for image metadata document
interface IImageMetadata {
  userId: string;
  url: string;
  publicId: string;
  size: number;
  listingId?: string;
  createdAt: Date;
}

// Define a schema for image metadata if it doesn't exist
let ImageMetadata: Model<IImageMetadata>;
try {
  ImageMetadata = mongoose.model<IImageMetadata>('ImageMetadata');
} catch (e) {
  const ImageMetadataSchema = new mongoose.Schema({
    userId: { 
      type: String, 
      required: true,
      index: true 
    },
    url: { 
      type: String, 
      required: true,
      unique: true 
    },
    publicId: { 
      type: String, 
      required: true 
    },
    size: { 
      type: Number, 
      required: true 
    },
    listingId: { 
      type: String,
      index: true
    },
    createdAt: { 
      type: Date, 
      default: Date.now 
    }
  });
  
  ImageMetadata = mongoose.model<IImageMetadata>('ImageMetadata', ImageMetadataSchema);
}

export async function POST(request: NextRequest) {
  try {
    // Authenticate the request
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Connect to the database
    await connectDB();

    // Parse the request body
    const body = await request.json();
    
    // Validate required fields
    if (!body.userId || !body.url || !body.publicId || body.size === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Create or update the image metadata
    const metadata = await ImageMetadata.findOneAndUpdate(
      { url: body.url },
      {
        userId: body.userId,
        url: body.url,
        publicId: body.publicId,
        size: body.size,
        listingId: body.listingId || null
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({
      success: true,
      metadata
    });
  } catch (error) {
    console.error('Error storing image metadata:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Authenticate the request
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Connect to the database
    await connectDB();

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const listingId = searchParams.get('listingId');

    if (!userId && !listingId) {
      return NextResponse.json({ error: 'Missing userId or listingId parameter' }, { status: 400 });
    }

    // Build query based on parameters
    const query: Record<string, string> = {};
    if (userId) query.userId = userId;
    if (listingId) query.listingId = listingId;

    // Get image metadata
    const metadata = await ImageMetadata.find(query);
    
    // Calculate total size
    const totalSize = metadata.reduce((total, item) => total + (item.size || 0), 0);

    return NextResponse.json({
      success: true,
      metadata,
      count: metadata.length,
      totalSize
    });
  } catch (error) {
    console.error('Error fetching image metadata:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Authenticate the request
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Connect to the database
    await connectDB();

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');
    const publicId = searchParams.get('publicId');

    if (!url && !publicId) {
      return NextResponse.json({ error: 'Missing url or publicId parameter' }, { status: 400 });
    }

    // Build query based on parameters
    const query: Record<string, string> = {};
    if (url) query.url = url;
    if (publicId) query.publicId = publicId;

    // Delete image metadata
    const result = await ImageMetadata.deleteOne(query);

    return NextResponse.json({
      success: true,
      deleted: result.deletedCount > 0
    });
  } catch (error) {
    console.error('Error deleting image metadata:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 