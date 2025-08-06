'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { Bell, Users, Send, RefreshCw, Filter, Search, ChevronDown, Trash2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

// Add dynamic export to prevent prerendering issues
export const dynamic = 'force-dynamic';

// UI Components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

// Utils & Types
import { 
  getNotificationIcon, 
  getNotificationIconBg, 
  getNotificationTypeLabel, 
  getManualNotificationTypes,
  NotificationType,
  notificationTemplates
} from '@/lib/notifications';

// Interface for notification message form
interface NotificationForm {
  type: NotificationType;
  title: string;
  message: string;
  sendToAll: boolean;
  specificUserIds?: string[];
  scheduledFor?: Date | null;
}

// Sample user data for demonstration
const sampleUsers = [
  { id: '1', name: 'John Smith', email: 'john@example.com', role: 'user' },
  { id: '2', name: 'Jane Doe', email: 'jane@example.com', role: 'user' },
  { id: '3', name: 'Robert Johnson', email: 'robert@example.com', role: 'admin' },
  { id: '4', name: 'Emily White', email: 'emily@example.com', role: 'user' },
  { id: '5', name: 'Michael Brown', email: 'michael@example.com', role: 'user' },
];

// Sample notification history data for demonstration
const sampleNotificationHistory = [
  { 
    id: '1', 
    type: 'system', 
    title: 'System Maintenance', 
    message: 'The system will be down for maintenance on Saturday from 2-4 AM EST.', 
    sentBy: 'admin', 
    sentAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), 
    sentToCount: 152 
  },
  { 
    id: '2', 
    type: 'newsletter', 
    title: 'March Newsletter', 
    message: 'Check out our latest listings and neighborhood spotlights in our March newsletter.', 
    sentBy: 'admin', 
    sentAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), 
    sentToCount: 328 
  },
  { 
    id: '3', 
    type: 'marketing', 
    title: 'Limited Time Offer', 
    message: 'Upgrade to a premium listing for 20% off until the end of the month.', 
    sentBy: 'admin', 
    sentAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), 
    sentToCount: 214 
  },
];

export default function AdminNotificationsPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState('compose');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [showUserSelector, setShowUserSelector] = useState(false);
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [notificationHistory, setNotificationHistory] = useState(sampleNotificationHistory);
  const [confirmSendDialog, setConfirmSendDialog] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  // Form state
  const [form, setForm] = useState<NotificationForm>({
    type: 'system',
    title: notificationTemplates.system.title,
    message: notificationTemplates.system.description,
    sendToAll: true,
    specificUserIds: [],
    scheduledFor: null
  });

  // Fetch users from database
  useEffect(() => {
    const fetchUsers = async () => {
      setLoadingUsers(true);
      try {
        const response = await fetch('/api/admin/users');
        if (response.ok) {
          const data = await response.json();
          setUsers(data.users || []);
        } else {
          console.error('Failed to fetch users');
          // Fallback to sample users if API fails
          setUsers(sampleUsers);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
        // Fallback to sample users if API fails
        setUsers(sampleUsers);
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchUsers();
  }, []);

  // Filter users based on search term
  const filteredUsers = users.filter(user => 
    user.name?.toLowerCase().includes(userSearchTerm.toLowerCase()) || 
    user.email?.toLowerCase().includes(userSearchTerm.toLowerCase())
  );

  // Check if user has admin permissions
  useEffect(() => {
    if (session && session.user?.role !== 'ADMIN') {
      toast.error('You do not have permission to access this page');
      router.push('/dashboard');
    }
  }, [session, router]);

  // Handle notification type change
  const handleTypeChange = (type: NotificationType) => {
    const template = notificationTemplates[type];
    setForm({
      ...form,
      type,
      title: template.title,
      message: template.description
    });
  };

  // Handle form input change
  const handleInputChange = (field: keyof NotificationForm, value: any) => {
    setForm({ ...form, [field]: value });
  };

  // Toggle user selection
  const toggleUserSelection = (userId: string) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  // Handle select all users
  const handleSelectAllUsers = (checked: boolean) => {
    if (checked) {
      setSelectedUsers(filteredUsers.map(user => user._id || user.id));
    } else {
      setSelectedUsers([]);
    }
  };

  // Submit notification
  const handleSubmit = async () => {
    setIsLoading(true);
    
    try {
      const requestBody = {
        ...form,
        specificUserIds: form.sendToAll ? [] : selectedUsers
      };
      
      console.log('🚀 Sending notification request:', {
        type: form.type,
        title: form.title,
        sendToAll: form.sendToAll,
        selectedUsersCount: selectedUsers.length,
        selectedUsers: selectedUsers,
        specificUserIds: requestBody.specificUserIds
      });
      
      // Call the API endpoint
      const response = await fetch('/api/admin/notifications/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send notification');
      }
      
      const result = await response.json();
      console.log('✅ API response:', result);
      
      // Add to notification history
      const newNotification = {
        id: Date.now().toString(),
        type: form.type,
        title: form.title,
        message: form.message,
        sentBy: session?.user?.name || 'admin',
        sentAt: new Date(),
        sentToCount: result.recipientCount || (form.sendToAll ? users.length : selectedUsers.length)
      };
      
      setNotificationHistory([newNotification, ...notificationHistory]);
      
      // Reset form
      setForm({
        type: 'system',
        title: notificationTemplates.system.title,
        message: notificationTemplates.system.description,
        sendToAll: true,
        specificUserIds: [],
        scheduledFor: null
      });
      
      setSelectedUsers([]);
      setConfirmSendDialog(false);
      setActiveTab('history');
      
      toast.success(`Notification sent successfully to ${result.recipientCount} users`);
    } catch (error) {
      console.error('Error sending notification:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to send notification');
    } finally {
      setIsLoading(false);
    }
  };

  // Format date for display
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="bg-gradient-to-b from-white via-gray-50 to-gray-100 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center">
          <Link href="/admin" className="mr-4 p-2 rounded-full hover:bg-gray-200 transition-colors">
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Notification Management</h1>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Tabs defaultValue="compose" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="bg-white w-full flex justify-start overflow-x-auto p-1 border border-gray-200 rounded-xl mb-6">
              <TabsTrigger value="compose" className="flex-1 text-gray-900 data-[state=active]:bg-blue-50 data-[state=active]:text-gray-900">
                Compose Notification
              </TabsTrigger>
              <TabsTrigger value="history" className="flex-1 text-gray-900 data-[state=active]:bg-blue-50 data-[state=active]:text-gray-900">
                Notification History
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex-1 text-gray-900 data-[state=active]:bg-blue-50 data-[state=active]:text-gray-900">
                Settings
              </TabsTrigger>
            </TabsList>

            {/* Compose Notification Tab */}
            <TabsContent value="compose" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Notification Form */}
                <div className="md:col-span-2 space-y-6">
                  <Card className="border border-gray-200">
                    <CardHeader>
                      <CardTitle>Compose New Notification</CardTitle>
                      <CardDescription>
                        Create and send notifications to your users
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Notification Type */}
                      <div className="space-y-2">
                        <Label htmlFor="notification-type">Notification Type</Label>
                        <Select 
                          defaultValue={form.type} 
                          onValueChange={(value) => handleTypeChange(value as NotificationType)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select notification type" />
                          </SelectTrigger>
                          <SelectContent>
                            {getManualNotificationTypes().map((type) => (
                              <SelectItem key={type} value={type}>
                                <div className="flex items-center">
                                  <div className={`mr-2 p-1 rounded-full ${getNotificationIconBg(type)}`}>
                                    {getNotificationIcon(type)}
                                  </div>
                                  <span>{getNotificationTypeLabel(type)}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      {/* Notification Title */}
                      <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input 
                          id="title" 
                          value={form.title} 
                          onChange={(e) => handleInputChange('title', e.target.value)} 
                          placeholder="Enter notification title"
                        />
                      </div>
                      
                      {/* Notification Message */}
                      <div className="space-y-2">
                        <Label htmlFor="message">Message</Label>
                        <Textarea 
                          id="message" 
                          value={form.message} 
                          onChange={(e) => handleInputChange('message', e.target.value)} 
                          placeholder="Enter notification message"
                          rows={4}
                        />
                      </div>
                      
                      {/* Recipients */}
                      <div className="space-y-2">
                        <Label>Recipients</Label>
                        <RadioGroup 
                          defaultValue={form.sendToAll ? "all" : "specific"}
                          onValueChange={(value) => handleInputChange('sendToAll', value === 'all')}
                          className="flex flex-col space-y-2 mt-2"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="all" id="all-users" />
                            <Label htmlFor="all-users" className="cursor-pointer">All users</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="specific" id="specific-users" />
                            <Label htmlFor="specific-users" className="cursor-pointer">Specific users</Label>
                          </div>
                        </RadioGroup>
                        
                        {!form.sendToAll && (
                          <div className="mt-4">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => setShowUserSelector(true)}
                              className="flex items-center"
                            >
                              <Users className="h-4 w-4 mr-2" />
                              Select Users ({selectedUsers.length} selected)
                            </Button>
                          </div>
                        )}
                      </div>
                      
                      {/* Schedule */}
                      <div className="flex items-center space-x-2 pt-2">
                        <Switch 
                          id="schedule" 
                          checked={!!form.scheduledFor}
                          onCheckedChange={(checked) => handleInputChange('scheduledFor', checked ? new Date() : null)}
                        />
                        <Label htmlFor="schedule">Schedule for later</Label>
                      </div>
                      
                      {form.scheduledFor && (
                        <div className="pt-2">
                          <Label htmlFor="scheduled-date">Date and Time</Label>
                          <Input 
                            id="scheduled-date" 
                            type="datetime-local" 
                            value={form.scheduledFor.toISOString().slice(0, 16)} 
                            onChange={(e) => handleInputChange('scheduledFor', new Date(e.target.value))} 
                            className="mt-1"
                          />
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="flex justify-end">
                      <Button
                        variant="default"
                        className="bg-blue-600 hover:bg-blue-700"
                        onClick={() => setConfirmSendDialog(true)}
                        disabled={isLoading || !form.title || !form.message || (!form.sendToAll && selectedUsers.length === 0)}
                      >
                        {isLoading ? (
                          <>
                            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="h-4 w-4 mr-2" />
                            Send Notification
                          </>
                        )}
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
                
                {/* Preview Card */}
                <div>
                  <Card className="border border-gray-200 sticky top-6">
                    <CardHeader>
                      <CardTitle>Preview</CardTitle>
                      <CardDescription>
                        How your notification will appear to users
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-white rounded-xl shadow-sm border overflow-hidden mb-4">
                        <div className="p-5 flex">
                          <div className={`flex-shrink-0 rounded-full p-2 mr-4 ${getNotificationIconBg(form.type)}`}>
                            {getNotificationIcon(form.type)}
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <h3 className="font-medium text-gray-900">
                                {form.title}
                                <span className="ml-2 inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
                              </h3>
                              <span className="text-xs text-gray-500">Just now</span>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{form.message}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="text-sm">
                          <span className="font-medium">Recipients:</span> {form.sendToAll ? 'All users' : `${selectedUsers.length} selected users`}
                        </div>
                        
                        {form.scheduledFor && (
                          <div className="text-sm">
                            <span className="font-medium">Scheduled for:</span> {formatDate(form.scheduledFor)}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Notification History Tab */}
            <TabsContent value="history" className="mt-0">
              <Card className="border border-gray-200">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Notification History</CardTitle>
                      <CardDescription>
                        Past notifications sent to users
                      </CardDescription>
                    </div>
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      <Filter className="h-4 w-4" /> Filter
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {notificationHistory.length > 0 ? (
                    <div className="space-y-4">
                      {notificationHistory.map((notification, index) => (
                        <motion.div
                          key={notification.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          className="bg-white rounded-lg border border-gray-200 p-4"
                        >
                          <div className="flex items-start gap-4">
                            <div className={`flex-shrink-0 rounded-full p-2 ${getNotificationIconBg(notification.type as NotificationType)}`}>
                              {getNotificationIcon(notification.type as NotificationType)}
                            </div>
                            
                            <div className="flex-1">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="font-medium text-gray-900">{notification.title}</h3>
                                  <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                                </div>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-500 hover:text-red-700">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                              
                              <div className="flex flex-wrap gap-x-4 mt-3 text-xs text-gray-900">
                                <span>Sent: {formatDate(notification.sentAt)}</span>
                                <span>By: {notification.sentBy}</span>
                                <span>Recipients: {notification.sentToCount} users</span>
                                <span>Type: {getNotificationTypeLabel(notification.type as NotificationType)}</span>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900">No notifications sent yet</h3>
                      <p className="text-gray-500 mt-2 max-w-md mx-auto">
                        When you send notifications to your users, they will appear here.
                      </p>
                      <Button 
                        className="mt-4 bg-blue-600 hover:bg-blue-700"
                        onClick={() => setActiveTab('compose')}
                      >
                        <Send className="h-4 w-4 mr-2" /> Create First Notification
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="mt-0">
              <Card className="border border-gray-200">
                <CardHeader>
                  <CardTitle>Notification Settings</CardTitle>
                  <CardDescription>
                    Configure your notification system settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Default Templates</h3>
                    <p className="text-sm text-gray-500">
                      Customize the default templates for different notification types
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      {getManualNotificationTypes().map((type) => (
                        <Card key={type} className="border border-gray-200">
                          <CardHeader className="pb-2">
                            <div className="flex items-center">
                              <div className={`p-2 rounded-full ${getNotificationIconBg(type)} mr-2`}>
                                {getNotificationIcon(type)}
                              </div>
                              <CardTitle className="text-base">{getNotificationTypeLabel(type)}</CardTitle>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-2">
                            <div>
                              <Label htmlFor={`${type}-title`}>Default Title</Label>
                              <Input 
                                id={`${type}-title`} 
                                defaultValue={notificationTemplates[type].title} 
                                className="mt-1" 
                              />
                            </div>
                            <div>
                              <Label htmlFor={`${type}-description`}>Default Message</Label>
                              <Textarea 
                                id={`${type}-description`} 
                                defaultValue={notificationTemplates[type].description} 
                                className="mt-1" 
                                rows={2} 
                              />
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">System Settings</h3>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="auto-delete" className="text-base font-medium">Auto-delete read notifications</Label>
                          <p className="text-sm text-gray-500">Automatically delete notifications after they've been read</p>
                        </div>
                        <Switch id="auto-delete" />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="email-notifications" className="text-base font-medium">Email notifications</Label>
                          <p className="text-sm text-gray-500">Send an email when a notification is created</p>
                        </div>
                        <Switch id="email-notifications" defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="rate-limit" className="text-base font-medium">Rate limiting</Label>
                          <p className="text-sm text-gray-500">Limit the number of notifications a user can receive per day</p>
                        </div>
                        <Switch id="rate-limit" defaultChecked />
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button className="bg-blue-600 hover:bg-blue-700">Save Settings</Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
      
      {/* User Selector Dialog */}
      <Dialog open={showUserSelector} onOpenChange={setShowUserSelector}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Select Users</DialogTitle>
            <DialogDescription>
              Choose which users will receive this notification
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="flex items-center gap-2 mb-4">
              <Search className="h-4 w-4 text-gray-500" />
              <Input 
                placeholder="Search users by name or email" 
                value={userSearchTerm}
                onChange={(e) => setUserSearchTerm(e.target.value)}
                className="flex-1"
              />
            </div>
            
            <div className="flex items-center mb-2">
              <Checkbox 
                id="select-all" 
                checked={filteredUsers.length > 0 && filteredUsers.every(user => selectedUsers.includes(user._id || user.id))}
                onCheckedChange={handleSelectAllUsers}
              />
              <Label htmlFor="select-all" className="ml-2">Select all</Label>
            </div>
            
            <ScrollArea className="h-72">
              {loadingUsers ? (
                <div className="flex items-center justify-center py-8">
                  <RefreshCw className="h-6 w-6 animate-spin text-gray-500" />
                  <span className="ml-2 text-gray-500">Loading users...</span>
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredUsers.map(user => (
                    <div key={user._id || user.id} className="flex items-center p-2 hover:bg-gray-50 rounded-md">
                      <Checkbox 
                        id={`user-${user._id || user.id}`} 
                        checked={selectedUsers.includes(user._id || user.id)}
                        onCheckedChange={() => toggleUserSelection(user._id || user.id)}
                      />
                      <Label htmlFor={`user-${user._id || user.id}`} className="ml-2 flex-1 cursor-pointer">
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </Label>
                      <div className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {user.role || 'user'}
                      </div>
                    </div>
                  ))}
                  
                  {filteredUsers.length === 0 && !loadingUsers && (
                    <div className="text-center py-8 text-gray-500">
                      {userSearchTerm ? 'No users found matching your search' : 'No users found'}
                    </div>
                  )}
                </div>
              )}
            </ScrollArea>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUserSelector(false)}>Cancel</Button>
            <Button 
              onClick={() => setShowUserSelector(false)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Select {selectedUsers.length} Users
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Confirm Send Dialog */}
      <Dialog open={confirmSendDialog} onOpenChange={setConfirmSendDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Send Notification</DialogTitle>
            <DialogDescription>
              You are about to send a notification to {form.sendToAll ? 'all users' : `${selectedUsers.length} selected users`}.
              {form.scheduledFor ? ` It will be sent at ${formatDate(form.scheduledFor)}.` : ' It will be sent immediately.'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="bg-gray-50 p-3 rounded-lg mb-4">
              <p className="font-medium text-sm">{form.title}</p>
              <p className="text-sm text-gray-600 mt-1">{form.message}</p>
            </div>
            
            <p className="text-sm text-gray-500">
              This action cannot be undone. Are you sure you want to proceed?
            </p>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmSendDialog(false)}>Cancel</Button>
            <Button 
              onClick={handleSubmit}
              className="bg-blue-600 hover:bg-blue-700"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Confirm Send
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 