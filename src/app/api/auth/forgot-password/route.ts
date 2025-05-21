import { NextResponse } from 'next/server';
import { randomBytes } from 'crypto';
import { connectDB } from '@/lib/mongodb';
import { Collection, ObjectId } from 'mongodb';
import { z } from 'zod';

const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

interface User {
  _id: ObjectId;
  id: string;
  email: string;
}

interface PasswordReset {
  _id: ObjectId;
  id: string;
  token: string;
  userId: string;
  used: boolean;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const body = forgotPasswordSchema.parse(json);

    const mongoose = await connectDB();
    const db = mongoose.connection.db;
    const usersCollection: Collection<User> = db.collection('users');
    const passwordResetsCollection: Collection<PasswordReset> = db.collection('password_resets');

    // Find user by email
    const user = await usersCollection.findOne({ email: body.email });
    if (!user) {
      // Return success even if user not found to prevent email enumeration
      return NextResponse.json({
        success: true,
        message: 'If an account exists with that email, a password reset link will be sent.'
      });
    }

    // Generate reset token
    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create password reset record
    const passwordReset = {
      _id: new ObjectId(),
      id: new ObjectId().toString(),
      token,
      userId: user.id,
      used: false,
      expiresAt,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await passwordResetsCollection.insertOne(passwordReset);

    // TODO: Send email with reset link
    // This would be implemented with your email service provider
    console.log('Reset token for development:', token);

    return NextResponse.json({
      success: true,
      message: 'If an account exists with that email, a password reset link will be sent.'
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse('Invalid email address', { status: 400 });
    }

    console.error('[FORGOT_PASSWORD]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}