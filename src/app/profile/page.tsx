'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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
  Mail, 
  Settings, 
  User, 
  Shield, 
  Camera, 
  Edit3, 
  Save,
  CheckCircle,
  AlertCircle,
  Star,
  Calendar,
  MapPin,
  Phone,
  Globe,
  Lock,
  Eye,
  EyeOff,
  Plus,
  ClipboardList,
  Target,
  Users,
  Building2
} from 'lucide-react';

interface UserPreferences {
  userTypes?: string[];
  onboardingCompleted?: boolean;
  preferences?: {
    [key: string]: any;
  };
}

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [userPreferences, setUserPreferences] = useState<UserPreferences | null>(null);
  const [loadingPreferences, setLoadingPreferences] = useState(true);
  const router = useRouter();

  // Preload name and email from session
  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || '');
      setEmail(session.user.email || '');
    }
  }, [session]);

  // Fetch user preferences
  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        console.log('Fetching user preferences...');
        const response = await fetch('/api/user/preferences');
        console.log('Response status:', response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log('Fetched preferences data:', data);
          
          // The API returns { preferences: { userTypes, onboardingCompleted, etc } }
          if (data.preferences) {
            setUserPreferences({
              userTypes: data.preferences.userTypes || [],
              onboardingCompleted: data.preferences.onboardingCompleted || false,
              preferences: data.preferences
            });
            console.log('Set user preferences:', {
              userTypes: data.preferences.userTypes || [],
              onboardingCompleted: data.preferences.onboardingCompleted || false
            });
          }
        } else {
          console.error('Failed to fetch preferences:', response.status);
        }
      } catch (error) {
        console.error('Error fetching preferences:', error);
      } finally {
        setLoadingPreferences(false);
      }
    };

    if (session?.user) {
      fetchPreferences();
    }
  }, [session]);

  // Listen for survey completion events
  useEffect(() => {
    const handleSurveyCompleted = () => {
      console.log('Survey completed, refreshing preferences...');
      // Refresh preferences after survey completion
      const refreshPreferences = async () => {
        try {
          const response = await fetch('/api/user/preferences');
          if (response.ok) {
            const data = await response.json();
            if (data.preferences) {
              setUserPreferences({
                userTypes: data.preferences.userTypes || [],
                onboardingCompleted: data.preferences.onboardingCompleted || false,
                preferences: data.preferences
              });
              console.log('Refreshed preferences after survey completion:', {
                userTypes: data.preferences.userTypes || [],
                onboardingCompleted: data.preferences.onboardingCompleted || false
              });
            }
          }
        } catch (error) {
          console.error('Error refreshing preferences:', error);
        }
      };
      refreshPreferences();
    };

    // Listen for survey completion event
    window.addEventListener('surveyCompleted', handleSurveyCompleted);

    return () => {
      window.removeEventListener('surveyCompleted', handleSurveyCompleted);
    };
  }, []);

  // Save handler (keeping existing backend logic)
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
      setIsEditing(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditProfile = () => {
    console.log('Edit Profile button clicked');
    console.log('Current isEditing state:', isEditing);
    setIsEditing(!isEditing);
  };

  const handleViewDashboard = () => {
    console.log('View Dashboard button clicked');
    console.log('Navigating to dashboard...');
    router.push('/dashboard');
  };

  const refreshPreferences = async () => {
    console.log('Manually refreshing preferences...');
    setLoadingPreferences(true);
    try {
      const response = await fetch('/api/user/preferences');
      if (response.ok) {
        const data = await response.json();
        console.log('Refreshed preferences data:', data);
        
        if (data.preferences) {
          setUserPreferences({
            userTypes: data.preferences.userTypes || [],
            onboardingCompleted: data.preferences.onboardingCompleted || false,
            preferences: data.preferences
          });
          toast.success('Preferences refreshed successfully!');
        }
      } else {
        toast.error('Failed to refresh preferences');
      }
    } catch (error) {
      console.error('Error refreshing preferences:', error);
      toast.error('Error refreshing preferences');
    } finally {
      setLoadingPreferences(false);
    }
  };

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your profile...</p>
        </motion.div>
      </div>
    );
  }

  // Generate Gravatar URL from email
  const gravatarUrl = email 
    ? `https://www.gravatar.com/avatar/${createGravatarHash(email)}?d=mp&s=200` 
    : '/default-avatar.png';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Your Profile</h1>
          <p className="text-gray-600 text-lg">Manage your account settings and preferences</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1"
          >
            <Card className="bg-white rounded-3xl shadow-2xl border-0 overflow-hidden">
              <div className="relative">
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 opacity-10"></div>
                
                <CardHeader className="relative text-center pb-8 pt-12">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="relative mx-auto mb-6"
                  >
                    <div className="relative h-32 w-32 rounded-full overflow-hidden border-4 border-white shadow-2xl">
                      <Image 
                        src={session.user.image || gravatarUrl} 
                        alt="Profile picture" 
                        fill 
                        className="object-cover" 
                      />
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
                      >
                        <Camera size={16} />
                      </motion.button>
                    </div>
                  </motion.div>
                  
                  <CardTitle className="text-2xl font-bold text-gray-900 mb-2">{name}</CardTitle>
                  <CardDescription className="text-black flex items-center justify-center gap-2">
                    <Mail size={16} />
                    {email}
                  </CardDescription>
                </CardHeader>

                <CardContent className="p-6">
                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="text-center p-4 bg-blue-50 rounded-xl"
                    >
                      <div className="text-2xl font-bold text-blue-600">
                        {userPreferences?.onboardingCompleted ? '✓' : '!'}
                      </div>
                      <div className="text-sm text-gray-600">
                        {userPreferences?.onboardingCompleted ? 'Survey Complete' : 'Survey Pending'}
                      </div>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="text-center p-4 bg-green-50 rounded-xl"
                    >
                      <div className="text-2xl font-bold text-green-600">
                        {userPreferences?.userTypes?.length || 0}
                      </div>
                      <div className="text-sm text-gray-600">Roles Selected</div>
                    </motion.div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <button
                      onClick={handleEditProfile}
                      onMouseEnter={() => console.log('Edit Profile button hovered')}
                      onMouseDown={() => console.log('Edit Profile button mouse down')}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer relative z-10 pointer-events-auto"
                      type="button"
                    >
                      <Edit3 size={18} />
                      {isEditing ? 'Cancel Edit' : 'Edit Profile'}
                    </button>
                    
                    <button
                      onClick={handleViewDashboard}
                      onMouseEnter={() => console.log('View Dashboard button hovered')}
                      onMouseDown={() => console.log('View Dashboard button mouse down')}
                      className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-xl font-medium hover:bg-gray-200 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer relative z-10 pointer-events-auto"
                      type="button"
                    >
                      <User size={18} />
                      View Dashboard
                    </button>
                  </div>
                </CardContent>
              </div>
            </Card>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Edit Profile Form */}
            <AnimatePresence>
              {isEditing && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <Card className="bg-white rounded-3xl shadow-xl border-0">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <Edit3 size={20} />
                        Edit Profile Information
                      </CardTitle>
                    </CardHeader>
                    
                    <CardContent className="p-6">
                      <form onSubmit={handleSave} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-2"
                          >
                            <label className="block text-gray-700 font-medium text-sm">Full Name</label>
                            <div className="relative">
                              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                              <Input 
                                value={name} 
                                onChange={e => setName(e.target.value)} 
                                className="w-full pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-xl text-gray-900"
                                placeholder="Enter your full name"
                              />
                            </div>
                          </motion.div>

                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="space-y-2"
                          >
                            <label className="block text-gray-700 font-medium text-sm">Email Address</label>
                            <div className="relative">
                              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                              <Input 
                                value={email} 
                                onChange={e => setEmail(e.target.value)}
                                className="w-full pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-xl text-black"
                                placeholder="Enter your email address"
                              />
                            </div>
                          </motion.div>
                        </div>

                        {/* Email Change Section */}
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                          className="space-y-4"
                        >
                          <h3 className="text-lg font-medium text-gray-900">Change Email Address</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="block text-gray-700 font-medium text-sm">Current Password</label>
                              <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                <Input 
                                  type={showPassword ? "text" : "password"}
                                  className="w-full pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-xl"
                                  placeholder="Enter current password"
                                />
                                <button
                                  type="button"
                                  onClick={() => setShowPassword(!showPassword)}
                                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <label className="block text-gray-700 font-medium text-sm">New Email Address</label>
                              <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                <Input 
                                  type="email"
                                  className="w-full pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-xl"
                                  placeholder="Enter new email address"
                                />
                              </div>
                            </div>
                          </div>
                        </motion.div>

                        {/* Password Change Section */}
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                          className="space-y-4"
                        >
                          <h3 className="text-lg font-medium text-gray-900">Change Password</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="block text-gray-700 font-medium text-sm">Current Password</label>
                              <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                <Input 
                                  type={showPassword ? "text" : "password"}
                                  className="w-full pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-xl"
                                  placeholder="Enter current password"
                                />
                                <button
                                  type="button"
                                  onClick={() => setShowPassword(!showPassword)}
                                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <label className="block text-gray-700 font-medium text-sm">New Password</label>
                              <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                <Input 
                                  type="password"
                                  className="w-full pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-xl"
                                  placeholder="Enter new password"
                                />
                              </div>
                            </div>
                          </div>
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 }}
                          className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-100"
                        >
                          <div className="flex items-start gap-3">
                            <Shield className="text-blue-600 mt-1" size={20} />
                            <div>
                              <h3 className="text-sm font-medium text-blue-800 mb-1">Account Security</h3>
                              <p className="text-sm text-blue-700">
                                Password changes are processed through our secure system. 
                                Contact support if you need assistance with password recovery.
                              </p>
                            </div>
                          </div>
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 }}
                          className="flex gap-3"
                        >
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={isSaving}
                            className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 px-6 rounded-xl font-medium hover:from-green-700 hover:to-blue-700 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
                          >
                            {isSaving ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                Saving...
                              </>
                            ) : (
                              <>
                                <Save size={18} />
                                Save Changes
                              </>
                            )}
                          </motion.button>
                          
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="button"
                            onClick={() => setIsEditing(false)}
                            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all duration-200"
                          >
                            Cancel
                          </motion.button>
                        </motion.div>
                      </form>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="bg-white rounded-3xl shadow-xl border-0">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-bold text-gray-900">Quick Actions</CardTitle>
                </CardHeader>
                
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <motion.button
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => router.push('/contact')}
                      className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200 hover:from-blue-100 hover:to-blue-200 transition-all duration-200 text-left group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-600 rounded-lg group-hover:bg-blue-700 transition-colors">
                          <Mail className="text-white" size={20} />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">Contact Support</div>
                          <div className="text-sm text-gray-600">Get help with your account</div>
                        </div>
                      </div>
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => router.push('/settings')}
                      className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl border border-purple-200 hover:from-purple-100 hover:to-purple-200 transition-all duration-200 text-left group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-600 rounded-lg group-hover:bg-purple-700 transition-colors">
                          <Settings className="text-white" size={20} />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">My Preferences</div>
                          <div className="text-sm text-gray-600">Manage your preferences</div>
                        </div>
                      </div>
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => router.push('/dashboard')}
                      className="p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl border border-green-200 hover:from-green-100 hover:to-green-200 transition-all duration-200 text-left group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-600 rounded-lg group-hover:bg-green-700 transition-colors">
                          <User className="text-white" size={20} />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">My Dashboard</div>
                          <div className="text-sm text-gray-600">View your listings</div>
                        </div>
                      </div>
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => router.push('/listings/create')}
                      className="p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl border border-orange-200 hover:from-orange-100 hover:to-orange-200 transition-all duration-200 text-left group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-600 rounded-lg group-hover:bg-orange-700 transition-colors">
                          <Plus className="text-white" size={20} />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">List Property</div>
                          <div className="text-sm text-gray-600">Create new listing</div>
                        </div>
                      </div>
                    </motion.button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Onboarding Survey Status */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="bg-white rounded-3xl shadow-xl border-0">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <ClipboardList size={20} />
                    Onboarding Survey Status
                  </CardTitle>
                  <button
                    onClick={refreshPreferences}
                    disabled={loadingPreferences}
                    className="text-sm text-blue-600 hover:text-blue-700 disabled:opacity-50"
                  >
                    {loadingPreferences ? 'Refreshing...' : 'Refresh'}
                  </button>
                </CardHeader>
                
                <CardContent className="p-6">
                  {loadingPreferences ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                      <p className="text-gray-600">Loading your preferences...</p>
                    </div>
                  ) : userPreferences?.onboardingCompleted ? (
                    <div className="space-y-6">
                      <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                        <div className="flex items-center gap-2 mb-3">
                          <CheckCircle className="text-green-600" size={20} />
                          <span className="font-medium text-green-800">Survey Completed</span>
                        </div>
                        <p className="text-green-700 text-sm">
                          Thank you for completing the onboarding survey! Your preferences have been saved.
                        </p>
                      </div>

                      {userPreferences?.userTypes && userPreferences.userTypes.length > 0 && (
                        <div>
                          <h3 className="font-medium text-gray-900 mb-3">Your Selected Roles:</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {userPreferences.userTypes.map((role, index) => (
                              <motion.div
                                key={role}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200"
                              >
                                <Target className="text-blue-600" size={16} />
                                <span className="text-sm font-medium text-blue-800 capitalize">
                                  {role.replace(/([A-Z])/g, ' $1').trim()}
                                </span>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      )}

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => window.dispatchEvent(new CustomEvent('openSurvey'))}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center gap-2"
                      >
                        <Edit3 size={18} />
                        Update Survey Responses
                      </motion.button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
                        <div className="flex items-center gap-2 mb-3">
                          <AlertCircle className="text-yellow-600" size={20} />
                          <span className="font-medium text-yellow-800">Survey Not Completed</span>
                        </div>
                        <p className="text-yellow-700 text-sm">
                          Please complete the onboarding survey to help us personalize your experience.
                        </p>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => window.dispatchEvent(new CustomEvent('openSurvey'))}
                        className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 px-6 rounded-xl font-medium hover:from-green-700 hover:to-blue-700 transition-all duration-200 flex items-center justify-center gap-2"
                      >
                        <ClipboardList size={18} />
                        Complete Onboarding Survey
                      </motion.button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// Simple hash function for Gravatar (keeping existing logic)
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
