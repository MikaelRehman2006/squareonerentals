import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { MuiThemeProvider } from '@/components/mui-theme-provider';
import { Toaster } from 'sonner';
import AuthProvider from '@/components/AuthProvider';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { renderNotificationBadges } from '@/components/NotificationsDropdown';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Square One Rentals',
  description: 'Find your perfect rental in Square One, Mississauga',
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
              {renderNotificationBadges()}
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