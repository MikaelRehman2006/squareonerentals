import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import { User, IUser } from '@/models/User';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

export async function PATCH(request: Request) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const userId = session.user.id;
    const { name, email, currentPassword, newPassword } = body;

    // Get current user
    const user = await User.findById(userId).lean() as IUser & { _id: mongoose.Types.ObjectId };

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Prepare update data
    const updateData: Partial<{
      name: string;
      email: string;
      password: string;
    }> = {};
    
    // Update name if provided
    if (name) {
      updateData.name = name;
    }

    // Update email if provided
    if (email && email !== user.email) {
      // Check if email is already taken
      const existingUser = await User.findOne({ email }).lean() as IUser | null;
      if (existingUser) {
        return NextResponse.json(
          { error: 'Email already taken' },
          { status: 400 }
        );
      }
      updateData.email = email;
    }

    // Update password if provided
    if (currentPassword && newPassword && user.password) {
      // Verify current password
      const isValid = await bcrypt.compare(currentPassword, user.password);
      if (!isValid) {
        return NextResponse.json(
          { error: 'Current password is incorrect' },
          { status: 400 }
        );
      }

      // Hash new password
      updateData.password = await bcrypt.hash(newPassword, 12);
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true }
    ).lean() as IUser & { _id: mongoose.Types.ObjectId };

    if (!updatedUser) {
      return NextResponse.json(
        { error: 'Failed to update user' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      user: {
        id: updatedUser._id.toString(),
        name: updatedUser.name,
        email: updatedUser.email,
        image: updatedUser.image,
      }
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}