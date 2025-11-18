import type { CalendarDay } from '@/lib/attendance';

const weekdayLabels = ['일', '월', '화', '수', '목', '금', '토'];

const statusClasses: Record<string, string> = {
  입실: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-200',
  지각: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-200',
  퇴실: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-200'
};

const formatDayNumber = (isoDate: string) => Number(isoDate.split('-')[2]);

export function AttendanceCalendar({ days, title }: { days: CalendarDay[]; title?: string }) {
  if (!days.length) return null;
  const firstDate = new Date(days[0].date);
  const firstWeekday = firstDate.getDay();
  const placeholders = Array.from({ length: firstWeekday }).map((_, index) => <div key={`empty-${index}`} />);

  return (
    <div className="rounded-3xl border border-slate-100 bg-white/80 p-6 dark:border-slate-800 dark:bg-white/5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">Attendance</p>
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-300">{title ?? '출석 캘린더'}</p>
        </div>
        <p className="text-xs text-slate-400 dark:text-slate-500">
          {firstDate.getFullYear()}년 {firstDate.getMonth() + 1}월
        </p>
      </div>
      <div className="mt-4 grid grid-cols-7 gap-2 text-center text-xs font-semibold text-slate-500 dark:text-slate-400">
        {weekdayLabels.map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>
      <div className="mt-2 grid grid-cols-7 gap-2 text-sm">
        {placeholders}
        {days.map((day) => {
          const dayNumber = formatDayNumber(day.date);
          const status = day.status;
          const badgeClass = status ? statusClasses[status] ?? 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-200' : '';
          return (
            <div key={day.date} className="rounded-2xl border border-slate-100 p-2 text-center dark:border-slate-800">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">{dayNumber}</p>
              {status ? <p className={`mt-1 rounded-full px-2 py-0.5 text-[11px] ${badgeClass}`}>{status}</p> : <span className="text-[11px] text-slate-400">-</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
