import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { connectDB } from '@/lib/mongodb';
import mongoose from 'mongoose';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const db = mongoose.connection.db;

    const body = await request.json();
    const { type, ...feedbackData } = body;

    console.log('Received feedback submission:', { type, ...feedbackData });

    // Validate required fields
    if (!type || !feedbackData.subject || !feedbackData.description) {
      console.log('Missing required fields:', { type, subject: feedbackData.subject, description: feedbackData.description });
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create feedback document
    const feedback = {
      type, // 'feedback' or 'issue'
      ...feedbackData,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    console.log('Inserting feedback into database:', feedback);

    // Insert into database
    const result = await db.collection('feedback').insertOne(feedback);

    console.log('Feedback inserted successfully with ID:', result.insertedId);

    return NextResponse.json({
      success: true,
      id: result.insertedId
    });

  } catch (error) {
    console.error('Error handling feedback:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    console.log('Admin feedback GET request - Session:', session?.user?.email);
    
    // Check if user is admin
    if (!session?.user?.email) {
      console.log('No session found');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const db = mongoose.connection.db;
    const user = await db.collection('users').findOne({ email: session.user.email });
    
    console.log('User found:', user?.role);
    
    if (!user || (user.role !== 'admin' && user.role !== 'ADMIN')) {
      console.log('User is not admin, role:', user?.role);
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    console.log('Fetching feedback with filters:', { type, status, page, limit });

    // Build filter
    const filter: any = {};
    if (type) filter.type = type;
    if (status) filter.status = status;

    // Get feedback with pagination
    const feedback = await db.collection('feedback')
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    // Get total count
    const total = await db.collection('feedback').countDocuments(filter);

    console.log('Found feedback items:', feedback.length, 'Total:', total);

    return NextResponse.json({
      feedback,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching feedback:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check if user is admin
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const db = mongoose.connection.db;
    const user = await db.collection('users').findOne({ email: session.user.email });
    
    if (!user || (user.role !== 'admin' && user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const body = await request.json();
    const { id, status, adminNotes } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Feedback ID is required' },
        { status: 400 }
      );
    }

    // Update feedback
    const { ObjectId } = require('mongodb');
    const result = await db.collection('feedback').updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          status,
          adminNotes,
          updatedAt: new Date()
        }
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Feedback not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error updating feedback:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 