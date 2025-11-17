'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const links = [
  { href: '/dashboard/admin', label: '관리자 대시보드' },
  { href: '/dashboard/student', label: '학생 대시보드' },
  { href: '/dashboard/parent', label: '학부모 대시보드' },
  { href: '/community', label: '커뮤니티' },
  { href: '/projects', label: '프로젝트 협업' }
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-60 flex-shrink-0 flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-sm shadow-sm dark:border-slate-800 dark:bg-[#111a24] md:flex">
      <p className="px-2 text-xs font-semibold uppercase tracking-[0.4em] text-slate-400">허브</p>
      {links.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'rounded-xl px-3 py-2 font-semibold transition',
              active
                ? 'bg-primary/10 text-primary'
                : 'text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-white/5'
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </aside>
  );
}
