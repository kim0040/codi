import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';

const formatDateTime = (value: Date) =>
  new Intl.DateTimeFormat('ko', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).format(value);

export async function generateStaticParams() {
  const classes = await prisma.class.findMany({ select: { slug: true } });
  return classes.map((klass) => ({ id: klass.slug }));
}

export default async function ClassDetailPage({ params }: { params: { id: string } }) {
  const klass = await prisma.class.findUnique({
    where: { slug: params.id },
    include: { curriculums: { orderBy: { weekNumber: 'asc' } } }
  });

  if (!klass) {
    notFound();
  }

  const tags = klass.tags ? klass.tags.split(',').map((tag) => tag.trim()).filter(Boolean) : [];

  return (
    <div className="bg-slate-50/60 py-12 dark:bg-[#050a11]">
      <div className="mx-auto max-w-5xl space-y-8 rounded-3xl border border-slate-200 bg-white/95 p-6 dark:border-slate-800 dark:bg-[#101a28]">
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-primary">Curriculum</p>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">{klass.name}</h1>
          <p className="text-sm text-slate-500 dark:text-slate-300">{klass.highlight}</p>
          <div className="flex flex-wrap gap-2 text-xs font-semibold">
            <span className="rounded-full bg-primary/10 px-3 py-1 text-primary">{klass.level}</span>
            {tags.map((tag) => (
              <span key={tag} className="rounded-full bg-slate-100 px-3 py-1 text-slate-700 dark:bg-slate-900/40 dark:text-slate-200">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-5 text-sm text-slate-600 dark:border-slate-800 dark:bg-white/5 dark:text-slate-300">
            <p>스케줄 · {klass.schedule}</p>
            <p>수강료 · {klass.cost ? `${klass.cost.toLocaleString()}원` : '문의'}</p>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-5 dark:border-slate-800 dark:bg-white/5">
            <p className="text-sm text-slate-600 dark:text-slate-300">
              PlanetScale + Prisma 조합으로 안정적인 데이터를 관리하며, Cloudinary로 학습 자료를 배포합니다. SQLite로 빠르게 테스트 후 MySQL로 전환할 수 있도록 설계했습니다.
            </p>
          </div>
        </div>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">커리큘럼 & 공개일</h2>
          <div className="space-y-3">
            {klass.curriculums.map((item) => (
              <div key={item.id} className="rounded-2xl border border-slate-100 bg-white/90 p-4 dark:border-slate-800 dark:bg-white/5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Week {item.weekNumber}</p>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{item.title}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-300">{item.summary}</p>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">{item.status}</span>
                    <p className="text-xs text-slate-500">공개 {formatDateTime(item.openDate)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
