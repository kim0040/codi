import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { ThemeToggle } from './theme-toggle';
import { UserAuthMenu } from './user-auth-menu';
import { NotificationBell } from './notification-bell';
import { authOptions } from '@/lib/auth';
import { getDashboardPath, ROLE_LABELS } from '@/lib/rbac';

const baseNav = [
  { href: '/#about', label: '학원 소개' },
  { href: '/#courses', label: '과정 안내' },
  { href: '/#news', label: '소식/이벤트' },
  { href: '/#contact', label: '문의하기' }
];

export async function SiteHeader() {
  const session = await getServerSession(authOptions);
  const dashboardHref = getDashboardPath(session?.user.role);
  const navItems = [...baseNav, { href: dashboardHref, label: '대시보드' }];

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/85 backdrop-blur-lg dark:border-slate-800 dark:bg-[#0f1923]/90">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold tracking-tight text-slate-900 dark:text-white">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">CM</span>
          <span>코딩메이커 아카데미 허브</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition hover:text-primary dark:hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
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
      </div>
    </header>
  );
}
