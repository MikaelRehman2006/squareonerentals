'use client';

import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { isAdmin } from '@/lib/authHelpers';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Menu, User, X, Heart, Bell, Settings, MessageSquare, LayoutDashboard, ShieldCheck } from 'lucide-react';
import { renderNotificationBadges } from './NotificationsDropdown';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Listings', href: '/listings' },
  { name: 'Find Realtors', href: '/realtors' },
  { name: 'Careers', href: '/careers' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
  { name: 'Memberships', href: '/memberships' },
];

export default function Navbar() {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  // Add notification badges
  renderNotificationBadges();

  const handleAuth = (action: 'signin' | 'signup') => {
    setIsOpen(false);
    router.push(`/auth/signin${action === 'signup' ? '?isSignUp=true' : ''}`);
  };

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push('/');
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Left side: Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src="/images/logo.png"
                alt="Square One Rentals"
                width={32}
                height={32}
                className="h-8 w-8"
              />
              <span className="font-bold text-xl">Square One Rentals</span>
            </Link>
          </div>

          {/* Center: Main Navigation */}
          <div className="hidden sm:flex flex-1 justify-center px-8">
            <div className="flex items-center space-x-5">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-700 hover:text-primary px-2 py-2 text-sm font-medium whitespace-nowrap"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Right side: Submit Listing and Auth */}
          <div className="hidden sm:flex items-center space-x-6">
            <Link
              href="/submit"
              className="text-primary hover:text-primary/80 px-3 py-2 text-sm font-medium whitespace-nowrap"
            >
              Submit Listing
            </Link>
            
            {session?.user ? (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative">
                      <User className="h-5 w-5" />
                      <div id="notification-badge"></div>
                      <span className="sr-only">User menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{session.user.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">{session.user.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard" className="flex items-center">
                        <LayoutDashboard className="w-4 h-4 mr-2" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="flex items-center">
                        <User className="w-4 h-4 mr-2" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/favorites" className="flex items-center">
                        <Heart className="w-4 h-4 mr-2" />
                        Favorites
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/notifications" className="flex items-center relative">
                        <Bell className="w-4 h-4 mr-2" />
                        Notifications
                        <div id="notification-menu-badge"></div>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/settings" className="flex items-center">
                        <Settings className="w-4 h-4 mr-2" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    {isAdmin(session?.user?.role) && (
                      <DropdownMenuItem asChild>
                        <Link href="/admin" className="flex items-center">
                          <ShieldCheck className="w-4 h-4 mr-2" />
                          Admin
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut}>
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center space-x-4 pl-4 border-l border-gray-200">
                <Button 
                  variant="ghost" 
                  onClick={() => handleAuth('signin')}
                  className="text-gray-700 hover:text-primary"
                >
                  Sign In
                </Button>
                <Button 
                  variant="default" 
                  onClick={() => handleAuth('signup')}
                  className="bg-primary hover:bg-primary/90"
                >
                  Sign Up
                </Button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="sm:hidden flex items-center ml-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center rounded-md text-gray-700 hover:text-primary focus:outline-none"
            >
              {isOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="sm:hidden border-t border-gray-200">
            <div className="pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-4 py-2 text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="border-t border-gray-200 mt-2 pt-2">
                <Link
                  href="/submit"
                  className="block px-4 py-2 text-base font-medium text-primary hover:text-primary/80 hover:bg-gray-50"
                  onClick={() => setIsOpen(false)}
                >
                  Submit Listing
                </Link>
                {session?.user ? (
                  <div className="mt-2 pt-2 border-t border-gray-200">
                    <div className="px-4 py-2">
                      <p className="text-base font-medium text-gray-900">{session.user.name}</p>
                      <p className="text-sm text-gray-500">{session.user.email}</p>
                    </div>
                    <div className="mt-2 space-y-1">
                      <Link
                        href="/dashboard"
                        className="block px-4 py-2 text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50 flex items-center"
                        onClick={() => setIsOpen(false)}
                      >
                        <LayoutDashboard className="w-5 h-5 mr-3" />
                        Dashboard
                      </Link>
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50 flex items-center"
                        onClick={() => setIsOpen(false)}
                      >
                        <User className="w-5 h-5 mr-3" />
                        Profile
                      </Link>
                      <Link
                        href="/favorites"
                        className="block px-4 py-2 text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50 flex items-center"
                        onClick={() => setIsOpen(false)}
                      >
                        <Heart className="w-5 h-5 mr-3" />
                        Favorites
                      </Link>
                      <Link
                        href="/notifications"
                        className="block px-4 py-2 text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50 flex items-center"
                        onClick={() => setIsOpen(false)}
                      >
                        <Bell className="w-5 h-5 mr-3" />
                        Notifications
                        <div id="mobile-notification-badge" className="ml-2"></div>
                      </Link>
                      <Link
                        href="/settings"
                        className="block px-4 py-2 text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50 flex items-center"
                        onClick={() => setIsOpen(false)}
                      >
                        <Settings className="w-5 h-5 mr-3" />
                        Settings
                      </Link>
                      {isAdmin(session?.user?.role) && (
                        <Link
                          href="/admin"
                          className="block px-4 py-2 text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50 flex items-center"
                          onClick={() => setIsOpen(false)}
                        >
                          <ShieldCheck className="w-5 h-5 mr-3" />
                          Admin
                        </Link>
                      )}
                      <button
                        onClick={handleSignOut}
                        className="block w-full text-left px-4 py-2 text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50 mt-2 border-t border-gray-200"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-2 px-4 pt-2 border-t border-gray-200">
                    <div className="grid gap-2">
                      <Button 
                        variant="ghost" 
                        onClick={() => handleAuth('signin')}
                        className="justify-center text-gray-700 hover:text-primary w-full"
                      >
                        Sign In
                      </Button>
                      <Button 
                        variant="default" 
                        onClick={() => handleAuth('signup')}
                        className="justify-center bg-primary hover:bg-primary/90 w-full"
                      >
                        Sign Up
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}