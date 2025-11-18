'use client';

import Link from 'next/link';
import { useNotifications } from '@/hooks/use-notifications';

export function DashboardNotificationsPanel({ title = '알림센터', limit = 5 }: { title?: string; limit?: number }) {
  const { items, loading, markAsRead, unreadCount, hasSession } = useNotifications();
  const visibleItems = items.slice(0, limit);

  if (!hasSession) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-slate-100 bg-white/80 p-5 dark:border-slate-800 dark:bg-white/5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">{title}</p>
          <p className="text-sm text-slate-500 dark:text-slate-300">읽지 않은 알림 {unreadCount}개</p>
        </div>
        <button type="button" className="text-xs font-semibold text-primary" onClick={() => markAsRead()}>
          모두 읽음
        </button>
      </div>
      <div className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-300">
        {loading ? <p className="text-xs text-slate-400">불러오는 중...</p> : null}
        {!loading && visibleItems.length === 0 ? <p className="text-xs text-slate-400">새로운 알림이 없습니다.</p> : null}
        {visibleItems.map((item) => (
          <div key={item.id} className="rounded-2xl border border-slate-100/70 p-4 dark:border-slate-700">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>{new Date(item.createdAt).toLocaleString('ko', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}</span>
              {!item.readAt ? (
                <button type="button" className="text-primary" onClick={() => markAsRead(item.id)}>
                  읽음
                </button>
              ) : null}
            </div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">{item.title}</p>
            <p className="text-xs text-slate-500 dark:text-slate-300">{item.message}</p>
            {item.link ? (
              <Link href={item.link} className="text-xs font-semibold text-primary underline">
                바로가기
              </Link>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
