'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { connectDB } from '@/lib/mongodb';
import { motion } from 'framer-motion';

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Users,
  Home,
  Flag,
  TrendingUp,
  DollarSign,
  Calendar,
  ArrowUpRight,
  Heart,
  Bell,
  MessageSquare,
  Building,
  Eye,
  Clock,
} from 'lucide-react';
import { GrowthChart } from '@/components/GrowthChart';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Listing {
  id: string;
  title: string;
  price: number;
  location: string;
  createdAt: string;
  status: string;
}

interface MonthlyStatsItem {
  _id: {
    year: number;
    month: number;
    status?: string;
  };
  count: number;
}

interface Analytics {
  currentStats: {
    totalUsers: number;
    totalListings: number;
    activeListings: number;
    totalReports: number;
    averagePrice: number;
    userGrowth: number;
    listingGrowth: number;
    userGrowthPercent: string;
    listingGrowthPercent: string;
  },
  recentActivity?: {
    users: any[];
    listings: any[];
    reports: any[];
  },
  monthlyStats?: {
    users: MonthlyStatsItem[];
    listings: MonthlyStatsItem[];
  }
}

interface Error {
  error: string;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
      return;
    }

    const fetchListings = async () => {
      try {
        const response = await fetch('/api/listings/me', {
          credentials: 'include'
        });
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('No listings found');
          } else if (response.status === 401) {
            router.push('/auth/signin');
            return;
          } else {
            const errorData: Error = await response.json();
            throw new Error(errorData.error || 'Failed to fetch listings');
          }
        }
        const data = await response.json();
        setListings(data);
      } catch (error) {
        if (error instanceof Error) {
          console.error('Error fetching listings:', error);
          setError({ error: error.message });
        } else {
          console.error('Error fetching listings:', error);
          setError({ error: 'Failed to fetch listings' });
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchListings();

    // Only fetch analytics if user is not admin
    if (session?.user?.role !== 'ADMIN') {
      const fetchAnalytics = async () => {
        try {
          const response = await fetch('/api/admin/stats');
          if (response.ok) {
            const data = await response.json();
            setAnalytics(data);
          } else {
            // Silently fail for non-admin users
            console.log('Analytics data unavailable - requires admin access');
          }
        } catch (error) {
          console.error('Error fetching analytics:', error);
        } finally {
          setAnalyticsLoading(false);
        }
      };
      fetchAnalytics();
    } else {
      setAnalyticsLoading(false);
    }
  }, [router, status, session]);

  const handleEditListing = (id: string) => {
    router.push(`/listings/${id}/edit`);
  };

  const handleDeleteListing = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this listing?')) {
      try {
        const response = await fetch(`/api/listings/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Listing not found');
          } else if (response.status === 401) {
            router.push('/auth/signin');
            return;
          } else {
            const errorData: Error = await response.json();
            throw new Error(errorData.error || 'Failed to delete listing');
          }
        }

        setListings(listings.filter(listing => listing.id !== id));
        toast.success('Listing deleted successfully');
      } catch (error) {
        if (error instanceof Error) {
          console.error('Error deleting listing:', error);
          toast.error(error.message);
        } else {
          console.error('Error deleting listing:', error);
          toast.error('Failed to delete listing');
        }
      }
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-8">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              <span className="ml-2">Loading your listings...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-700">Error</CardTitle>
            <CardDescription className="text-red-600">{error.error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => router.push('/')}
              variant="outline"
              className="mt-4"
            >
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-white via-gray-50 to-gray-100 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back, Michael</p>
        </div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <QuickStatCard 
            title="Active Listings" 
            value={analytics?.currentStats.activeListings.toString() || ''} 
            change={analytics?.currentStats.listingGrowthPercent}
            changeText="from last month"
            icon={<Building className="h-5 w-5 text-blue-600" />}
            iconBg="bg-blue-100"
            link="/listings"
          />
          <QuickStatCard 
            title="Saved Properties" 
            value={analytics?.currentStats.totalListings.toString() || ''} 
            change={analytics?.currentStats.listingGrowthPercent}
            changeText="from last month"
            icon={<Heart className="h-5 w-5 text-red-600" />}
            iconBg="bg-red-100"
            link="/favourites"
          />
          <QuickStatCard 
            title="Unread Messages" 
            value={analytics?.currentStats.totalReports.toString() || ''} 
            change=""
            changeText="2 new today"
            icon={<MessageSquare className="h-5 w-5 text-green-600" />}
            iconBg="bg-green-100"
            link="/messages"
          />
          <QuickStatCard 
            title="Profile Views" 
            value={analytics?.currentStats.totalUsers.toString() || ''} 
            change={analytics?.currentStats.userGrowthPercent}
            changeText="from last month"
            icon={<Eye className="h-5 w-5 text-purple-600" />}
            iconBg="bg-purple-100"
            link="/profile"
          />
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="lg:col-span-2 space-y-8"
          >
            {/* Tabs Section */}
            <Card className="border border-gray-200">
              <CardHeader className="pb-2">
                <CardTitle>Activity Overview</CardTitle>
                <CardDescription>Monitor your activity and engagement</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
                  <TabsList className="grid grid-cols-3 mb-4">
                    <TabsTrigger value="overview" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600">Overview</TabsTrigger>
                    <TabsTrigger value="listings" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600">Listings</TabsTrigger>
                    <TabsTrigger value="interactions" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600">Interactions</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="overview" className="mt-0">
                    <div className="space-y-4">
                      <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium text-blue-900">Subscription Status</h3>
                            <p className="text-blue-700 text-sm">Featured Plan</p>
                          </div>
                          <Badge color="blue">Active</Badge>
                        </div>
                        <div className="mt-3">
                          <div className="flex justify-between text-sm text-blue-800 mb-1">
                            <span>Storage Used</span>
                            <span>45%</span>
                          </div>
                          <Progress value={45} className="h-2 bg-blue-200" indicatorClassName="bg-blue-600" />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white rounded-lg p-4 border border-gray-200">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-sm text-gray-500">Total Views</p>
                              <p className="text-2xl font-semibold">1,245</p>
                            </div>
                            <div className="bg-green-100 p-2 rounded-full">
                              <TrendingUp className="h-4 w-4 text-green-600" />
                            </div>
                          </div>
                          <div className="mt-2 text-sm text-green-600">+18% from last month</div>
                        </div>
                        
                        <div className="bg-white rounded-lg p-4 border border-gray-200">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-sm text-gray-500">Contact Rate</p>
                              <p className="text-2xl font-semibold">5.2%</p>
                            </div>
                            <div className="bg-yellow-100 p-2 rounded-full">
                              <MessageSquare className="h-4 w-4 text-yellow-600" />
                            </div>
                          </div>
                          <div className="mt-2 text-sm text-yellow-600">About average</div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="listings" className="mt-0">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">Your Listings Performance</h3>
                        <Link href="/listings" className="text-sm text-blue-600 hover:underline flex items-center">
                          View all listings <ArrowUpRight className="ml-1 h-3 w-3" />
                        </Link>
                      </div>
                      
                      <div className="space-y-3">
                        <ListingPerformanceItem 
                          title="2BR Apartment in Downtown" 
                          views={34} 
                          saves={12} 
                          trend="up" 
                          image="/images/listing1.jpg"
                        />
                        <ListingPerformanceItem 
                          title="Studio near University" 
                          views={27} 
                          saves={8} 
                          trend="up" 
                          image="/images/listing2.jpg"
                        />
                        <ListingPerformanceItem 
                          title="Luxury Penthouse with View" 
                          views={18} 
                          saves={4} 
                          trend="down" 
                          image="/images/listing3.jpg"
                        />
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="interactions" className="mt-0">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">Recent Interactions</h3>
                        <Link href="/messages" className="text-sm text-blue-600 hover:underline flex items-center">
                          View all messages <ArrowUpRight className="ml-1 h-3 w-3" />
                        </Link>
                      </div>
                      
                      <div className="space-y-3">
                        <InteractionItem 
                          name="John Smith" 
                          message="Is the apartment still available?" 
                          time="2 hours ago" 
                          image="/images/avatar1.jpg"
                        />
                        <InteractionItem 
                          name="Sarah Johnson" 
                          message="I'd like to schedule a viewing on Saturday." 
                          time="1 day ago" 
                          image="/images/avatar2.jpg"
                        />
                        <InteractionItem 
                          name="Michael Chen" 
                          message="Can you provide more details about parking?" 
                          time="2 days ago" 
                          image="/images/avatar3.jpg"
                        />
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="border border-gray-200">
              <CardHeader className="pb-2">
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest actions and updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <ActivityItem 
                    title="Listing Updated" 
                    description="You updated photos for 2BR Apartment in Downtown." 
                    time="2 hours ago"
                    icon={<Building className="h-4 w-4" />}
                    iconColor="bg-blue-100 text-blue-600"
                  />
                  <ActivityItem 
                    title="New Message" 
                    description="You received a new message from John Smith." 
                    time="Yesterday"
                    icon={<MessageSquare className="h-4 w-4" />}
                    iconColor="bg-green-100 text-green-600"
                  />
                  <ActivityItem 
                    title="Favorite Added" 
                    description="You saved a new property to your favorites." 
                    time="3 days ago"
                    icon={<Heart className="h-4 w-4" />}
                    iconColor="bg-red-100 text-red-600"
                  />
                  <ActivityItem 
                    title="Profile Updated" 
                    description="You updated your profile information." 
                    time="Last week"
                    icon={<Eye className="h-4 w-4" />}
                    iconColor="bg-purple-100 text-purple-600"
                  />
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <Button variant="ghost" className="w-full text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                  View All Activity
                </Button>
              </CardFooter>
            </Card>
          </motion.div>

          {/* Right Column - Quick Links & Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="space-y-8"
          >
            {/* Profile Card */}
            <Card className="border border-gray-200">
              <CardHeader className="pb-2">
                <CardTitle>Your Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-100 h-16 w-16 rounded-full flex items-center justify-center">
                    <Users className="h-8 w-8 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Michael Johnson</h3>
                    <p className="text-sm text-gray-600">michael@example.com</p>
                    <p className="text-sm text-blue-600">Featured Plan</p>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <Link href="/profile">
                    <Button variant="outline" className="w-full border-blue-200 hover:bg-blue-50 text-blue-600">
                      Edit Profile
                    </Button>
                  </Link>
                  <Link href="/settings">
                    <Button variant="outline" className="w-full border-gray-200 hover:bg-gray-50">
                      Settings
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Quick Links */}
            <Card className="border border-gray-200">
              <CardHeader className="pb-2">
                <CardTitle>Quick Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <QuickLinkItem 
                  title="My Listings" 
                  description="Manage your property listings" 
                  icon={<Home className="h-5 w-5" />}
                  iconColor="bg-blue-100 text-blue-600"
                  href="/listings"
                />
                <QuickLinkItem 
                  title="Saved Properties" 
                  description="View your favorited listings" 
                  icon={<Heart className="h-5 w-5" />}
                  iconColor="bg-red-100 text-red-600"
                  href="/favourites"
                />
                <QuickLinkItem 
                  title="Messages" 
                  description="Check your inbox" 
                  icon={<MessageSquare className="h-5 w-5" />}
                  iconColor="bg-green-100 text-green-600"
                  href="/messages"
                />
                <QuickLinkItem 
                  title="Notifications" 
                  description="View your alerts and updates" 
                  icon={<Bell className="h-5 w-5" />}
                  iconColor="bg-purple-100 text-purple-600"
                  href="/notifications"
                />
                <QuickLinkItem 
                  title="Membership" 
                  description="Manage your subscription" 
                  icon={<DollarSign className="h-5 w-5" />}
                  iconColor="bg-yellow-100 text-yellow-600"
                  href="/membership"
                />
              </CardContent>
            </Card>

            {/* Help Card */}
            <Card className="border border-gray-200 bg-gradient-to-br from-blue-50 to-indigo-50">
              <CardHeader className="pb-2">
                <CardTitle>Need Help?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700 mb-4">
                  Have questions or need assistance with your account or listings?
                </p>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Contact Support
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// Component for quick stat cards
function QuickStatCard({ title, value, change, changeText, icon, iconBg, link }) {
  return (
    <Link href={link}>
      <Card className="border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200">
        <CardContent className="pt-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">{title}</p>
              <p className="text-2xl font-bold mt-1">{value}</p>
              <div className="flex items-center mt-1">
                {change && (
                  <span className={`text-xs font-medium ${change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                    {change}
                  </span>
                )}
                <span className="text-xs text-gray-500 ml-1">{changeText}</span>
              </div>
            </div>
            <div className={`p-2 rounded-md ${iconBg}`}>
              {icon}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

// Component for listing performance items
function ListingPerformanceItem({ title, views, saves, trend, image }) {
  return (
    <div className="flex items-center space-x-3 p-3 bg-white border border-gray-100 rounded-lg">
      <div className="h-12 w-12 rounded bg-gray-200 overflow-hidden flex-shrink-0">
        {/* Image would go here */}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm truncate">{title}</p>
        <div className="flex items-center space-x-3 mt-1">
          <span className="text-xs text-gray-500 flex items-center">
            <Eye className="h-3 w-3 mr-1" /> {views} views
          </span>
          <span className="text-xs text-gray-500 flex items-center">
            <Heart className="h-3 w-3 mr-1" /> {saves} saves
          </span>
        </div>
      </div>
      <div className={`p-1 rounded-full ${trend === 'up' ? 'bg-green-100' : 'bg-red-100'}`}>
        {trend === 'up' ? (
          <TrendingUp className="h-4 w-4 text-green-600" />
        ) : (
          <TrendingUp className="h-4 w-4 text-red-600 transform rotate-180" />
        )}
      </div>
    </div>
  );
}

// Component for interaction items
function InteractionItem({ name, message, time, image }) {
  return (
    <div className="flex items-start space-x-3 p-3 bg-white border border-gray-100 rounded-lg">
      <div className="h-10 w-10 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
        {/* Avatar would go here */}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center">
          <p className="font-medium text-sm">{name}</p>
          <span className="text-xs text-gray-500">{time}</span>
        </div>
        <p className="text-sm text-gray-600 truncate mt-1">{message}</p>
      </div>
    </div>
  );
}

// Component for activity items
function ActivityItem({ title, description, time, icon, iconColor }) {
  return (
    <div className="flex space-x-3">
      <div className={`mt-0.5 rounded-full p-1.5 ${iconColor}`}>
        {icon}
      </div>
      <div className="flex-1">
        <div className="flex justify-between">
          <p className="font-medium text-sm">{title}</p>
          <span className="text-xs text-gray-500">{time}</span>
        </div>
        <p className="text-sm text-gray-600 mt-0.5">{description}</p>
      </div>
    </div>
  );
}

// Component for quick link items
function QuickLinkItem({ title, description, icon, iconColor, href }) {
  return (
    <Link href={href} className="block">
      <div className="flex items-center space-x-3 p-3 bg-white hover:bg-gray-50 border border-gray-100 rounded-lg transition-colors">
        <div className={`p-2 rounded-md ${iconColor}`}>
          {icon}
        </div>
        <div>
          <p className="font-medium text-sm">{title}</p>
          <p className="text-xs text-gray-600">{description}</p>
        </div>
      </div>
    </Link>
  );
}

// Badge component for status indicators
function Badge({ children, color }) {
  const colorClasses = {
    blue: "bg-blue-100 text-blue-800",
    green: "bg-green-100 text-green-800",
    red: "bg-red-100 text-red-800",
    yellow: "bg-yellow-100 text-yellow-800",
    purple: "bg-purple-100 text-purple-800",
    gray: "bg-gray-100 text-gray-800",
  };

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${colorClasses[color] || colorClasses.gray}`}>
      {children}
    </span>
  );
}