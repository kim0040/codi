import { FormattedDate } from '@/components/formatted-date';

type ActivityItem = {
  id: string;
  projectTitle: string;
  actor?: string | null;
  message: string;
  createdAt: string;
};

export function ProjectActivityFeed({ items }: { items: ActivityItem[] }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm dark:border-slate-800 dark:bg-white/5">
      <p className="text-xs font-semibold uppercase tracking-[0.4em] text-primary">Activity</p>
      <h3 className="mt-1 text-lg font-semibold text-slate-900 dark:text-white">최근 로그</h3>
      <ul className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-300">
        {items.length === 0 ? <li className="text-xs text-slate-500">아직 기록이 없습니다.</li> : null}
        {items.map((item) => (
          <li key={item.id} className="rounded-2xl border border-slate-100/80 p-3 dark:border-slate-700">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">{item.projectTitle}</p>
            <p className="mt-1 font-semibold text-slate-900 dark:text-white">{item.message}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {item.actor ?? '시스템'} · <FormattedDate value={item.createdAt} />
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
