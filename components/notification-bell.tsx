'use client';

import { useMemo, useState } from 'react';
import { Bell } from 'lucide-react';
import { useNotifications } from '@/hooks/use-notifications';

const formatRelativeTime = (date: string) => {
  const value = new Date(date).getTime();
  const diff = value - Date.now();
  const rtf = new Intl.RelativeTimeFormat('ko', { numeric: 'auto' });
  const minutes = Math.round(diff / (1000 * 60));
  if (Math.abs(minutes) < 60) {
    return rtf.format(minutes, 'minute');
  }
  const hours = Math.round(minutes / 60);
  if (Math.abs(hours) < 24) {
    return rtf.format(hours, 'hour');
  }
  const days = Math.round(hours / 24);
  return rtf.format(days, 'day');
};

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const { items, loading, markAsRead, unreadCount, fetchNotifications, hasSession } = useNotifications();
  const relativeTimes = useMemo(() => items.map((item) => formatRelativeTime(item.createdAt)), [items]);

  if (!hasSession) {
    return null;
  }

  return (
    <div className="relative">
      <button
        type="button"
        className="relative rounded-full border border-slate-200 p-2 text-slate-600 transition hover:border-primary hover:text-primary dark:border-slate-700 dark:text-slate-300"
        onClick={() => {
          setOpen((prev) => !prev);
          if (!open) {
            fetchNotifications().catch(() => undefined);
          }
        }}
      >
        <Bell className="size-4" />
        {unreadCount > 0 ? (
          <span className="absolute -right-1 -top-1 inline-flex h-4 min-w-[16px] items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-white">
            {unreadCount}
          </span>
        ) : null}
      </button>
      {open ? (
        <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-slate-200 bg-white p-4 text-sm shadow-lg dark:border-slate-700 dark:bg-[#101623]">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">알림</p>
            <button
              type="button"
              className="text-xs font-semibold text-slate-500 underline"
              onClick={() => markAsRead()}
            >
              모두 읽음
            </button>
          </div>
          <div className="mt-3 space-y-3">
            {loading ? <p className="text-xs text-slate-500">불러오는 중...</p> : null}
            {!loading && items.length === 0 ? <p className="text-xs text-slate-500">새로운 알림이 없습니다.</p> : null}
            {items.map((item, index) => (
              <div key={item.id} className="rounded-2xl border border-slate-100/70 p-3 dark:border-slate-700">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>{relativeTimes[index]}</span>
                  {!item.readAt ? (
                    <button type="button" className="text-primary" onClick={() => markAsRead(item.id)}>
                      읽음처리
                    </button>
                  ) : null}
                </div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">{item.title}</p>
                <p className="text-xs text-slate-500 dark:text-slate-300">{item.message}</p>
                {item.link ? (
                  <a href={item.link} className="text-xs font-semibold text-primary" onClick={() => setOpen(false)}>
                    바로가기
                  </a>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
