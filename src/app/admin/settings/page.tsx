'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      // Save settings logic here
      toast.success('Settings saved successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 p-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Settings</h2>
        <p className="text-muted-foreground">
          Configure platform settings and preferences.
        </p>
      </div>

      <div className="grid gap-6">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
            <CardDescription>
              Basic platform configuration options.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="platform-name">Platform Name</Label>
              <Input
                id="platform-name"
                defaultValue="Square One Rentals"
                placeholder="Enter platform name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Select defaultValue="America/Chicago">
                <SelectTrigger className="bg-gray-800 text-white border border-gray-700">
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 text-white border border-gray-700 shadow-lg">
                  <SelectItem value="America/Chicago">Central Time (US & Canada)</SelectItem>
                  <SelectItem value="America/New_York">Eastern Time (US & Canada)</SelectItem>
                  <SelectItem value="America/Los_Angeles">Pacific Time (US & Canada)</SelectItem>
                  <SelectItem value="UTC">UTC</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="currency">Default Currency</Label>
              <Select defaultValue="USD">
                <SelectTrigger className="bg-gray-800 text-white border border-gray-700">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 text-white border border-gray-700 shadow-lg">
                  <SelectItem value="USD">USD ($)</SelectItem>
                  <SelectItem value="CAD">CAD (C$)</SelectItem>
                  <SelectItem value="EUR">EUR (€)</SelectItem>
                  <SelectItem value="GBP">GBP (£)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="maintenance-mode" />
              <Label htmlFor="maintenance-mode">Maintenance Mode</Label>
            </div>
          </CardContent>
        </Card>

        {/* User Moderation Defaults */}
        <Card>
          <CardHeader>
            <CardTitle>User Moderation Defaults</CardTitle>
            <CardDescription>
              Configure default settings for user moderation.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="ban-duration">Default Ban Duration</Label>
              <Select defaultValue="24h">
                <SelectTrigger className="bg-gray-800 text-white border border-gray-700">
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 text-white border border-gray-700 shadow-lg">
                  <SelectItem value="24h">24 Hours</SelectItem>
                  <SelectItem value="7d">7 Days</SelectItem>
                  <SelectItem value="30d">30 Days</SelectItem>
                  <SelectItem value="permanent">Permanent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Restriction Rules</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Switch id="block-posting" defaultChecked />
                  <Label htmlFor="block-posting">Block Posting</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="hide-profile" defaultChecked />
                  <Label htmlFor="hide-profile">Hide Profile</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="block-messaging" defaultChecked />
                  <Label htmlFor="block-messaging">Block Messaging</Label>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Listing Defaults */}
        <Card>
          <CardHeader>
            <CardTitle>Listing Defaults</CardTitle>
            <CardDescription>
              Configure default settings for property listings.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="listing-expiration">Listing Expiration Time</Label>
              <Select defaultValue="30">
                <SelectTrigger className="bg-gray-800 text-white border border-gray-700">
                  <SelectValue placeholder="Select expiration time" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 text-white border border-gray-700 shadow-lg">
                  <SelectItem value="7">7 Days</SelectItem>
                  <SelectItem value="14">14 Days</SelectItem>
                  <SelectItem value="30">30 Days</SelectItem>
                  <SelectItem value="60">60 Days</SelectItem>
                  <SelectItem value="90">90 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="max-listings">Maximum Listings per User</Label>
              <Input
                id="max-listings"
                type="number"
                defaultValue="10"
                min="1"
                max="100"
              />
            </div>

            <div className="space-y-2">
              <Label>Auto-Flag Rules</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Switch id="flag-price" defaultChecked />
                  <Label htmlFor="flag-price">Flag Unusual Prices</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="flag-duplicate" defaultChecked />
                  <Label htmlFor="flag-duplicate">Flag Duplicate Listings</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="flag-keywords" defaultChecked />
                  <Label htmlFor="flag-keywords">Flag Suspicious Keywords</Label>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Email & Notification Templates */}
        <Card>
          <CardHeader>
            <CardTitle>Email & Notification Templates</CardTitle>
            <CardDescription>
              Configure system message templates and notification settings.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="ban-template">Ban Notice Template</Label>
              <Textarea
                id="ban-template"
                defaultValue="Your account has been temporarily suspended for violating our community guidelines. This suspension will last for {duration}. If you believe this was done in error, please contact support."
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="approval-template">Listing Approval Template</Label>
              <Textarea
                id="approval-template"
                defaultValue="Your listing '{title}' has been approved and is now visible on our platform. Thank you for choosing Square One Rentals!"
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label>Email Notifications</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Switch id="notify-reports" defaultChecked />
                  <Label htmlFor="notify-reports">New Reports</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="notify-listings" defaultChecked />
                  <Label htmlFor="notify-listings">New Listings</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="notify-users" defaultChecked />
                  <Label htmlFor="notify-users">New User Registrations</Label>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Security Settings</CardTitle>
            <CardDescription>
              Configure security and authentication settings.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center space-x-2">
              <Switch id="require-2fa" defaultChecked />
              <Label htmlFor="require-2fa">Require 2FA for Admin Access</Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="session-timeout">Session Timeout</Label>
              <Select defaultValue="60">
                <SelectTrigger className="bg-gray-800 text-white border border-gray-700">
                  <SelectValue placeholder="Select timeout" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 text-white border border-gray-700 shadow-lg">
                  <SelectItem value="30">30 Minutes</SelectItem>
                  <SelectItem value="60">1 Hour</SelectItem>
                  <SelectItem value="120">2 Hours</SelectItem>
                  <SelectItem value="240">4 Hours</SelectItem>
                  <SelectItem value="480">8 Hours</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password-expiry">Admin Password Expiry</Label>
              <Select defaultValue="90">
                <SelectTrigger className="bg-gray-800 text-white border border-gray-700">
                  <SelectValue placeholder="Select expiry time" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 text-white border border-gray-700 shadow-lg">
                  <SelectItem value="30">30 Days</SelectItem>
                  <SelectItem value="60">60 Days</SelectItem>
                  <SelectItem value="90">90 Days</SelectItem>
                  <SelectItem value="180">180 Days</SelectItem>
                  <SelectItem value="365">1 Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={loading}>
            {loading ? 'Saving Changes...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </div>
  );
}