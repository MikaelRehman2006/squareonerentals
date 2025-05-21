import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import mongoose from 'mongoose';

// THIS IS FOR DEVELOPMENT ONLY - Direct database fix
export async function POST(request: Request) {
  try {
    // Only allow in development mode
    if (process.env.NODE_ENV !== 'development') {
      return NextResponse.json(
        { error: 'This endpoint is only available in development mode' },
        { status: 403 }
      );
    }

    // Parse email from request body
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();
    
    // Use native MongoDB driver to bypass Mongoose validation
    const db = mongoose.connection.db;
    const usersCollection = db.collection('users');
    
    // Find user by email
    const user = await usersCollection.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    console.log('Found user:', user.email);

    // Set current date for start date
    const startDate = new Date();
    
    // Set end date to 30 days from now for monthly or 365 days for annual
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 30); // 30 days for monthly

    // Update user directly with MongoDB driver to bypass validation
    const result = await usersCollection.updateOne(
      { email },
      { 
        $set: {
          membership: {
            type: 'FEATURED', // Set to FEATURED for maximum capabilities
            isAnnual: false,
            startDate: startDate,
            endDate: endDate,
            stripeCustomerId: 'dev_customer_' + Date.now(),
            stripeSubscriptionId: 'dev_subscription_' + Date.now(),
            status: 'active'
          }
        }
      }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { error: 'Failed to update user' },
        { status: 500 }
      );
    }

    // Get updated user
    const updatedUser = await usersCollection.findOne({ email });

    return NextResponse.json({
      success: true,
      message: 'Membership activated successfully',
      membership: updatedUser?.membership || null
    });
  } catch (error) {
    console.error('Error fixing membership:', error);
    return NextResponse.json(
      { error: 'Failed to fix membership', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
