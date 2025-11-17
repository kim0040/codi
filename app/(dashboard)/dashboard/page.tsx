import Link from 'next/link';

export default function DashboardIndex() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 text-center text-slate-700 dark:text-slate-200">
      <p className="text-lg font-semibold">접속 유형을 선택하세요.</p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link href="/dashboard/admin" className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white">
          관리자 대시보드
        </Link>
        <Link href="/dashboard/student" className="rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-200">
          학생 대시보드
        </Link>
        <Link href="/dashboard/parent" className="rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-200">
          학부모 대시보드
        </Link>
      </div>
    </div>
  );
}
