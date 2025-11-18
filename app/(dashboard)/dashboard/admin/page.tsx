import { ATTENDANCE_STATUSES, AUDIENCES, METRIC_TYPES } from '@/lib/constants';
import { requireRole } from '@/lib/auth-helpers';
import { DASHBOARD_ACCESS } from '@/lib/rbac';
import { prisma } from '@/lib/prisma';
import { DashboardNotificationsPanel } from '@/components/dashboard-notifications-panel';

const statusLabel: Record<string, string> = {
  [ATTENDANCE_STATUSES.CHECK_IN]: '입실',
  [ATTENDANCE_STATUSES.LATE]: '지각',
  [ATTENDANCE_STATUSES.CHECK_OUT]: '퇴실'
};

const formatDateTime = (value: Date) =>
  new Intl.DateTimeFormat('ko', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(value);

export default async function AdminDashboardPage() {
  await requireRole(DASHBOARD_ACCESS.ADMIN, '/dashboard/admin');

  const [cards, attendance, notices, auditLogs] = await Promise.all([
    prisma.metric.findMany({ where: { type: METRIC_TYPES.ADMIN } }),
    prisma.attendanceLog.findMany({ include: { user: true, class: true }, orderBy: { checkInTime: 'desc' }, take: 6 }),
    prisma.announcement.findMany({ where: { audience: AUDIENCES.ADMIN }, orderBy: { publishedAt: 'desc' }, take: 3 }),
    prisma.auditLog.findMany({ orderBy: { occurredAt: 'desc' }, take: 3 })
  ]);

  const quickActions = ['새 공지 등록', '클래스 개설', '출석 로그 보기', '프로젝트 승인'];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-primary">Director View</p>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white">관리자 대시보드</h1>
        <p className="text-sm text-slate-500 dark:text-slate-300">원장님을 위한 운영 현황 요약과 빠른 액션</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <div key={card.id} className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4 shadow-sm dark:border-slate-800 dark:bg-white/5">
            <p className="text-sm text-slate-500 dark:text-slate-400">{card.label}</p>
            <p className="mt-3 text-2xl font-bold text-slate-900 dark:text-white">{card.value}</p>
            <p className="text-xs text-slate-400">{card.detail}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">실시간 출석</h2>
            <button className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 dark:border-slate-700 dark:text-slate-300">
              키오스크 새로고침
            </button>
          </div>
          <div className="overflow-hidden rounded-2xl border border-slate-100 dark:border-slate-800">
            <table className="min-w-full divide-y divide-slate-100 text-sm dark:divide-slate-800">
              <thead className="bg-slate-50/60 text-slate-500 dark:bg-white/5">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">이름#태그</th>
                  <th className="px-4 py-3 text-left font-semibold">클래스</th>
                  <th className="px-4 py-3 text-left font-semibold">상태</th>
                  <th className="px-4 py-3 text-left font-semibold">기록 시각</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {attendance.map((row) => (
                  <tr key={row.id}>
                    <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">{row.user.userTag}</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{row.class?.name ?? '미배정'}</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-200">{statusLabel[row.status] ?? row.status}</td>
                    <td className="px-4 py-3 text-slate-500">{formatDateTime(row.checkInTime)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">시스템 공지</h2>
          <div className="space-y-3">
            {notices.map((notice) => (
              <div key={notice.id} className="rounded-2xl border border-slate-100/70 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-white/5">
                <p className="text-sm font-semibold text-slate-900 dark:text-white">{notice.title}</p>
                <p className="text-xs text-slate-500 dark:text-slate-300">{notice.summary}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-100 bg-white/80 p-6 dark:border-slate-800 dark:bg-white/5">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">빠른 관리</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {quickActions.map((action) => (
              <button
                key={action}
                className="rounded-2xl border border-slate-100 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-primary hover:text-primary dark:border-slate-800 dark:text-slate-200"
              >
                {action}
              </button>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-white/80 p-6 dark:border-slate-800 dark:bg-white/5">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">감사 로그</h3>
          <ul className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-300">
            {auditLogs.map((log) => (
              <li key={log.id}>
                {formatDateTime(log.occurredAt)} · {log.actor} · {log.message}
              </li>
            ))}
          </ul>
        </div>
        <DashboardNotificationsPanel title="최근 알림" />
      </div>
    </div>
  );
}
