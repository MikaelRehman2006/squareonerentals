import { 
  Edit, 
  Star, 
  AlertCircle, 
  Newspaper, 
  Gift, 
  CreditCard, 
  MessagesSquare,
  Bell
} from 'lucide-react';
import React, { ReactNode } from 'react';

export type NotificationType = 
  | 'listing_update' 
  | 'favorite_update' 
  | 'system' 
  | 'newsletter' 
  | 'marketing' 
  | 'payment'
  | 'message';

export interface NotificationTemplate {
  type: NotificationType;
  title: string;
  description: string;
}

// Templates for different notification types
export const notificationTemplates: Record<NotificationType, NotificationTemplate> = {
  listing_update: {
    type: 'listing_update',
    title: 'Your listing has been updated',
    description: 'An administrator has made changes to your listing.'
  },
  favorite_update: {
    type: 'favorite_update',
    title: 'Update to a saved property',
    description: 'A property you saved has been updated.'
  },
  system: {
    type: 'system',
    title: 'System notification',
    description: 'Important information about the Square One Rentals platform.'
  },
  newsletter: {
    type: 'newsletter',
    title: 'Newsletter',
    description: 'Latest news and updates from Square One Rentals.'
  },
  marketing: {
    type: 'marketing',
    title: 'Special offer',
    description: 'Exclusive offer for Square One Rentals users.'
  },
  payment: {
    type: 'payment',
    title: 'Payment notification',
    description: 'Information about your recent payment.'
  },
  message: {
    type: 'message',
    title: 'New message',
    description: 'You have received a new message.'
  }
};

// Return the appropriate icon component based on notification type
export function getNotificationIcon(type: NotificationType | string): ReactNode {
  switch (type) {
    case 'listing_update':
      return React.createElement(Edit, { className: "h-5 w-5 text-indigo-600" });
    case 'favorite_update':
      return React.createElement(Star, { className: "h-5 w-5 text-amber-600" });
    case 'system':
      return React.createElement(AlertCircle, { className: "h-5 w-5 text-red-600" });
    case 'newsletter':
      return React.createElement(Newspaper, { className: "h-5 w-5 text-blue-600" });
    case 'marketing':
      return React.createElement(Gift, { className: "h-5 w-5 text-pink-600" });
    case 'payment':
      return React.createElement(CreditCard, { className: "h-5 w-5 text-green-600" });
    case 'message':
      return React.createElement(MessagesSquare, { className: "h-5 w-5 text-violet-600" });
    default:
      return React.createElement(Bell, { className: "h-5 w-5 text-gray-600" });
  }
}

// Return the appropriate background color class based on notification type
export function getNotificationIconBg(type: NotificationType | string): string {
  switch (type) {
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
    case 'message':
      return 'bg-violet-50';
    default:
      return 'bg-gray-100';
  }
}

// Return a human-readable label for notification types
export function getNotificationTypeLabel(type: NotificationType | string): string {
  switch (type) {
    case 'listing_update':
      return 'Listing Update';
    case 'favorite_update':
      return 'Saved Property Update';
    case 'system':
      return 'System Alert';
    case 'newsletter':
      return 'Newsletter';
    case 'marketing':
      return 'Special Offer';
    case 'payment':
      return 'Payment';
    case 'message':
      return 'Message';
    default:
      return 'Notification';
  }
}

// Get notification types that can be sent manually from admin panel
export function getManualNotificationTypes(): NotificationType[] {
  return ['system', 'newsletter', 'marketing'];
} 