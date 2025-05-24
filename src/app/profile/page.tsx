'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import { isAdmin } from '@/lib/authHelpers';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Shield } from 'lucide-react';

const profileSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  currentPassword: z.string().optional(),
  newPassword: z.string().min(6, 'Password must be at least 6 characters').optional(),
  confirmPassword: z.string().optional(),
}).refine((data) => {
  if (data.newPassword && !data.currentPassword) {
    return false;
  }
  return true;
}, {
  message: "Current password is required to set a new password",
  path: ["currentPassword"],
}).refine((data) => {
  if (data.newPassword !== data.confirmPassword) {
    return false;
  }
  return true;
}, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Preload name and email from session
  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || '');
      setEmail(session.user.email || '');
    }
  }, [session]);

  // Password strength validation
  const passwordStrong =
    newPassword.length >= 8 &&
    /[A-Z]/.test(newPassword) &&
    /[a-z]/.test(newPassword) &&
    /[0-9]/.test(newPassword) &&
    /[^A-Za-z0-9]/.test(newPassword);

  // Save handler (pseudo-logic)
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const response = await fetch('/api/user/update', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update name');
      }
      // Update session so name appears everywhere
      await update();
      toast.success('Name updated successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update name');
    } finally {
      setIsSaving(false);
    }
  };

  // If user is Google/social login, show a message instead of password change form
  // provider is not available on session.user, so always show password change for now
  const isGoogleLogin = false;

  if (!session) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="bg-gradient-to-b from-[#f8fafc] to-[#e2e8f0] min-h-screen py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <form onSubmit={handleSave} className="max-w-md w-full mx-auto bg-white rounded-2xl shadow-xl p-10 flex flex-col items-center space-y-6">
        {/* Profile Picture */}
        <div className="flex flex-col items-center">
          <div className="relative h-24 w-24 rounded-full overflow-hidden mb-3">
            <Image src={session.user.image || '/default-avatar.png'} alt="Profile picture" fill className="object-cover" />
          </div>
          <p className="text-xs text-gray-500 mt-1">Profile picture changing coming soon.</p>
        </div>

        {/* Name */}
        <div className="w-full">
          <label className="block text-gray-700 font-medium mb-1">Name</label>
          <Input value={name} onChange={e => setName(e.target.value)} className="w-full" />
        </div>

        {/* Email (read-only) */}
        <div className="w-full">
          <label className="block text-gray-700 font-medium mb-1">Email</label>
          <Input value={email} readOnly className="w-full bg-gray-100 cursor-not-allowed" />
        </div>

        {/* Password Change */}
        <div className="w-full space-y-2">
          <label className="block text-gray-700 font-medium mb-1">Change Password</label>
          {isGoogleLogin ? (
            <div className="text-sm text-gray-500 py-4">Password changes are not available for Google/social logins.</div>
          ) : (
            <>
              <Input
                type="password"
                placeholder="Current Password"
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
                className="w-full"
              />
              <Input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                className="w-full"
              />
              <Input
                type="password"
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                className="w-full"
              />
              {newPassword && !passwordStrong && (
                <p className="text-xs text-red-500 mt-1">Password must be 8+ characters, include a number, symbol, and uppercase letter.</p>
              )}
              {newPassword && confirmPassword && newPassword !== confirmPassword && (
                <p className="text-xs text-red-500 mt-1">Passwords do not match.</p>
              )}
            </>
          )}
        </div>

        <Button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold mt-4"
          disabled={isSaving || (!isGoogleLogin && !!newPassword && (!passwordStrong || newPassword !== confirmPassword))}
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </form>
    </div>
  );
}
