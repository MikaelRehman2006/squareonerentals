'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Bell, ExternalLink, X, Check } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

interface Notification {
  _id: string;
  userId: string;
  message: string;
  type: 'MESSAGE' | 'LISTING_UPDATE' | 'FAVORITE' | 'SYSTEM';
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

  // Get notification icon based on type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'LISTING_UPDATE':
        return <ExternalLink className="h-4 w-4 text-blue-500" />;
      case 'FAVORITE':
        return <Bell className="h-4 w-4 text-rose-500" />;
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
                      <Link
                        href={`/listings/${notification.listingId._id}`}
                        className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 mt-1"
                      >
                        <span>View listing</span>
                        <ExternalLink className="h-3 w-3" />
                      </Link>
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
