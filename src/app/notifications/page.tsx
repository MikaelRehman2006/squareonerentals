'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, ArrowLeft, CheckCircle, Trash2, Filter, MailOpen, Clock, User } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

// Sample notification data
const sampleNotifications = [
  {
    id: '1',
    title: 'New message from landlord',
    description: 'John Smith has sent you a message about your inquiry.',
    time: '2 hours ago',
    read: false,
    type: 'listing'
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

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(sampleNotifications);
  const [activeTab, setActiveTab] = useState('all');
  
  const unreadCount = notifications.filter(n => !n.read).length;
  const readCount = notifications.filter(n => n.read).length;
  
  const filteredNotifications = notifications.filter(notification => {
    if (activeTab === 'all') return true;
    if (activeTab === 'unread') return !notification.read;
    if (activeTab === 'read') return notification.read;
    return true;
  });

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
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
              disabled={unreadCount === 0}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Mark all read
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              className="text-red-600 border-red-200 hover:bg-red-50"
              onClick={clearAll}
              disabled={notifications.length === 0}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear all
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
              <TabsTrigger value="all" className="flex-1 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600">
                All
                {notifications.length > 0 && <span className="ml-2 px-2 py-0.5 text-xs bg-gray-100 rounded-full">{notifications.length}</span>}
              </TabsTrigger>
              <TabsTrigger value="unread" className="flex-1 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600">
                Unread
                {unreadCount > 0 && <span className="ml-2 px-2 py-0.5 text-xs bg-blue-100 rounded-full">{unreadCount}</span>}
              </TabsTrigger>
              <TabsTrigger value="read" className="flex-1 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600">
                Read
                {readCount > 0 && <span className="ml-2 px-2 py-0.5 text-xs bg-gray-100 rounded-full">{readCount}</span>}
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </motion.div>

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification, index) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className={`bg-white rounded-xl shadow-sm border overflow-hidden ${!notification.read ? 'border-blue-200' : 'border-gray-200'}`}
              >
                <div className="p-5 flex">
                  <div className={`flex-shrink-0 rounded-full p-2 mr-4 ${getNotificationIconBg(notification.type)}`}>
                    {getNotificationIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <h3 className={`font-medium ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                        {notification.title}
                        {!notification.read && <span className="ml-2 inline-block w-2 h-2 bg-blue-500 rounded-full"></span>}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">{notification.time}</span>
                        
                        {!notification.read && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-8 text-blue-600 border-blue-200 hover:bg-blue-50"
                            onClick={() => markAsRead(notification.id)}
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
                              <DropdownMenuItem onClick={() => markAsRead(notification.id)}>
                                <MailOpen className="mr-2 h-4 w-4" />
                                <span>Mark as read</span>
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem onClick={() => {
                              setNotifications(notifications.filter(n => n.id !== notification.id));
                            }}>
                              <Trash2 className="mr-2 h-4 w-4" />
                              <span>Remove</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{notification.description}</p>
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
    case 'listing':
      return <CheckCircle className="h-5 w-5 text-green-600" />;
    case 'system':
      return <Bell className="h-5 w-5 text-purple-600" />;
    default:
      return <Bell className="h-5 w-5 text-gray-600" />;
  }
}

function getNotificationIconBg(type: string) {
  switch (type) {
    case 'message':
      return 'bg-blue-50';
    case 'listing':
      return 'bg-green-50';
    case 'system':
      return 'bg-purple-50';
    default:
      return 'bg-gray-100';
  }
}