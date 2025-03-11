import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

// GET all reports for admin
export async function GET(request: NextRequest) {
  try {
    // Get user session to verify admin status
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      console.log('Admin reports API: No session found');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Verify user is an admin
    const userEmail = session.user.email as string;
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
      select: { role: true }
    });

    console.log(`Admin reports API: User role check - Email: ${userEmail}, Role: ${user?.role}`);

    if (user?.role !== 'ADMIN') {
      console.log('Admin reports API: User is not an admin');
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 403 }
      );
    }

    // Log for debugging
    console.log('Fetching reports for admin...');

    // Get all reports with related user and listing data
    const reports = await prisma.report.findMany({
      include: {
        reporter: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        Listing: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log(`Found ${reports.length} reports`);
    
    return NextResponse.json(reports);
  } catch (error) {
    console.error('Error fetching admin reports:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reports' },
      { status: 500 }
    );
  }
} 