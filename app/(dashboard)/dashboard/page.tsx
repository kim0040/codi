import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { getDashboardPath } from '@/lib/rbac';

export default async function DashboardIndex() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect(getDashboardPath(session.user.role));
  }

  return (
    <div className="flex flex-col items-center justify-center gap-6 py-16 text-center text-slate-700 dark:text-slate-200">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-primary">Dashboard</p>
        <p className="mt-2 text-lg font-semibold">대시보드는 로그인 후 역할에 따라 자동 연결됩니다.</p>
        <p className="text-sm text-slate-500">먼저 아래 버튼으로 로그인하세요.</p>
      </div>
      <Link
        href="/login"
        className="rounded-full bg-primary px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/30 transition hover:-translate-y-0.5"
      >
        로그인 페이지로 이동
      </Link>
    </div>
  );
}
