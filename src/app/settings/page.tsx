'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Mail, Star, AlertTriangle, MessageSquare, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';

export default function SettingsPage() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [listingUpdates, setListingUpdates] = useState(true);
  const [favoriteListings, setFavoriteListings] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

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
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-gray-900 font-medium">Email Notifications</h3>
                <p className="text-gray-600 text-sm">Receive notifications via email</p>
              </div>
              <Switch 
                checked={emailNotifications} 
                onCheckedChange={setEmailNotifications} 
                className="data-[state=checked]:bg-blue-600"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-gray-900 font-medium">Listing Updates</h3>
                <p className="text-gray-600 text-sm">Get notified about changes to your listings</p>
              </div>
              <Switch 
                checked={listingUpdates} 
                onCheckedChange={setListingUpdates} 
                className="data-[state=checked]:bg-blue-600"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-gray-900 font-medium">Favorite Listings</h3>
                <p className="text-gray-600 text-sm">Get updates about your favorite listings</p>
              </div>
              <Switch 
                checked={favoriteListings} 
                onCheckedChange={setFavoriteListings} 
                className="data-[state=checked]:bg-blue-600"
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
              <MessageSquare className="h-6 w-6 text-blue-600 mt-1 mr-3" />
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Marketing Preferences</h2>
                <p className="text-gray-600 mt-1">Manage your marketing communication preferences</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-gray-900 font-medium">Marketing Emails</h3>
                <p className="text-gray-600 text-sm">Receive emails about new features and special offers</p>
              </div>
              <Switch 
                checked={marketingEmails} 
                onCheckedChange={setMarketingEmails} 
                className="data-[state=checked]:bg-blue-600"
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
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" className="bg-red-500 hover:bg-red-600">
              Delete Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}