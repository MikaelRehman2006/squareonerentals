import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

// GET all listings for admin
export async function GET(request: NextRequest) {
  try {
    // Get user session to verify admin status
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      console.log('Admin listings API: No session found');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Verify user is an admin
    const userEmail = session.user.email as string
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
      select: { role: true }
    })

    console.log(`Admin listings API: User role check - Email: ${userEmail}, Role: ${user?.role}`);

    if (user?.role !== 'ADMIN') {
      console.log('Admin listings API: User is not an admin');
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 403 }
      )
    }

    // Log for debugging
    console.log('Fetching listings for admin user:', userEmail);

    // Get all listings with basic user information
    const listings = await prisma.listing.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    console.log(`Found ${listings.length} listings`);
    
    return NextResponse.json(listings)
  } catch (error) {
    console.error('Error fetching admin listings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch listings' },
      { status: 500 }
    )
  }
} 