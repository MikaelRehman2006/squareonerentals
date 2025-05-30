'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Mail, Star, AlertTriangle, MessageSquare, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { signOut } from 'next-auth/react';

export default function SettingsPage() {
  const router = useRouter();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [listingUpdates, setListingUpdates] = useState(true);
  const [favoriteListings, setFavoriteListings] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

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
    <div className="bg-gradient-to-b from-white via-gray-50 to-gray-100 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex items-center">
          <Link href="/profile" className="mr-4 p-2 rounded-full hover:bg-gray-200 transition-colors">
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        </div>

        {/* Notifications Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
        >
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-start">
              <Bell className="h-6 w-6 text-blue-600 mt-1 mr-3" />
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Notifications</h2>
                <p className="text-gray-600 mt-1">Manage how you receive notifications and updates</p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Email Notifications */}
            <div className="flex items-center justify-between">
              <div className="flex items-start">
                <Mail className="h-5 w-5 text-gray-500 mt-0.5 mr-3" />
                <div>
                  <h3 className="font-medium text-gray-900">Email Notifications</h3>
                  <p className="text-sm text-gray-500 mt-1">Receive notifications via email</p>
                </div>
              </div>
              <Switch
                checked={emailNotifications}
                onCheckedChange={setEmailNotifications}
              />
            </div>

            {/* Listing Updates */}
            <div className="flex items-center justify-between">
              <div className="flex items-start">
                <MessageSquare className="h-5 w-5 text-gray-500 mt-0.5 mr-3" />
                <div>
                  <h3 className="font-medium text-gray-900">Listing Updates</h3>
                  <p className="text-sm text-gray-500 mt-1">Get notified about changes to your listings</p>
                </div>
              </div>
              <Switch
                checked={listingUpdates}
                onCheckedChange={setListingUpdates}
              />
            </div>

            {/* Favorite Listings */}
            <div className="flex items-center justify-between">
              <div className="flex items-start">
                <Star className="h-5 w-5 text-gray-500 mt-0.5 mr-3" />
                <div>
                  <h3 className="font-medium text-gray-900">Favorite Listings</h3>
                  <p className="text-sm text-gray-500 mt-1">Get updates about your favorite listings</p>
                </div>
              </div>
              <Switch
                checked={favoriteListings}
                onCheckedChange={setFavoriteListings}
              />
            </div>
          </div>
        </motion.div>

        {/* Marketing Preferences */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mb-8 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
        >
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-start">
              <Mail className="h-6 w-6 text-blue-600 mt-1 mr-3" />
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Marketing Preferences</h2>
                <p className="text-gray-600 mt-1">Manage your marketing communication preferences</p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Marketing Emails */}
            <div className="flex items-center justify-between">
              <div className="flex items-start">
                <Mail className="h-5 w-5 text-gray-500 mt-0.5 mr-3" />
                <div>
                  <h3 className="font-medium text-gray-900">Marketing Emails</h3>
                  <p className="text-sm text-gray-500 mt-1">Receive emails about new features and special offers</p>
                </div>
              </div>
              <Switch
                checked={marketingEmails}
                onCheckedChange={setMarketingEmails}
              />
            </div>
          </div>
        </motion.div>

        {/* Danger Zone */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
        >
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-start">
              <AlertTriangle className="h-6 w-6 text-red-500 mt-1 mr-3" />
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Danger Zone</h2>
                <p className="text-gray-600 mt-1">Irreversible account actions</p>
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