import { prisma } from '@/lib/prisma';
import { KioskAttendanceForm } from '@/components/kiosk-attendance-form';

const statusColor: Record<string, string> = {
  CHECK_IN: 'bg-emerald-500',
  LATE: 'bg-amber-500',
  CHECK_OUT: 'bg-slate-500'
};

const statusLabel: Record<string, string> = {
  CHECK_IN: '입실',
  LATE: '지각',
  CHECK_OUT: '퇴실'
};

const formatTime = (value: Date) =>
  new Intl.DateTimeFormat('ko', { hour: '2-digit', minute: '2-digit' }).format(value);

export default async function KioskAttendancePage() {
  const [logs, notices] = await Promise.all([
    prisma.attendanceLog.findMany({
      include: { user: true, class: true },
      orderBy: { checkInTime: 'desc' },
      take: 6
    }),
    prisma.kioskNotice.findMany()
  ]);

  return (
    <div className="min-h-[80vh] bg-gradient-to-br from-slate-900 to-slate-950 p-8 text-white">
      <div className="mx-auto max-w-4xl rounded-[36px] border border-white/10 bg-white/5 p-8 shadow-2xl">
        <div className="flex flex-col gap-3 text-center">
          <p className="text-xs uppercase tracking-[0.6em] text-blue-200">Kiosk Attendance</p>
          <h1 className="text-4xl font-black">이름#태그를 입력하세요</h1>
          <p className="text-sm text-blue-100">예: 김현민#0001 · 본인 확인 후 입실/퇴실 버튼을 누르세요.</p>
        </div>

        <KioskAttendanceForm />

        <div className="mt-10 grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
            <h2 className="text-lg font-semibold">최근 기록</h2>
            <div className="mt-4 space-y-3 text-sm">
              {logs.map((item) => (
                <div key={item.id} className="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-3">
                  <div>
                    <p className="font-semibold">{item.user.userTag}</p>
                    <p className="text-xs text-blue-200">
                      {item.class?.name ?? '미배정'} · {statusLabel[item.status] ?? item.status} {formatTime(item.checkInTime)}
                    </p>
                  </div>
                  <span className={`h-3 w-3 rounded-full ${statusColor[item.status] ?? 'bg-slate-500'}`} />
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
            <h2 className="text-lg font-semibold">안내</h2>
            <ul className="mt-4 space-y-2 text-sm text-blue-100">
              {notices.map((notice) => (
                <li key={notice.id}>• {notice.body}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
