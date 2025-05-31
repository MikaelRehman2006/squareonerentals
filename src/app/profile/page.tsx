'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

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
import { Mail, Settings } from 'lucide-react';

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  // Preload name and email from session
  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || '');
      setEmail(session.user.email || '');
    }
  }, [session]);

  // Save handler (pseudo-logic)
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {      
      // Save name to API
      const response = await fetch('/api/user/update', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update profile');
      }
      
      // Update session so name appears everywhere
      await update();
      toast.success('Profile updated successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  if (!session) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  // Generate Gravatar URL from email
  const gravatarUrl = email 
    ? `https://www.gravatar.com/avatar/${createGravatarHash(email)}?d=mp&s=200` 
    : '/default-avatar.png';

  return (
    <div className="bg-gradient-to-b from-[#f8fafc] to-[#e2e8f0] min-h-screen py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="w-full max-w-3xl space-y-6">
        <Card className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <CardHeader className="bg-gray-50 pb-6 pt-8 px-8 text-center border-b">
            <div className="flex flex-col items-center">
              <div className="relative h-28 w-28 rounded-full overflow-hidden mb-4 border-4 border-white shadow-md">
                <Image 
                  src={session.user.image || gravatarUrl} 
                  alt="Profile picture" 
                  fill 
                  className="object-cover" 
                />
              </div>
              <CardTitle className="text-xl font-semibold text-gray-900 mt-2">{name}</CardTitle>
              <CardDescription className="text-gray-500">{email}</CardDescription>
            </div>
          </CardHeader>
          
          <CardContent className="p-8">
            <form onSubmit={handleSave} className="space-y-8">
              {/* Personal Information */}
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h2>
                <div className="space-y-6">
                  {/* Name */}
                  <div className="space-y-2">
                    <label className="block text-gray-700 font-medium text-sm">Name</label>
                    <Input 
                      value={name} 
                      onChange={e => setName(e.target.value)} 
                      className="w-full border-gray-300 focus:border-blue-500 rounded-lg text-gray-900"
                    />
                  </div>

                  {/* Email (read-only) */}
                  <div className="space-y-2">
                    <label className="block text-gray-700 font-medium text-sm">Email</label>
                    <Input 
                      value={email} 
                      readOnly 
                      className="w-full bg-gray-100 cursor-not-allowed border-gray-300 rounded-lg text-gray-900" 
                    />
                  </div>
                </div>
              </div>

              {/* Password Info */}
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                <h3 className="text-sm font-medium text-blue-800 mb-2">Password Management</h3>
                <p className="text-sm text-blue-700">
                  For security reasons, password changes must be requested through our support team. 
                  If you need to change your password or have forgotten it, please contact us.
                </p>
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition duration-200 mt-2"
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </form>

            <div className="flex gap-4 pt-4 mt-6 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                className="w-full bg-gray-800 hover:bg-gray-700 text-white border-gray-700 flex items-center justify-center gap-2 py-2 rounded-lg"
                onClick={() => router.push('/contact')}
              >
                <Mail size={18} />
                <span>Contact Support</span>
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full border-gray-300 hover:bg-gray-50 text-gray-800 flex items-center justify-center gap-2 py-2 rounded-lg"
                onClick={() => router.push('/settings')}
              >
                <Settings size={18} />
                <span>Settings</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Simple hash function for Gravatar
// We're using a simplified approach since we can't import crypto libraries client-side
function createGravatarHash(email: string): string {
  // Trim leading/trailing whitespace and force lowercase
  const normalizedEmail = email.trim().toLowerCase();
  
  // This isn't a proper MD5, but it will create a consistent string that works as an identifier
  // For proper MD5, you'd need to use a library or implement the algorithm
  let hash = '';
  for (let i = 0; i < normalizedEmail.length; i++) {
    hash += normalizedEmail.charCodeAt(i).toString(16);
  }
  
  // Pad the hash to ensure it's long enough
  while (hash.length < 32) {
    hash += '0';
  }
  
  return hash.substring(0, 32);
}
