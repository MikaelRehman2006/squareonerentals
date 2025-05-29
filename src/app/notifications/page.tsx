'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, ArrowLeft, CheckCircle, Trash2, Filter, MailOpen, Clock, User, Edit, Star, AlertCircle, Newspaper, Gift, CreditCard } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { NotificationType } from '@/lib/notifications';

// Sample notification data for fallback
const sampleNotifications = [
  {
    id: '1',
    title: 'New message from landlord',
    description: 'John Smith has sent you a message about your inquiry.',
    time: '2 hours ago',
    read: false,
    type: 'message'
  },
  {
    id: '2',
    title: 'Listing price update',
    description: 'A listing you saved has dropped in price.',
    time: '1 day ago',
    read: false,
    type: 'listing'
  },
  {
    id: '3',
    title: 'Your listing has been approved',
    description: 'Your property at 123 Main St is now live.',
    time: '3 days ago',
    read: true,
    type: 'listing'
  },
  {
    id: '4',
    title: 'New feature available',
    description: 'You can now filter listings by parking availability.',
    time: '1 week ago',
    read: true,
    type: 'system'
  }
];

interface Notification {
  _id: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
  listingId?: any;
  relatedUserId?: any;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  
  const unreadCount = notifications.filter(n => !n.read).length;
  const readCount = notifications.filter(n => n.read).length;
  
  const filteredNotifications = notifications.filter(notification => {
    if (activeTab === 'all') return true;
    if (activeTab === 'unread') return !notification.read;
    if (activeTab === 'read') return notification.read;
    return true;
  });

  // Fetch notifications on page load
  useEffect(() => {
    async function fetchNotifications() {
      try {
        setIsLoading(true);
        const response = await fetch('/api/notifications');
        if (!response.ok) {
          throw new Error('Failed to fetch notifications');
        }
        const data = await response.json();
        setNotifications(data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
        toast.error('Failed to load notifications');
        // Fall back to sample data
        setNotifications(sampleNotifications);
      } finally {
        setIsLoading(false);
      }
    }

    fetchNotifications();
  }, []);

  const markAsRead = async (id: string) => {
    try {
      const response = await fetch(`/api/notifications/${id}/mark-read`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to mark notification as read');
      }

      setNotifications(notifications.map(notification => 
        notification._id === id ? { ...notification, read: true } : notification
      ));
      
      toast.success('Notification marked as read');
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast.error('Failed to mark notification as read');
    }
  };

  const markAllAsRead = async () => {
    try {
      const unreadIds = notifications
        .filter(n => !n.read)
        .map(n => n._id);
      
      if (unreadIds.length === 0) return;
      
      const response = await fetch('/api/notifications/mark-all-read', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ notificationIds: unreadIds }),
      });

      if (!response.ok) {
        throw new Error('Failed to mark all notifications as read');
      }

      setNotifications(
        notifications.map((n) => ({ ...n, read: true }))
      );
      
      toast.success('All notifications marked as read');
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      toast.error('Failed to mark notifications as read');
    }
  };

  // Format relative time (e.g., "2 hours ago", "3 days ago")
  const formatRelativeTime = (timeString: string) => {
    try {
      // For sample data that uses strings like "2 hours ago", just return as is
      if (timeString.includes('ago')) {
        return timeString;
      }

      const date = new Date(timeString);
      const now = new Date();
      const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
      
      // Less than a minute
      if (diffInSeconds < 60) {
        return 'just now';
      }
      
      // Less than an hour
      if (diffInSeconds < 3600) {
        const minutes = Math.floor(diffInSeconds / 60);
        return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
      }
      
      // Less than a day
      if (diffInSeconds < 86400) {
        const hours = Math.floor(diffInSeconds / 3600);
        return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
      }
      
      // Less than a week
      if (diffInSeconds < 604800) {
        const days = Math.floor(diffInSeconds / 86400);
        return `${days} ${days === 1 ? 'day' : 'days'} ago`;
      }
      
      // Format date as MM/DD/YYYY
      return date.toLocaleDateString();
    } catch (error) {
      return timeString;
    }
  };

  // Get notification type based on the database type
  const mapNotificationType = (type: string): NotificationType | string => {
    switch (type) {
      case 'MESSAGE':
        return 'message';
      case 'LISTING_UPDATE':
        return 'listing_update';
      case 'SYSTEM':
        return 'system';
      case 'FAVORITE':
        return 'favorite_update';
      case 'NEWSLETTER':
        return 'newsletter';
      case 'MARKETING':
        return 'marketing';
      case 'PAYMENT':
        return 'payment';
      default:
        return 'system';
    }
  };

  return (
    <div className="bg-gradient-to-b from-white via-gray-50 to-gray-100 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/dashboard" className="mr-4 p-2 rounded-full hover:bg-gray-200 transition-colors">
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              className="text-blue-600 border-blue-200 hover:bg-blue-50"
              onClick={markAllAsRead}
              disabled={unreadCount === 0 || isLoading}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Mark all as read
            </Button>
          </div>
        </div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="bg-white w-full flex justify-start overflow-x-auto p-1 border border-gray-200 rounded-xl">
              <TabsTrigger value="all" className="flex-1 text-gray-900 data-[state=active]:bg-blue-50 data-[state=active]:text-gray-900">
                All
                {notifications.length > 0 && <span className="ml-2 px-2 py-0.5 text-xs bg-gray-100 text-gray-900 rounded-full">{notifications.length}</span>}
              </TabsTrigger>
              <TabsTrigger value="unread" className="flex-1 text-gray-900 data-[state=active]:bg-blue-50 data-[state=active]:text-gray-900">
                Unread
                {unreadCount > 0 && <span className="ml-2 px-2 py-0.5 text-xs bg-blue-100 text-gray-900 rounded-full">{unreadCount}</span>}
              </TabsTrigger>
              <TabsTrigger value="read" className="flex-1 text-gray-900 data-[state=active]:bg-blue-50 data-[state=active]:text-gray-900">
                Read
                {readCount > 0 && <span className="ml-2 px-2 py-0.5 text-xs bg-gray-100 text-gray-900 rounded-full">{readCount}</span>}
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </motion.div>

        {/* Notifications List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin h-8 w-8 border-2 border-blue-500 rounded-full border-t-transparent mx-auto mb-4"></div>
              <p className="text-gray-600">Loading notifications...</p>
            </div>
          ) : filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification, index) => (
              <motion.div
                key={notification._id || notification.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className={`bg-white rounded-xl shadow-sm border overflow-hidden ${!notification.read ? 'border-blue-200' : 'border-gray-200'}`}
              >
                <div className="p-5 flex">
                  <div className={`flex-shrink-0 rounded-full p-2 mr-4 ${getNotificationIconBg(mapNotificationType(notification.type))}`}>
                    {getNotificationIcon(mapNotificationType(notification.type))}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <h3 className={`font-medium ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                        {notification.message}
                        {!notification.read && <span className="ml-2 inline-block w-2 h-2 bg-blue-500 rounded-full"></span>}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">{formatRelativeTime(notification.createdAt || notification.time)}</span>
                        
                        {!notification.read && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-8 text-blue-600 border-blue-200 hover:bg-blue-50"
                            onClick={() => markAsRead(notification._id || notification.id)}
                          >
                            <MailOpen className="h-3.5 w-3.5 mr-1" />
                            Mark as read
                          </Button>
                        )}
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <span className="sr-only">Options</span>
                              <Filter className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {!notification.read && (
                              <DropdownMenuItem onClick={() => markAsRead(notification._id || notification.id)}>
                                <MailOpen className="mr-2 h-4 w-4" />
                                <span>Mark as read</span>
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem onClick={() => {
                              setNotifications(notifications.filter(n => (n._id || n.id) !== (notification._id || notification.id)));
                            }}>
                              <Trash2 className="mr-2 h-4 w-4" />
                              <span>Remove</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center"
            >
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Bell className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
              <p className="text-gray-600 max-w-sm mx-auto">
                You don't have any {activeTab !== 'all' ? activeTab : ''} notifications at the moment.
                We'll notify you when something important happens.
              </p>
            </motion.div>
          )}
        </div>

        {/* Email Preferences Link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mt-8 flex items-center justify-center"
        >
          <Link 
            href="/settings" 
            className="text-sm text-blue-600 hover:text-blue-700 hover:underline flex items-center"
          >
            <Bell className="h-4 w-4 mr-2" />
            Manage notification preferences
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

// Helper functions for notification icons
function getNotificationIcon(type: string) {
  switch (type) {
    case 'message':
      return <MailOpen className="h-5 w-5 text-blue-600" />;
    case 'listing_update':
      return <Edit className="h-5 w-5 text-indigo-600" />;
    case 'favorite_update':
      return <Star className="h-5 w-5 text-amber-600" />;
    case 'system':
      return <AlertCircle className="h-5 w-5 text-red-600" />;
    case 'newsletter':
      return <Newspaper className="h-5 w-5 text-blue-600" />;
    case 'marketing':
      return <Gift className="h-5 w-5 text-pink-600" />;
    case 'payment':
      return <CreditCard className="h-5 w-5 text-green-600" />;
    default:
      return <Bell className="h-5 w-5 text-gray-600" />;
  }
}

function getNotificationIconBg(type: string) {
  switch (type) {
    case 'message':
      return 'bg-blue-50';
    case 'listing_update':
      return 'bg-indigo-50';
    case 'favorite_update':
      return 'bg-amber-50';
    case 'system':
      return 'bg-red-50';
    case 'newsletter':
      return 'bg-blue-50';
    case 'marketing':
      return 'bg-pink-50';
    case 'payment':
      return 'bg-green-50';
    default:
      return 'bg-gray-100';
  }
}