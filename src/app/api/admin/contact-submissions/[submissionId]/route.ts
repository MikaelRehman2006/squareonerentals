import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import { Contact } from '@/models/Contact';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { submissionId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user has admin role
    const userRole = session.user.role;
    if (userRole !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const { submissionId } = params;
    const { status, adminNotes } = await request.json();

    if (!status) {
      return NextResponse.json(
        { error: 'Status is required' },
        { status: 400 }
      );
    }

    // Validate status
    const validStatuses = ['NEW', 'READ', 'REPLIED', 'ARCHIVED'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }

    await connectDB();

    // Prepare update data
    const updateData: any = { status };
    
    if (adminNotes !== undefined) {
      updateData.adminNotes = adminNotes;
    }

    // Set timestamps based on status
    if (status === 'READ') {
      updateData.readAt = new Date();
    } else if (status === 'REPLIED') {
      updateData.repliedAt = new Date();
      // If marking as replied, also mark as read if not already
      if (!updateData.readAt) {
        updateData.readAt = new Date();
      }
    }

    // Update the contact submission
    const updatedSubmission = await Contact.findByIdAndUpdate(
      submissionId,
      updateData,
      { new: true }
    );

    if (!updatedSubmission) {
      return NextResponse.json(
        { error: 'Contact submission not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      submission: {
        _id: updatedSubmission._id.toString(),
        name: updatedSubmission.name,
        email: updatedSubmission.email,
        phone: updatedSubmission.phone,
        subject: updatedSubmission.subject,
        message: updatedSubmission.message,
        status: updatedSubmission.status,
        ipAddress: updatedSubmission.ipAddress,
        userAgent: updatedSubmission.userAgent,
        createdAt: updatedSubmission.createdAt.toISOString(),
        updatedAt: updatedSubmission.updatedAt.toISOString(),
        readAt: updatedSubmission.readAt ? updatedSubmission.readAt.toISOString() : undefined,
        repliedAt: updatedSubmission.repliedAt ? updatedSubmission.repliedAt.toISOString() : undefined,
        adminNotes: updatedSubmission.adminNotes
      }
    });
  } catch (error) {
    console.error('Error updating contact submission:', error);
    return NextResponse.json(
      { error: 'Failed to update contact submission' },
      { status: 500 }
    );
  }
}
