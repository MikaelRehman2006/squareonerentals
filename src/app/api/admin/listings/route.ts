import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import { Listing } from '@/models/Listing'
import { User } from '@/models/User'

// Helper function to check if user is admin
async function isAdmin(email: string) {
  if (!email) return false;
  
  // Check if user has ADMIN role in database
  await connectDB();
  const user = await User.findOne({ email });
  if (user?.role === 'ADMIN') return true;
  
  // Fallback to hardcoded admin emails
  const adminEmails = ['volcanxic@gmail.com', 'mikaelr112@gmail.com'];
  return adminEmails.includes(email.toLowerCase());
}

// GET all listings for admin
export async function GET(request: NextRequest) {
  try {
    // Get user session to verify admin status
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      console.log('Admin listings API: No session found');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Verify user is an admin
    if (!(await isAdmin(session.user.email))) {
      console.log(`Admin listings API: User ${session.user.email} is not admin`);
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const userId = searchParams.get('userId')
    const limit = parseInt(searchParams.get('limit') || '20', 10)
    const skip = parseInt(searchParams.get('skip') || '0', 10)
    
    await connectDB()
    
    const filter: any = {}
    if (status) filter.status = status
    if (userId) filter.userId = userId
    
    const listings = await Listing.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('userId', 'name email')
      .lean()
    
    const total = await Listing.countDocuments(filter)
    
    return NextResponse.json({
      listings,
      total,
      limit,
      skip
    })
  } catch (error) {
    console.error('Error in admin listings API:', error)
    return NextResponse.json(
      { error: 'Failed to fetch listings' },
      { status: 500 }
    )
  }
}