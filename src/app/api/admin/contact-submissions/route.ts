import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import { Contact } from '@/models/Contact';

export async function GET() {
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

    await connectDB();

    // Fetch all contact submissions, sorted by newest first
    const submissions = await Contact.find()
      .sort({ createdAt: -1 })
      .lean();

    // Transform the data to ensure it's serializable
    const transformedSubmissions = submissions.map(submission => ({
      _id: submission._id.toString(),
      name: submission.name,
      email: submission.email,
      phone: submission.phone,
      subject: submission.subject,
      message: submission.message,
      status: submission.status,
      ipAddress: submission.ipAddress,
      userAgent: submission.userAgent,
      createdAt: submission.createdAt.toISOString(),
      updatedAt: submission.updatedAt.toISOString(),
      readAt: submission.readAt ? submission.readAt.toISOString() : undefined,
      repliedAt: submission.repliedAt ? submission.repliedAt.toISOString() : undefined,
      adminNotes: submission.adminNotes
    }));

    return NextResponse.json({
      submissions: transformedSubmissions
    });
  } catch (error) {
    console.error('Error fetching contact submissions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contact submissions' },
      { status: 500 }
    );
  }
}
