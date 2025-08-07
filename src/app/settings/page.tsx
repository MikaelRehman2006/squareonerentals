'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, Mail, Star, AlertTriangle, MessageSquare, ArrowLeft, Home, Heart, Shield, Settings, DollarSign } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { signOut } from 'next-auth/react';

// Define notification types
const NOTIFICATION_TYPES = [
  { id: 'systemAlerts', label: 'System Alerts', description: 'Important notifications about your account and security', icon: Shield },
  { id: 'newsletter', label: 'Newsletter', description: 'Updates about our service and features', icon: Mail },
  { id: 'specialOffers', label: 'Special Offers', description: 'Promotions and special deals', icon: Star },
  { id: 'favoriteUpdates', label: 'Favorite Listing Updates', description: 'When owners update listings you have favorited', icon: Heart },
  { id: 'listingChanges', label: 'Admin Listing Changes', description: 'When administrators make changes to your listings', icon: Home },
  { id: 'paymentNotifications', label: 'Membership & Payment', description: 'Updates about your subscription and payments', icon: DollarSign },
];

export default function SettingsPage() {
  const router = useRouter();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  
  // State for notification settings - now with inApp and email for each type
  const [notificationSettings, setNotificationSettings] = useState<Record<string, { inApp: boolean, email: boolean }>>({});
  
  // Load settings from API on component mount
  useEffect(() => {
    async function loadSettings() {
      try {
        const response = await fetch('/api/user/preferences');
        if (response.ok) {
          const preferences = await response.json();
          setNotificationSettings(preferences);
        } else {
          // Default all settings to true if API fails
          const defaultSettings: Record<string, { inApp: boolean, email: boolean }> = {};
          NOTIFICATION_TYPES.forEach(type => {
            defaultSettings[type.id] = { inApp: true, email: true };
          });
          setNotificationSettings(defaultSettings);
        }
      } catch (error) {
        console.error('Error loading notification settings:', error);
        // Set defaults on error
        const fallbackSettings: Record<string, { inApp: boolean, email: boolean }> = {};
        NOTIFICATION_TYPES.forEach(type => {
          fallbackSettings[type.id] = { inApp: true, email: true };
        });
        setNotificationSettings(fallbackSettings);
      }
    }

    loadSettings();
  }, []);

  // Update setting and save to backend
  const updateSetting = async (key: string, channel: 'inApp' | 'email', value: boolean) => {
    const newSettings = { 
      ...notificationSettings, 
      [key]: {
        ...notificationSettings[key],
        [channel]: value
      }
    };
    setNotificationSettings(newSettings);
    
    // Save to backend
    try {
      const response = await fetch('/api/user/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationSettings: newSettings }),
      });
      
      if (response.ok) {
        toast.success('Settings saved');
      } else {
        toast.error('Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
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
                <p className="text-sm text-gray-600">Manage how you receive notifications</p>
              </div>
            </div>
          </div>

          <div className="px-6 py-2">
            {/* Column headers */}
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <div className="text-sm font-medium text-gray-900">Notification Type</div>
              <div className="flex items-center space-x-16">
                <div className="text-sm font-medium text-gray-900 flex items-center">
                  <Bell size={16} className="mr-1.5" />
                  <span>In-App</span>
                </div>
                <div className="text-sm font-medium text-gray-900 flex items-center">
                  <Mail size={16} className="mr-1.5" />
                  <span>Email</span>
                </div>
              </div>
            </div>

            {/* Notification Settings List */}
            {NOTIFICATION_TYPES.map((type) => (
              <div key={type.id} className="flex justify-between items-center py-4 border-b border-gray-100 last:border-b-0">
                <div className="flex items-start">
                  <type.icon className="h-5 w-5 text-gray-500 mt-0.5 mr-3" />
                  <div>
                    <h3 className="font-medium text-gray-900">{type.label}</h3>
                    <p className="text-sm text-gray-500 mt-1">{type.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-16">
                  <Switch
                    checked={notificationSettings[type.id]?.inApp ?? true}
                    onCheckedChange={(checked) => updateSetting(type.id, 'inApp', checked)}
                  />
                  <Switch
                    checked={notificationSettings[type.id]?.email ?? true}
                    onCheckedChange={(checked) => updateSetting(type.id, 'email', checked)}
                  />
                </div>
              </div>
            ))}
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