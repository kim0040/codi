'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSession } from 'next-auth/react';

export type NotificationItem = {
  id: string;
  title: string;
  message: string;
  link: string | null;
  createdAt: string;
  readAt: string | null;
};

export function useNotifications() {
  const { data: session } = useSession();
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = useCallback(async () => {
    if (!session) return;
    setLoading(true);
    try {
      const response = await fetch('/api/notifications');
      if (!response.ok) {
        console.error('알림을 불러오지 못했습니다.');
        return;
      }
      const data = (await response.json()) as NotificationItem[];
      setItems(data);
    } catch (error) {
      console.error('알림 요청 중 오류가 발생했습니다.', error);
    } finally {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    if (session) {
      fetchNotifications().catch(() => undefined);
    }
  }, [session, fetchNotifications]);

  const markAsRead = useCallback(
    async (id?: string) => {
      if (!session) return;
      if (id) {
      await fetch(`/api/notifications/${id}`, { method: 'PATCH' });
    } else {
      const unread = items.filter((item) => !item.readAt).map((item) => item.id);
      if (!unread.length) return;
        await fetch('/api/notifications', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ids: unread })
        });
      }
      fetchNotifications().catch(() => undefined);
    },
    [fetchNotifications, items, session]
  );

  const unreadCount = useMemo(() => items.filter((item) => !item.readAt).length, [items]);

  return { items, loading, fetchNotifications, markAsRead, unreadCount, hasSession: Boolean(session) };
}
