'use client';

import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
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
} from 'lucide-react';

const adminTabs = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Listings', href: '/admin/listings', icon: Home },
  { name: 'Survey Responses', href: '/admin/survey-responses', icon: ClipboardList },
  { name: 'Notifications', href: '/admin/notifications', icon: Bell },
  { name: 'Reports', href: '/admin/reports', icon: FileText },
  { name: 'Settings', href: '/admin/settings', icon: Settings }
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!session) {
    redirect('/auth/signin');
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
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

      {/* Main content */}
      <div className="flex flex-col flex-1">
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}