import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { Session } from 'next-auth';

interface CustomSession extends Session {
  user: {
    id: string;
    email?: string | null;
    name?: string | null;
    image?: string | null;
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions) as CustomSession | null;

    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const data = await request.json();
    const { name, email, currentPassword, newPassword, image } = data;

    // Get the current user
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      return new NextResponse('User not found', { status: 404 });
    }

    // Prepare update data
    const updateData: any = {};

    // Handle profile picture update
    if (image) {
      updateData.image = image;
    }

    // Handle name update
    if (name) {
      updateData.name = name;
    }

    // Handle email update
    if (email && email !== user.email) {
      // Check if email is already taken
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return new NextResponse('Email already in use', { status: 400 });
      }

      updateData.email = email;
    }

    // Handle password update
    if (newPassword && currentPassword) {
      // Verify current password
      if (!user.hashedPassword) {
        return new NextResponse('Cannot update password for social login', { status: 400 });
      }

      const isValidPassword = await bcrypt.compare(currentPassword, user.hashedPassword);
      if (!isValidPassword) {
        return new NextResponse('Current password is incorrect', { status: 400 });
      }

      // Hash new password
      updateData.hashedPassword = await bcrypt.hash(newPassword, 12);
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: updateData,
    });

    return NextResponse.json({
      name: updatedUser.name,
      email: updatedUser.email,
      image: updatedUser.image,
    });
  } catch (error) {
    console.error('Update user error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 