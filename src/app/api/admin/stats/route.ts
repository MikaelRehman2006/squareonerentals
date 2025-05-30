import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import { Listing } from '@/models/Listing';
import { User } from '@/models/User';
import { Report } from '@/models/Report';
import { getAdminRole } from '@/lib/admin';
import { Types } from 'mongoose';

// Helper function to ensure dates are serialized properly
const serializeDate = (date: Date) => date.toISOString();

// Helper to safely get string from ObjectId
const safeIdToString = (id: unknown): string => {
  if (id instanceof Types.ObjectId) {
    return id.toString();
  }
  if (typeof id === 'object' && id !== null && '_id' in id) {
    return safeIdToString((id as any)._id);
  }
  return String(id);
};

// Helper function to safely transform MongoDB documents
const transformMongoDoc = (doc: any) => {
  if (!doc) return doc;
  
  // Convert _id to string
  if (doc._id) {
    doc.id = doc._id.toString();
    delete doc._id;
  }
  
  // Convert dates to ISO strings
  if (doc.createdAt) {
    doc.createdAt = serializeDate(doc.createdAt);
  }
  if (doc.updatedAt) {
    doc.updatedAt = serializeDate(doc.updatedAt);
  }
  
  // Process nested objects and arrays
  Object.keys(doc).forEach(key => {
    if (doc[key] && typeof doc[key] === 'object') {
      if (Array.isArray(doc[key])) {
        doc[key] = doc[key].map((item: any) => 
          typeof item === 'object' ? transformMongoDoc(item) : item
        );
      } else if (doc[key] instanceof Date) {
        doc[key] = serializeDate(doc[key]);
      } else {
        doc[key] = transformMongoDoc(doc[key]);
      }
    }
  });
  
  return doc;
};

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

    // Transform data to ensure it's serializable
    const processedRecentUsers = recentUsers.map((user: any) => ({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      createdAt: serializeDate(user.createdAt)
    }));

    const processedRecentListings = recentListings.map((listing: any) => ({
      id: listing._id.toString(),
      title: listing.title,
      price: listing.price,
      status: listing.status,
      createdAt: serializeDate(listing.createdAt),
      userId: listing.userId?._id?.toString(),
      user: {
        name: listing.userId?.name || 'Unknown',
        email: listing.userId?.email || 'unknown@email.com'
      }
    }));

    const processedFlaggedReports = flaggedReports.map((report: any) => ({
      id: report._id.toString(),
      listingId: {
        id: report.listingId?._id?.toString() || 'unknown',
        title: report.listingId?.title || 'Unknown Listing'
      },
      reportedBy: {
        name: report.reportedBy?.name || 'Unknown User',
        email: report.reportedBy?.email || 'unknown@email.com'
      },
      reason: report.reason || 'No reason provided',
      createdAt: serializeDate(report.createdAt)
    }));

    const processedListings = allListings.map((listing: any) => ({
      id: listing._id.toString(),
      title: listing.title,
      price: listing.price,
      location: listing.location,
      status: listing.status,
      createdAt: serializeDate(listing.createdAt)
    }));

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
        users: processedRecentUsers,
        listings: processedRecentListings,
        reports: processedFlaggedReports
      },
      monthlyStats: {
        users: monthlyStats[0],
        listings: monthlyStats[1]
      },
      // Add all listings data for advanced analytics
      listings: processedListings
    });
  } catch (error) {
    console.error('Error in admin stats API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch admin stats' },
      { status: 500 }
    );
  }
}