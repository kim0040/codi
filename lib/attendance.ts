import type { AttendanceLog } from '@prisma/client';

export type CalendarDay = {
  date: string;
  status?: string;
};

const STATUS_LABEL: Record<string, string> = {
  CHECK_IN: '입실',
  CHECK_OUT: '퇴실',
  LATE: '지각'
};

const formatDayKey = (value: Date) => value.toISOString().split('T')[0];

export function buildMonthlyCalendar(logs: Array<Pick<AttendanceLog, 'checkInTime' | 'status'>>, targetDate = new Date()): CalendarDay[] {
  const year = targetDate.getFullYear();
  const month = targetDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const recordMap = new Map<string, string>();

  logs.forEach((log) => {
    const dateKey = formatDayKey(new Date(log.checkInTime));
    if (!recordMap.has(dateKey)) {
      recordMap.set(dateKey, STATUS_LABEL[log.status] ?? log.status);
    }
  });

  const days: CalendarDay[] = [];
  for (let day = 1; day <= daysInMonth; day += 1) {
    const date = new Date(year, month, day);
    const key = formatDayKey(date);
    days.push({ date: key, status: recordMap.get(key) });
  }

  return days;
}
