import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { getServerSession } from 'next-auth';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { AuthProvider } from '@/components/auth-provider';
import { authOptions } from '@/lib/auth';

export const metadata: Metadata = {
  title: '코딩메이커 아카데미 허브',
  description: 'LMS, 커뮤니티, 프로젝트 협업, 출석을 모두 담은 디지털 허브'
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="ko" suppressHydrationWarning>
      <body className="min-h-screen bg-background-light text-slate-900 antialiased dark:bg-background-dark dark:text-white">
        <AuthProvider session={session}>
          <ThemeProvider>
            <div className="flex min-h-screen flex-col bg-background-light dark:bg-background-dark">
              <SiteHeader />
              <main className="flex-1 bg-transparent">{children}</main>
              <SiteFooter />
            </div>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
