import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/mongodb';
import { Collection, ObjectId } from 'mongodb';
import { z } from 'zod';

const resetPasswordSchema = z.object({
  token: z.string(),
  password: z.string().min(8),
});

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

interface User {
  _id: ObjectId;
  id: string;
  email: string;
  password: string;
}

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const body = resetPasswordSchema.parse(json);

    const mongoose = await connectDB();
    const db = mongoose.connection.db;
    const passwordResetsCollection: Collection<PasswordReset> = db.collection('password_resets');
    const usersCollection: Collection<User> = db.collection('users');

    // Find valid reset token
    const resetToken = await passwordResetsCollection.findOne({
      token: body.token,
      used: false,
      expiresAt: { $gt: new Date() }
    });

    if (!resetToken) {
      return new NextResponse('Invalid or expired token', { status: 400 });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(body.password, 12);

    // Update user password
    await usersCollection.updateOne(
      { id: resetToken.userId },
      { $set: { password: hashedPassword } }
    );

    // Mark token as used
    await passwordResetsCollection.updateOne(
      { _id: resetToken._id },
      { $set: { used: true, updatedAt: new Date() } }
    );

    return NextResponse.json({
      success: true,
      message: 'Password reset successfully'
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse('Invalid request data', { status: 400 });
    }

    console.error('[RESET_PASSWORD]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}