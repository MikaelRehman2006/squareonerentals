'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';

type StorageUsageBarProps = {
  currentUsage: number; // in bytes
  uploadedFiles?: File[]; // currently selected files (not yet uploaded)
};

export default function StorageUsageBar({ currentUsage, uploadedFiles = [] }: StorageUsageBarProps) {
  const { data: session } = useSession();
  const [usage, setUsage] = useState<{
    current: number; // in bytes
    limit: number; // in bytes
    percent: number; // 0-100
    pendingSize: number; // size of files about to be uploaded
    pendingPercent: number; // 0-100
  }>({
    current: 0,
    limit: 5 * 1024 * 1024, // Default 5MB
    percent: 0,
    pendingSize: 0,
    pendingPercent: 0
  });

  // Membership info
  const [membershipInfo, setMembershipInfo] = useState<{
    type: 'NONE' | 'BASIC' | 'FEATURED' | null;
    isActive: boolean;
    isFeatured: boolean;
  }>({
    type: 'NONE',
    isActive: false,
    isFeatured: false
  });

  // Calculate total size of files about to be uploaded
  useEffect(() => {
    const pendingSize = uploadedFiles.reduce((total, file) => total + file.size, 0);
    const totalUsage = currentUsage + pendingSize;
    const percent = Math.min(100, Math.round((currentUsage / usage.limit) * 100));
    const pendingPercent = Math.min(100, Math.round((totalUsage / usage.limit) * 100)) - percent;
    
    setUsage(prev => ({
      ...prev,
      current: currentUsage,
      pendingSize,
      percent,
      pendingPercent
    }));
  }, [currentUsage, uploadedFiles, usage.limit]);

  // Fetch user membership status and set limits
  useEffect(() => {
    const fetchUserMembership = async () => {
      if (session?.user?.id) {
        try {
          const response = await fetch('/api/users/me');
          if (response.ok) {
            const userData = await response.json();
            const userMembership = userData.membership || {};
            
            // Storage limits based on membership type (in bytes)
            const STORAGE_LIMITS = {
              FEATURED: 25 * 1024 * 1024, // 25MB
              BASIC: 10 * 1024 * 1024,   // 10MB
              NONE: 5 * 1024 * 1024      // 5MB default
            };
            
            const isActive = userMembership.status === 'active';
            const membershipType = isActive ? userMembership.type : 'NONE';
            const storageLimit = STORAGE_LIMITS[membershipType as keyof typeof STORAGE_LIMITS] || STORAGE_LIMITS.NONE;
            
            setMembershipInfo({
              type: membershipType,
              isActive,
              isFeatured: membershipType === 'FEATURED' && isActive
            });
            
            setUsage(prev => ({
              ...prev,
              limit: storageLimit
            }));
          }
        } catch (error) {
          console.error('Error fetching user membership:', error);
        }
      }
    };

    fetchUserMembership();
  }, [session]);

  // Format bytes to human-readable format
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Determine color based on usage percentage
  const getProgressColor = () => {
    if (usage.percent + usage.pendingPercent > 90) return 'bg-red-500';
    if (usage.percent + usage.pendingPercent > 70) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  return (
    <div className="space-y-2 mt-2 mb-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-300">
            Storage
          </span>
          
          {/* Membership badge */}
          {membershipInfo.isActive && (
            <Badge 
              className={`${membershipInfo.isFeatured 
                ? 'bg-purple-600/80 text-white border-purple-500 shadow-sm shadow-purple-900/20' 
                : 'bg-blue-600/80 text-white border-blue-500 shadow-sm shadow-blue-900/20'} 
                px-2.5 py-0.5 rounded-full transition-all duration-300 hover:shadow-md`}
              variant="outline"
            >
              {membershipInfo.type}
            </Badge>
          )}
          
          {/* Not active message */}
          {!membershipInfo.isActive && (
            <Badge 
              variant="outline" 
              className="bg-gray-700/80 text-gray-300 border-gray-600 px-2.5 py-0.5 rounded-full shadow-sm hover:bg-gray-600/90 transition-all duration-200"
            >
              No Active Plan
            </Badge>
          )}
        </div>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button type="button" className="flex items-center text-xs text-gray-400 hover:text-gray-300 focus:outline-none transition-colors duration-200">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
              </button>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs bg-gray-800 border-gray-700 text-white px-3 py-2 rounded-lg shadow-xl">
              <p>
                {membershipInfo.type === 'FEATURED' ? (
                  'Featured plan includes 25MB storage and your listings will be featured!'
                ) : membershipInfo.type === 'BASIC' ? (
                  'Basic plan includes 10MB storage.'
                ) : (
                  'Purchase a membership plan to upload more images and create listings.'
                )}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      {/* Progress bar */}
      <div className="space-y-1.5">
        <div className="h-3 w-full bg-gray-700/50 rounded-full overflow-hidden shadow-inner transition-all duration-300">
          {/* Current usage with transition */}
          <div 
            className={`h-full ${getProgressColor()} transition-all duration-500 ease-out`} 
            style={{ width: `${usage.percent}%` }}
          />
          {/* Pending uploads visualization */}
          {usage.pendingPercent > 0 && (
            <div 
              className={`h-full ${getProgressColor()} opacity-60 -mt-3 backdrop-blur-sm transition-all duration-500 ease-out`} 
              style={{ width: `${usage.percent + usage.pendingPercent}%` }}
            />
          )}
        </div>
        
        <div className="flex justify-between text-xs text-gray-400">
          <span className="font-medium">
            {formatBytes(usage.current)} used
            {usage.pendingSize > 0 && (
              <span className="text-blue-400 ml-1 animate-pulse">
                (+ {formatBytes(usage.pendingSize)} pending)
              </span>
            )}
          </span>
          <span className="font-medium">{formatBytes(usage.limit)} limit</span>
        </div>
      </div>
      
      {/* Featured message for Featured members */}
      {membershipInfo.isFeatured && (
        <div className="mt-2 text-xs text-purple-400 flex items-center px-3 py-2 bg-purple-900/20 border border-purple-800/40 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          Your listing will be automatically featured with premium placement!
        </div>
      )}
      
      {/* Upgrade message for non-members or Basic members */}
      {(!membershipInfo.isActive || membershipInfo.type === 'BASIC') && (
        <div className="mt-2 text-xs text-gray-400 px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg">
          <a href="/memberships" className="text-blue-400 hover:text-blue-300 hover:underline transition-all duration-200">
            {!membershipInfo.isActive ? 'Purchase a membership' : 'Upgrade to Featured'}
          </a> {membershipInfo.isActive ? 'for more storage and featured listings.' : 'to create listings. An active membership is required.'}
        </div>
      )}
      
      {/* Warning message for non-members */}
      {!membershipInfo.isActive && (
        <div className="mt-2 p-3 bg-red-900/20 backdrop-blur-sm border border-red-800/50 rounded-lg text-xs text-red-300 shadow-sm">
          <div className="flex items-center mb-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <span className="font-medium">Membership required</span>
          </div>
          <p>You must have an active membership to create and submit listings. Images can be uploaded but listing creation will be blocked.</p>
        </div>
      )}
    </div>
  );
}
