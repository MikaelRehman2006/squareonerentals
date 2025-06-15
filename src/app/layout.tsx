import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { MuiThemeProvider } from '@/components/mui-theme-provider';
import { Toaster } from 'sonner';
import AuthProvider from '@/components/AuthProvider';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import dynamicImport from 'next/dynamic';
import PostSignupSurvey from '@/components/PostSignupSurvey';

// Add dynamic export to prevent prerendering issues
export const dynamic = 'force-dynamic';

// Import notification badges component with SSR disabled
const NotificationBadgesRenderer = dynamicImport(
  () => import('@/components/NotificationsDropdown').then(mod => ({ 
    default: mod.renderNotificationBadges 
  })),
  { ssr: false }
);

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Square One Rentals',
  description: 'Find your perfect rental in Square One, Mississauga',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/logo192.png', type: 'image/png', sizes: '192x192' },
      { url: '/logo512.png', type: 'image/png', sizes: '512x512' }
    ],
    apple: [
      { url: '/logo192.png', sizes: '192x192', type: 'image/png' }
    ],
    other: [
      {
        rel: 'apple-touch-icon',
        url: '/logo192.png',
      },
    ],
  },
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <MuiThemeProvider>
            <AuthProvider>
              <NotificationBadgesRenderer />
              <PostSignupSurvey />
              <div className="flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-grow">
                  {children}
                </main>
                <Footer />
              </div>
              <Toaster />
            </AuthProvider>
          </MuiThemeProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}