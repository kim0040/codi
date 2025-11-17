import type { ReactNode } from 'react';
import { DashboardSidebar } from '@/components/dashboard-sidebar';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-slate-50/60 py-10 dark:bg-[#050a11]">
      <div className="mx-auto flex max-w-6xl gap-6 px-4">
        <DashboardSidebar />
        <div className="flex-1">
          <div className="rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-lg shadow-slate-200/50 dark:border-slate-800 dark:bg-[#101a28]">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
