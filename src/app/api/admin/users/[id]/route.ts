import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { logActivity } from '@/lib/activity';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'admin') {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const { role } = await request.json();

    if (!role || !['user', 'admin'].includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role' },
        { status: 400 }
      );
    }

    const user = await prisma.user.update({
      where: { id: params.id },
      data: { role }
    });

    // Log the activity
    await logActivity({
      action: 'UPDATE_USER_ROLE',
      userId: session.user.id,
      targetId: params.id,
      details: `Updated user role to ${role}`,
      timestamp: new Date(),
      metadata: { newRole: role }
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error updating user role:', error);
    return NextResponse.json(
      { error: 'Failed to update user role' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'admin') {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    await prisma.user.delete({
      where: { id: params.id }
    });

    // Log the activity
    await logActivity({
      action: 'DELETE_USER',
      userId: session.user.id,
      targetId: params.id,
      details: 'Deleted user',
      timestamp: new Date(),
      metadata: { deletedUserId: params.id }
    });

    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    );
  }
}
