import Link from 'next/link';
import { prisma } from '@/lib/prisma';

export default async function ClassesPage() {
  const classes = await prisma.class.findMany({ orderBy: { name: 'asc' } });

  return (
    <div className="bg-slate-50/60 py-12 dark:bg-[#050a11]">
      <div className="mx-auto max-w-5xl space-y-8 rounded-3xl border border-slate-200 bg-white/95 p-6 dark:border-slate-800 dark:bg-[#101a28]">
        <header className="space-y-3 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-primary">Classes</p>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">클래스 & 커리큘럼</h1>
          <p className="text-sm text-slate-500 dark:text-slate-300">주차별 공개 일정과 권한 체계를 한 눈에</p>
        </header>
        <div className="overflow-hidden rounded-2xl border border-slate-100 dark:border-slate-800">
          <table className="min-w-full divide-y divide-slate-100 text-sm dark:divide-slate-800">
            <thead className="bg-slate-50/80 text-slate-500 dark:bg-white/5">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">클래스</th>
                <th className="px-4 py-3 text-left font-semibold">레벨</th>
                <th className="px-4 py-3 text-left font-semibold">스케줄</th>
                <th className="px-4 py-3 text-left font-semibold">수강생</th>
                <th className="px-4 py-3 text-left"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {classes.map((klass) => (
                <tr key={klass.id}>
                  <td className="px-4 py-4">
                <p className="font-semibold text-slate-900 dark:text-white">{klass.name}</p>
                    <p className="text-xs text-slate-500">{klass.category}</p>
                  </td>
                  <td className="px-4 py-4 text-slate-600 dark:text-slate-300">{klass.level}</td>
                  <td className="px-4 py-4 text-slate-600 dark:text-slate-300">{klass.schedule}</td>
                  <td className="px-4 py-4 text-slate-600 dark:text-slate-200">{klass.currentStudents ?? 0}명</td>
                  <td className="px-4 py-4 text-right">
                    <Link href={`/classes/${klass.slug}`} className="rounded-full bg-primary/10 px-4 py-2 text-xs font-semibold text-primary">
                      상세 보기
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
