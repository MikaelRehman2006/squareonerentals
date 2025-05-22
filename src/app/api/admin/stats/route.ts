import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import { Listing } from '@/models/Listing';
import { User } from '@/models/User';
import { Report } from '@/models/Report';
import { getAdminRole } from '@/lib/admin';

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
    const adminRole = getAdminRole(session.user.email);
    if (!adminRole) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 403 }
      );
    }

    await connectDB();

    // Get current date and date 30 days ago
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Get current stats
    const [
      totalUsers,
      totalListings,
      activeListings,
      totalReports,
      recentUsers,
      recentListings,
      flaggedReports,
      prices,
      allListings // Added all listings for the advanced analytics
    ] = await Promise.all([
      User.countDocuments(),
      Listing.countDocuments(),
      Listing.countDocuments({ status: 'ACTIVE' }),
      Report.countDocuments(),
      User.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select('name email createdAt')
        .lean(),
      Listing.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('userId', 'name email')
        .lean(),
      Report.find({ status: 'PENDING' })
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('listingId', 'title')
        .populate('reportedBy', 'name email')
        .lean(),
      Listing.find({ status: 'ACTIVE' })
        .select('price')
        .lean(),
      Listing.find()
        .select('title price location status createdAt')
        .lean()
    ]);

    // Get stats from 30 days ago
    const [
      usersLastMonth,
      listingsLastMonth
    ] = await Promise.all([
      User.countDocuments({ createdAt: { $lt: thirtyDaysAgo } }),
      Listing.countDocuments({ createdAt: { $lt: thirtyDaysAgo } })
    ]);

    // Calculate monthly growth
    const userGrowth = totalUsers - usersLastMonth;
    const listingGrowth = totalListings - listingsLastMonth;
    const userGrowthPercent = ((userGrowth / usersLastMonth) * 100).toFixed(1);
    const listingGrowthPercent = ((listingGrowth / listingsLastMonth) * 100).toFixed(1);

    // Calculate average price
    const averagePrice = prices.length > 0
      ? (prices.reduce((sum, item) => sum + item.price, 0) / prices.length).toFixed(2)
      : 0;

    // Get monthly data for graphs
    const sixMonthsAgo = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);
    const monthlyStats = await Promise.all([
      User.aggregate([
        {
          $match: {
            createdAt: { $gte: sixMonthsAgo }
          }
        },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } }
      ]),
      Listing.aggregate([
        {
          $match: {
            createdAt: { $gte: sixMonthsAgo }
          }
        },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' },
              status: '$status'
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } }
      ])
    ]);

    return NextResponse.json({
      currentStats: {
        totalUsers,
        totalListings,
        activeListings,
        totalReports,
        averagePrice,
        userGrowth,
        listingGrowth,
        userGrowthPercent,
        listingGrowthPercent
      },
      recentActivity: {
        users: recentUsers,
        listings: recentListings,
        reports: flaggedReports
      },
      monthlyStats: {
        users: monthlyStats[0],
        listings: monthlyStats[1]
      },
      // Add all listings data for advanced analytics
      listings: allListings
    });
  } catch (error) {
    console.error('Error in admin stats API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch admin stats' },
      { status: 500 }
    );
  }
}