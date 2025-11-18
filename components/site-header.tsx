import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { ThemeToggle } from './theme-toggle';
import { UserAuthMenu } from './user-auth-menu';
import { NotificationBell } from './notification-bell';
import { authOptions } from '@/lib/auth';
import { getDashboardPath, ROLE_LABELS } from '@/lib/rbac';
import { DataObject } from '@mui/icons-material'; // Using MUI version of the icon

const navLinks = [
    { href: "/#about", label: "학원소개" },
    { href: "/#courses", label: "과정안내" },
    { href: "/#news", label: "소식/이벤트" },
    { href: "/#contact", label: "문의하기" },
];

export async function SiteHeader() {
  const session = await getServerSession(authOptions);
  const dashboardHref = getDashboardPath(session?.user.role);

  return (
    <div className="w-full bg-background-light dark:bg-background-dark/80 backdrop-blur-sm sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800">
      <header className="flex items-center justify-between whitespace-nowrap px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto h-16">
        <div className="flex items-center gap-4 text-gray-900 dark:text-white">
          <Link href="/" className="flex items-center gap-2">
            <div className="text-primary text-2xl">
                <DataObject style={{ fontSize: 28 }} />
            </div>
            <h2 className="text-gray-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">
              코딩메이커 아카데미 허브
            </h2>
          </Link>
        </div>

        <nav className="hidden md:flex flex-1 justify-center gap-8">
          <div className="flex items-center gap-9">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-white text-sm font-medium leading-normal">
                {link.label}
              </Link>
            ))}
             {session && (
                <Link href={dashboardHref} className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-white text-sm font-medium leading-normal">
                    대시보드
                </Link>
            )}
          </div>
        </nav>

        <div className="flex items-center gap-2">
            <NotificationBell />
            <ThemeToggle />
            <UserAuthMenu
                user={
                session
                    ? {
                        name: session.user.name,
                        roleLabel: ROLE_LABELS[session.user.role] ?? session.user.role,
                        userTag: session.user.userTag
                    }
                    : null
                }
            />
        </div>
        
        {/* Mobile menu can be added here if needed */}
        {/* <div className="md:hidden"> ... </div> */}
      </header>
    </div>
  );
}
