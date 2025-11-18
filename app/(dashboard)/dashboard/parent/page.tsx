import { AUDIENCES } from '@/lib/constants';
import { requireRole } from '@/lib/auth-helpers';
import { DASHBOARD_ACCESS } from '@/lib/rbac';
import { prisma } from '@/lib/prisma';
import { AttendanceCalendar } from '@/components/attendance-calendar';
import { buildMonthlyCalendar } from '@/lib/attendance';

const formatDate = (value: Date) =>
  new Intl.DateTimeFormat('ko', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).format(value);

export default async function ParentDashboardPage() {
  const session = await requireRole(DASHBOARD_ACCESS.PARENT, '/dashboard/parent');

  const [children, messages, alerts, parentLinks] = await Promise.all([
    prisma.parentChildRecord.findMany(),
    prisma.parentMessage.findMany({ orderBy: { sentAt: 'desc' } }),
    prisma.announcement.findMany({ where: { audience: AUDIENCES.PARENT }, orderBy: { publishedAt: 'desc' }, take: 3 }),
    prisma.parentLink.findMany({
      where: { parentId: session.user.id },
      include: {
        student: {
          include: {
            attendanceLogs: { orderBy: { checkInTime: 'desc' }, take: 60 },
            enrollments: { include: { class: true } }
          }
        }
      }
    })
  ]);
  const parentConnections = parentLinks.map((link) => ({
    id: link.id,
    childName: link.student.name,
    childTag: link.student.userTag,
    classes: link.student.enrollments.map((enrollment) => enrollment.class?.name ?? '미배정'),
    calendar: buildMonthlyCalendar(link.student.attendanceLogs),
    lastAttendance: link.student.attendanceLogs[0]
  }));

  return (
    <div className="space-y-8">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-primary">Parent Portal</p>
        <h1 className="mt-2 text-3xl font-black text-slate-900 dark:text-white">학부모 대시보드</h1>
        <p className="text-sm text-slate-500 dark:text-slate-300">출결, 수업, 상담 기록을 실시간으로 확인하세요.</p>
      </header>

      <section className="grid gap-6 lg:grid-cols-2">
        {children.map((child) => (
          <div key={child.id} className="rounded-2xl border border-slate-100 bg-slate-50/70 p-6 dark:border-slate-800 dark:bg-white/5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-500">자녀</p>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{child.childName}</h3>
              </div>
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">{child.attendanceInfo}</span>
            </div>
            <p className="mt-4 text-sm text-slate-500 dark:text-slate-300">현재 클래스 · {child.currentClass}</p>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">메모 · {child.memo}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        {parentConnections.length ? (
          parentConnections.map((connection) => (
            <div key={connection.id} className="rounded-2xl border border-slate-100 bg-white/80 p-6 dark:border-slate-800 dark:bg-white/5">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">셀프 인증 완료</p>
              <h3 className="mt-2 text-xl font-bold text-slate-900 dark:text-white">
                {connection.childName} · {connection.childTag}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-300">연결된 클래스</p>
              <p className="text-sm text-slate-700 dark:text-slate-200">{connection.classes.join(', ') || '없음'}</p>
              {connection.lastAttendance ? (
                <p className="mt-3 text-xs text-slate-500 dark:text-slate-300">
                  최근 출석 · {formatDate(connection.lastAttendance.checkInTime)} ({connection.lastAttendance.status})
                </p>
              ) : null}
            </div>
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white/50 p-6 text-sm text-slate-500 dark:border-slate-700 dark:bg-white/5">
            <p className="font-semibold text-slate-800 dark:text-white">아직 연결된 자녀 계정이 없습니다.</p>
            <p className="mt-2">네이버 블로그 상담폼 또는 학원으로 연락하여 셀프 인증을 완료하면, 자녀 출석/수업 기록이 여기에 표시됩니다.</p>
          </div>
        )}
      </section>

      {parentConnections.length ? (
        <section className="grid gap-6 lg:grid-cols-2">
          {parentConnections.map((connection) => (
            <AttendanceCalendar key={`${connection.id}-calendar`} title={`${connection.childName} 출석`} days={connection.calendar} />
          ))}
        </section>
      ) : null}

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-100 bg-white/80 p-6 dark:border-slate-800 dark:bg-white/5">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">알림함</h2>
          <ul className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-300">
            {alerts.map((alert) => (
              <li key={alert.id}>
                {formatDate(alert.publishedAt)} · {alert.summary}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-white/80 p-6 dark:border-slate-800 dark:bg-white/5">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">선생님 메시지</h2>
          <div className="mt-4 space-y-3">
            {messages.map((msg) => (
              <div key={msg.id} className="rounded-2xl border border-slate-100/70 p-4 text-sm text-slate-600 dark:border-slate-800 dark:text-slate-300">
                <p className="font-semibold text-slate-900 dark:text-white">{msg.teacherName}</p>
                <p>{msg.summary}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{formatDate(msg.sentAt)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
