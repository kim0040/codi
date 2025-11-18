import { requireRole } from '@/lib/auth-helpers';
import { DASHBOARD_ACCESS } from '@/lib/rbac';
import { prisma } from '@/lib/prisma';
import { DashboardNotificationsPanel } from '@/components/dashboard-notifications-panel';
import { AttendanceCalendar } from '@/components/attendance-calendar';
import { buildMonthlyCalendar } from '@/lib/attendance';

const formatDateTime = (value: Date) =>
  new Intl.DateTimeFormat('ko', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(value);

export default async function StudentDashboardPage() {
  const session = await requireRole(DASHBOARD_ACCESS.STUDENT, '/dashboard/student');

  const [progressItems, assignments, resources, project, attendanceLogs] = await Promise.all([
    prisma.studentProgress.findMany({ include: { class: true }, orderBy: { studentName: 'asc' } }),
    prisma.assignment.findMany({ orderBy: { dueAt: 'asc' } }),
    prisma.curriculumWeek.findMany({ include: { class: true }, orderBy: { openDate: 'desc' }, take: 3 }),
    prisma.project.findFirst({ orderBy: { progress: 'desc' } }),
    prisma.attendanceLog.findMany({
      where: { userId: session.user.id },
      orderBy: { checkInTime: 'desc' },
      take: 60
    })
  ]);
  const calendarDays = buildMonthlyCalendar(attendanceLogs);

  return (
    <div className="space-y-8">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-primary">Student Hub</p>
        <h1 className="mt-2 text-3xl font-black text-slate-900 dark:text-white">정회원 대시보드</h1>
        <p className="text-sm text-slate-500 dark:text-slate-300">나의 클래스, 과제, 협업 소식을 한곳에서 확인하세요.</p>
      </header>
      <AttendanceCalendar title="이번 달 출석 캘린더" days={calendarDays} />

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">수강 중인 클래스</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {progressItems.map((item) => (
              <div key={item.id} className="rounded-2xl border border-slate-100 bg-white/80 p-5 dark:border-slate-800 dark:bg-white/5">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">진행률 {item.progress}%</p>
                <h3 className="mt-2 text-xl font-bold text-slate-900 dark:text-white">{item.class?.name ?? item.className}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-300">멘토 {item.mentor}</p>
                <div className="mt-4 rounded-2xl bg-slate-50 p-3 text-sm text-slate-600 dark:bg-slate-900/50 dark:text-slate-300">
                  다음 세션 · {item.nextSession}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">과제 일정</h2>
          <div className="space-y-3">
            {assignments.map((task) => (
              <div key={task.id} className="rounded-2xl border border-slate-100/70 bg-slate-50/70 p-4 text-sm dark:border-slate-800 dark:bg-white/5">
                <p className="font-semibold text-slate-900 dark:text-white">{task.title}</p>
                <p className="text-slate-500 dark:text-slate-300">마감 {formatDateTime(task.dueAt)}</p>
                <span className="mt-2 inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">{task.status}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">프로젝트 & 자료실</h2>
          <div className="rounded-3xl border border-slate-100 bg-white/80 p-6 dark:border-slate-800 dark:bg-white/5">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl bg-gradient-to-br from-primary/15 to-blue-500/20 p-5 text-slate-900 dark:text-white">
                <p className="text-sm font-semibold">Git-Lite 협업실</p>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                  {project ? `${project.title} · ${project.progress}% 완료` : '진행 중인 프로젝트가 없습니다.'}
                </p>
                <button className="mt-4 rounded-full bg-white/80 px-4 py-2 text-sm font-semibold text-primary dark:bg-slate-900/60">
                  전용 채팅 열기
                </button>
              </div>
              <div className="rounded-2xl bg-slate-50 p-5 text-slate-700 dark:bg-slate-900/40 dark:text-slate-200">
                <p className="text-sm font-semibold">최근 공개 자료</p>
                <ul className="mt-3 space-y-2 text-sm">
                  {resources.map((resource) => (
                    <li key={resource.id}>
                      Week {resource.weekNumber} · {resource.class?.name ?? ''} · {resource.title}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
        <DashboardNotificationsPanel />
      </section>
    </div>
  );
}
