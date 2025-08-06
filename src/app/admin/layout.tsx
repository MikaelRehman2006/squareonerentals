'use client';

import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  Building2,
  Flag,
  BarChart3,
  Settings,
  Bell,
  Home,
  ClipboardList,
  FileText,
  Menu,
  X,
  AlertCircle,
  Bug,
} from 'lucide-react';

const adminTabs = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Listings', href: '/admin/listings', icon: Home },
  { name: 'Survey Responses', href: '/admin/survey-responses', icon: ClipboardList },
  { name: 'Notifications', href: '/admin/notifications', icon: Bell },
  { name: 'Reports', href: '/admin/reports', icon: FileText },
  { name: 'Feedback', href: '/admin/feedback', icon: AlertCircle },
  { name: 'Debugging', href: '/admin/debugging', icon: Bug },
  { name: 'Settings', href: '/admin/settings', icon: Settings }
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!session) {
    redirect('/auth/signin');
  }

  return (
    <div className="flex min-h-screen">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col">
        <div className="flex flex-col flex-grow border-r bg-background px-4 py-5">
          <div className="flex-1">
            <nav className="space-y-1">
              {adminTabs.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'group flex items-center px-2 py-2 text-sm font-medium rounded-md',
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-gray-800 dark:text-gray-200 hover:bg-accent hover:text-foreground'
                    )}
                  >
                    <Icon
                      className={cn(
                        'mr-3 h-5 w-5 flex-shrink-0',
                        isActive ? 'text-primary' : 'text-gray-700 dark:text-gray-300'
                      )}
                    />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Mobile Header with Menu Button */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold text-gray-900">Admin Panel</h1>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black bg-opacity-50" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      {/* Mobile Sidebar */}
      <div className={cn(
        "md:hidden fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Mobile Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Admin Menu</h2>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          {/* Mobile Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-1">
            {adminTabs.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    'group flex items-center px-3 py-3 text-sm font-medium rounded-md transition-colors',
                    isActive
                      ? 'bg-blue-100 text-blue-700 border-l-4 border-blue-700'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  )}
                >
                  <Icon
                    className={cn(
                      'mr-3 h-5 w-5 flex-shrink-0',
                      isActive ? 'text-blue-700' : 'text-gray-500'
                    )}
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 md:ml-0">
        <main className="flex-1 p-4 md:p-8 mt-0 md:mt-0">{children}</main>
      </div>
    </div>
  );
}