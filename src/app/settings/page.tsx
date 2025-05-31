'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, Mail, Star, AlertTriangle, MessageSquare, ArrowLeft, Home, Heart, Shield, Settings } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { signOut } from 'next-auth/react';

// Define notification types
const NOTIFICATION_TYPES = [
  { id: 'emailNotifications', label: 'Email Notifications', description: 'Receive notifications via email', icon: Mail },
  { id: 'listingUpdates', label: 'Listing Updates', description: 'Get notified about changes to your listings', icon: MessageSquare },
  { id: 'favoriteListings', label: 'Favorite Listings', description: 'Get updates about your favorite listings', icon: Star },
  { id: 'newMessages', label: 'New Messages', description: 'Get notified about new messages', icon: MessageSquare },
  { id: 'securityAlerts', label: 'Security Alerts', description: 'Receive alerts about account security', icon: Shield },
  { id: 'newListings', label: 'New Listings', description: 'Get notified about new listings in your area', icon: Home },
];

// Marketing preferences
const MARKETING_TYPES = [
  { id: 'marketingEmails', label: 'Marketing Emails', description: 'Receive emails about new features and special offers', icon: Mail },
];

export default function SettingsPage() {
  const router = useRouter();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Use a more flexible state structure for notification settings
  const [notificationSettings, setNotificationSettings] = useState<Record<string, boolean>>({});
  
  // Load settings from localStorage on component mount
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem('notificationSettings');
      if (savedSettings) {
        setNotificationSettings(JSON.parse(savedSettings));
      } else {
        // Default all settings to true except marketing emails
        const defaultSettings: Record<string, boolean> = {};
        [...NOTIFICATION_TYPES, ...MARKETING_TYPES].forEach(type => {
          defaultSettings[type.id] = type.id === 'marketingEmails' ? false : true;
        });
        setNotificationSettings(defaultSettings);
        localStorage.setItem('notificationSettings', JSON.stringify(defaultSettings));
      }
    } catch (error) {
      console.error('Error loading notification settings:', error);
      // Set defaults on error
      const fallbackSettings: Record<string, boolean> = {};
      [...NOTIFICATION_TYPES, ...MARKETING_TYPES].forEach(type => {
        fallbackSettings[type.id] = type.id === 'marketingEmails' ? false : true;
      });
      setNotificationSettings(fallbackSettings);
    }
  }, []);

  // Update setting and save to localStorage
  const updateSetting = (key: string, value: boolean) => {
    const newSettings = { ...notificationSettings, [key]: value };
    setNotificationSettings(newSettings);
    
    // Save to localStorage
    try {
      localStorage.setItem('notificationSettings', JSON.stringify(newSettings));
      
      // Also save to backend (this would be replaced with your actual API endpoint)
      saveSettingsToBackend(newSettings);
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    }
  };

  // Simulate saving to backend
  const saveSettingsToBackend = async (settings: Record<string, boolean>) => {
    try {
      // This would be your actual API call
      // const response = await fetch('/api/user/settings', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ settings }),
      // });
      
      // For now, just show a success toast occasionally to give feedback
      if (Math.random() > 0.7) {
        toast.success('Settings saved');
      }
    } catch (error) {
      console.error('Error saving settings to backend:', error);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== 'delete') {
      toast.error('Please type "delete" to confirm');
      return;
    }

    try {
      setIsDeleting(true);
      const response = await fetch('/api/user/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ confirmation: deleteConfirmation }),
      });

      if (response.ok) {
        toast.success('Your account has been deleted');
        // Sign out the user
        await signOut({ callbackUrl: '/' });
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to delete account');
      }
    } catch (error) {
      console.error('Error deleting account:', error);
      toast.error('An error occurred while deleting your account');
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  // Generate setting components from configuration
  const renderSettingItem = (item: typeof NOTIFICATION_TYPES[0]) => (
    <div key={item.id} className="flex items-center justify-between py-4 border-b border-gray-100 last:border-b-0">
      <div className="flex items-start">
        <item.icon className="h-5 w-5 text-gray-500 mt-0.5 mr-3" />
        <div>
          <h3 className="font-medium text-gray-900">{item.label}</h3>
          <p className="text-sm text-gray-500 mt-1">{item.description}</p>
        </div>
      </div>
      <Switch
        checked={notificationSettings[item.id] ?? true}
        onCheckedChange={(checked) => updateSetting(item.id, checked)}
      />
    </div>
  );

  return (
    <div className="bg-gradient-to-b from-white via-gray-50 to-gray-100 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6 flex items-center">
          <Link href="/profile" className="mr-4 p-2 rounded-full hover:bg-gray-200 transition-colors">
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        </div>

        {/* Notifications Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-gray-100">
            <div className="flex items-center">
              <Bell className="h-5 w-5 text-blue-600 mr-3" />
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
                <p className="text-sm text-gray-600">Manage how you receive notifications and updates</p>
              </div>
            </div>
          </div>

          <div className="px-6 py-2">
            {NOTIFICATION_TYPES.map(renderSettingItem)}
          </div>
        </motion.div>

        {/* Marketing Preferences */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mb-6 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-gray-100">
            <div className="flex items-center">
              <Mail className="h-5 w-5 text-blue-600 mr-3" />
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Marketing Preferences</h2>
                <p className="text-sm text-gray-600">Manage your marketing communication preferences</p>
              </div>
            </div>
          </div>

          <div className="px-6 py-2">
            {MARKETING_TYPES.map(renderSettingItem)}
          </div>
        </motion.div>

        {/* Danger Zone */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-gray-100">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-red-500 mr-3" />
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Danger Zone</h2>
                <p className="text-sm text-gray-600">Irreversible account actions</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <Button 
              variant="destructive" 
              className="bg-red-500 hover:bg-red-600" 
              onClick={() => setShowDeleteDialog(true)}
            >
              Delete Account
            </Button>
            <p className="mt-2 text-sm text-gray-500">
              Once you delete your account, all of your data will be permanently removed.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Delete Account Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete your account?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your account and remove your data from our servers.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-gray-500">
              Please type "delete" to confirm.
            </p>
            <input 
              type="text"
              className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Type 'delete' to confirm"
              value={deleteConfirmation}
              onChange={(e) => setDeleteConfirmation(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)} disabled={isDeleting}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              className="bg-red-500 hover:bg-red-600"
              onClick={handleDeleteAccount}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete Account'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}