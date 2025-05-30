'use client';

import { useEffect, useState } from 'react';
import { Bell, Check, ExternalLink, AlertCircle, Edit, Star, Newspaper, Gift, CreditCard, MessagesSquare, PartyPopper } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface Notification {
  _id: string;
  userId: string;
  message: string;
  type: 'MESSAGE' | 'LISTING_UPDATE' | 'FAVORITE' | 'SYSTEM' | 'NEWSLETTER' | 'MARKETING' | 'PAYMENT' | 'WELCOME';
  read: boolean;
  listingId?: {
    _id: string;
    title: string;
  };
  relatedUserId?: {
    _id: string;
    name: string;
  };
  createdAt: string;
}

// Create a custom hook for notification data
export function useNotifications() {
  const { data: session } = useSession();
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // Fetch unread count
  const fetchUnreadCount = async () => {
    try {
      setLoading(true);
      
      // Create abort controller with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch('/api/notifications/unread-count', {
        cache: 'no-store',
        signal: controller.signal
      });
      
      // Clear timeout
      clearTimeout(timeoutId);
      
      if (response.ok) {
        const data = await response.json();
        setUnreadCount(data.count || 0);
      } else {
        console.warn('Non-OK response from notifications API:', response.status);
      }
    } catch (error) {
      // Check if it's an abort error
      if (error instanceof Error && error.name === 'AbortError') {
        console.warn('Notification count request timed out');
      } else {
        console.error('Error fetching unread notification count:', error);
      }
      // Don't set unread count to 0 on error, keep the previous value
    } finally {
      setLoading(false);
    }
  };

  // Fetch unread count on mount
  useEffect(() => {
    if (session?.user) {
      fetchUnreadCount();
      
      // Set up polling for new notifications every minute
      const interval = setInterval(fetchUnreadCount, 60000);
      return () => clearInterval(interval);
    } else {
      // Reset count when user is not logged in
      setUnreadCount(0);
    }
  }, [session]);

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      const response = await fetch('/api/notifications/mark-all-read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        setUnreadCount(0);
        toast.success('All notifications marked as read');
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      toast.error('Failed to mark notifications as read');
    }
  };

  return { unreadCount, loading, markAllAsRead };
}

// Render notifications badge on the profile icon
export function renderNotificationBadges() {
  const { unreadCount } = useNotifications();
  
  useEffect(() => {
    try {
      // Render badge on user icon
      const userBadgeContainer = document.getElementById('notification-badge');
      if (userBadgeContainer && unreadCount > 0) {
        userBadgeContainer.innerHTML = `
          <span class="absolute -right-1 -top-1 h-5 w-5 flex items-center justify-center rounded-full bg-red-600 text-xs text-white">
            ${unreadCount > 9 ? '9+' : unreadCount}
          </span>
        `;
      } else if (userBadgeContainer) {
        userBadgeContainer.innerHTML = '';
      }
  
      // Render badge on notifications menu item
      const menuBadgeContainer = document.getElementById('notification-menu-badge');
      if (menuBadgeContainer && unreadCount > 0) {
        menuBadgeContainer.innerHTML = `
          <span class="absolute right-2 h-5 w-5 flex items-center justify-center rounded-full bg-red-600 text-xs text-white">
            ${unreadCount > 9 ? '9+' : unreadCount}
          </span>
        `;
      } else if (menuBadgeContainer) {
        menuBadgeContainer.innerHTML = '';
      }
    } catch (error) {
      console.error('Error rendering notification badges:', error);
      // Don't throw errors from this function - it's used in the app layout
    }
  }, [unreadCount]);
  
  return null;
}

export function NotificationsDropdown() {
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);

  // Fetch notifications when the dropdown is opened
  useEffect(() => {
    if (open && session?.user) {
      fetchNotifications();
    }
  }, [open, session]);

  // Fetch notifications from the API
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/notifications');
      if (response.ok) {
        const data = await response.json();
        setNotifications(data);
        setUnreadCount(data.filter((n: Notification) => !n.read).length);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  // Mark all notifications as read
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

      if (response.ok) {
        setNotifications(
          notifications.map((n) => ({ ...n, read: true }))
        );
        setUnreadCount(0);
        toast.success('All notifications marked as read');
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      toast.error('Failed to mark notifications as read');
    }
  };

  // Mark a notification as read
  const markAsRead = async (notificationId: string) => {
    try {
      const response = await fetch('/api/notifications', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ notificationId }),
      });

      if (response.ok) {
        setNotifications(
          notifications.map((n) =>
            n._id === notificationId ? { ...n, read: true } : n
          )
        );
        setUnreadCount(Math.max(0, unreadCount - 1));
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Get notification icon based on type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'LISTING_UPDATE':
        return <Edit className="h-4 w-4 text-indigo-500" />;
      case 'FAVORITE':
        return <Star className="h-4 w-4 text-amber-500" />;
      case 'SYSTEM':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'MESSAGE':
        return <MessagesSquare className="h-4 w-4 text-violet-500" />;
      case 'NEWSLETTER':
        return <Newspaper className="h-4 w-4 text-blue-500" />;
      case 'MARKETING':
        return <Gift className="h-4 w-4 text-pink-500" />;
      case 'PAYMENT':
        return <CreditCard className="h-4 w-4 text-green-500" />;
      case 'WELCOME':
        return <PartyPopper className="h-4 w-4 text-emerald-500" />;
      default:
        return <Bell className="h-4 w-4 text-muted-foreground" />;
    }
  };

  // Format notification time
  const formatNotificationTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
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
      return 'recently';
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="relative h-8 w-8 rounded-full"
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -right-1 -top-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4">
          <h3 className="font-medium">Notifications</h3>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-blue-600 hover:text-blue-700"
              onClick={markAllAsRead}
            >
              Mark all as read
            </Button>
          )}
        </div>
        <Separator />
        <div className="max-h-80 overflow-y-auto">
          {loading ? (
            <div className="flex justify-center p-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              No notifications to display
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification._id}
                className={`relative p-4 hover:bg-muted/50 ${
                  notification.read ? 'opacity-70' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm">{notification.message}</p>
                    {notification.listingId && (
                      notification.type === 'LISTING_UPDATE' ? (
                        <div className="mt-2">
                          <Link
                            href={`/listings/${typeof notification.listingId === 'string' 
                              ? notification.listingId 
                              : notification.listingId._id}`}
                            className="inline-flex items-center gap-1 px-3 py-1 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                          >
                            <span>Go to Listing</span>
                            <ExternalLink className="h-3 w-3" />
                          </Link>
                        </div>
                      ) : (
                        <Link
                          href={`/listings/${typeof notification.listingId === 'string'
                            ? notification.listingId
                            : notification.listingId._id}`}
                          className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 mt-1"
                        >
                          <span>View listing</span>
                          <ExternalLink className="h-3 w-3" />
                        </Link>
                      )
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatNotificationTime(notification.createdAt)}
                    </p>
                  </div>
                  {!notification.read && (
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-6 w-6"
                      onClick={() => markAsRead(notification._id)}
                    >
                      <Check className="h-4 w-4" />
                      <span className="sr-only">Mark as read</span>
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
        <Separator />
        <div className="p-4 text-center">
          <Link
            href="/dashboard/notifications"
            className="text-xs text-blue-600 hover:underline"
          >
            View all notifications
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  );
}
