import Link from 'next/link';
import { ArrowRight, BookOpen, MessageSquare, Shield, Users } from 'lucide-react';
import { METRIC_TYPES } from '@/lib/constants';
import { prisma } from '@/lib/prisma';

const iconMap = {
  LMS: BookOpen,
  Attendance: Shield,
  Community: MessageSquare,
  'Family Portal': Users
};

const features = [
  {
    title: '통합 학습 관리',
    description: '클래스/주차별 커리큘럼과 자료를 관리하고 자동 공개 일정까지 설정합니다.',
    pill: 'LMS'
  },
  {
    title: '실시간 출석 키오스크',
    description: '태블릿에 발급된 apiKey만 입력하면 출석이 동기화되고 보호자에게 알림이 전송됩니다.',
    pill: 'Attendance'
  },
  {
    title: '협업형 커뮤니티',
    description: '코드 하이라이팅, 파일 공유, 프로젝트별 스레드로 학생 간의 지식 교류를 강화합니다.',
    pill: 'Community'
  },
  {
    title: '학부모 알림',
    description: '출결, 과제, 상담 내역을 실시간으로 전달하여 학부모와의 신뢰를 높입니다.',
    pill: 'Family Portal'
  }
];

const formatDate = (value: Date) =>
  new Intl.DateTimeFormat('ko', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(value);

export default async function MarketingPage() {
  const [stats, classes, news, testimonials] = await Promise.all([
    prisma.metric.findMany({ where: { type: METRIC_TYPES.MARKETING } }),
    prisma.class.findMany({ orderBy: { name: 'asc' }, take: 3 }),
    prisma.newsItem.findMany({ orderBy: { publishedAt: 'desc' }, take: 3 }),
    prisma.testimonial.findMany({ take: 2 })
  ]);

  return (
    <div className="bg-gradient-to-b from-background-light to-white dark:from-[#0f1923] dark:to-[#0b121b]">
      <section className="relative mx-auto max-w-6xl px-4 pb-20 pt-16 sm:pt-24">
        <div className="mx-auto max-w-4xl text-center">
          <p className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            CodingMaker Academy Hub
          </p>
          <h1 className="mt-6 text-4xl font-black tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-[56px]">
            학원 운영 · 학습관리 · 소통을 하나의 허브에 담았습니다
          </h1>
          <p className="mt-6 text-lg text-slate-600 dark:text-slate-300">
            Next.js 기반의 올인원 플랫폼으로 LMS, 키오스크 출석, 커뮤니티, Git-Lite 프로젝트까지 자동화하세요.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/classes"
              className="inline-flex items-center justify-center rounded-full bg-primary px-8 py-3 text-base font-semibold text-white shadow-lg shadow-primary/30 transition hover:-translate-y-0.5"
            >
              커리큘럼 살펴보기
              <ArrowRight className="ml-2 size-4" />
            </Link>
            <Link
              href="/dashboard/admin"
              className="inline-flex items-center justify-center rounded-full border border-slate-200 px-8 py-3 text-base font-semibold text-slate-700 transition hover:border-primary hover:text-primary dark:border-slate-700 dark:text-slate-200"
            >
              대시보드 체험하기
            </Link>
          </div>
        </div>
        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((item) => (
            <div key={item.id} className="rounded-2xl border border-white/60 bg-white/80 p-6 shadow-lg shadow-primary/5 backdrop-blur-sm dark:border-slate-800 dark:bg-[#132032]">
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">{item.label}</p>
              <p className="mt-3 text-3xl font-black text-slate-900 dark:text-white">{item.value}</p>
              <p className="text-sm text-primary">{item.detail}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
        <div className="flex flex-col gap-6 text-center">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">핵심 기능 한 눈에 보기</h2>
          <p className="text-base text-slate-600 dark:text-slate-300">
            기획서 요구사항을 기준으로 학습, 소통, 운영, 협업의 전 과정을 지원합니다.
          </p>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {features.map((feature) => {
            const Icon = iconMap[feature.pill as keyof typeof iconMap];
            return (
              <div key={feature.title} className="rounded-2xl border border-slate-200/80 bg-white/80 p-6 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-[#111a24]">
                <div className="mb-6 flex items-center gap-3">
                  <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                    {feature.pill}
                  </span>
                  {Icon ? <Icon className="size-4 text-primary" /> : null}
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white">{feature.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.4em] text-primary">Classes</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">주요 클래스 미리보기</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">주차별 커리큘럼과 자동 공개 일정, 수강생 관리 흐름을 반영했습니다.</p>
          </div>
          <Link href="/classes" className="text-sm font-semibold text-primary">
            전체 클래스 보기 →
          </Link>
        </div>
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {classes.map((klass) => (
            <div key={klass.id} className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#131f2e]">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">{klass.level}</p>
                <h3 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">{klass.name}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">{klass.schedule}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600 dark:bg-slate-900/40 dark:text-slate-300">
                <p>수강생 {klass.currentStudents ?? 0}명 · {klass.tags?.split(',')[0] ?? '주요 역량'}</p>
              </div>
              <Link href={`/classes/${klass.slug}`} className="inline-flex items-center text-sm font-semibold text-primary">
                커리큘럼 바로가기 <ArrowRight className="ml-1 size-4" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-[#131f2e]">
            <p className="text-sm font-semibold uppercase tracking-[0.4em] text-primary">Testimonials</p>
            <h2 className="mt-3 text-2xl font-bold text-slate-900 dark:text-white">팀과 학부모가 직접 전하는 변화</h2>
            <div className="mt-6 space-y-6">
              {testimonials.map((story) => (
                <figure key={story.id} className="rounded-2xl border border-slate-100 bg-slate-50/70 p-6 text-left dark:border-slate-800 dark:bg-slate-900/40">
                  <blockquote className="text-base text-slate-700 dark:text-slate-300">“{story.quote}”</blockquote>
                  <figcaption className="mt-4 text-sm font-semibold text-slate-900 dark:text-white">
                    {story.person} · {story.role}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-[#111a24]">
            <p className="text-sm font-semibold uppercase tracking-[0.4em] text-primary">Newsroom</p>
            <h2 className="mt-3 text-2xl font-bold text-slate-900 dark:text-white">이달의 소식</h2>
            <div className="mt-6 space-y-5">
              {news.map((item) => (
                <div key={item.id} className="rounded-2xl border border-slate-100/60 p-4 shadow-sm transition hover:border-primary/30 hover:bg-primary/5 dark:border-slate-800/80 dark:hover:border-primary/60">
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">{formatDate(item.publishedAt)}</p>
                  <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">{item.title}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{item.summary}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-24 pt-8">
        <div className="rounded-3xl bg-gradient-to-r from-primary to-blue-600 px-10 py-12 text-white shadow-2xl">
          <div className="flex flex-col gap-6 text-center lg:flex-row lg:items-center lg:justify-between lg:text-left">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.4em] text-white/70">Next Action</p>
              <h2 className="mt-2 text-3xl font-bold">원터치 설치 패키지로 30분 만에 자체 서버에 배포하세요</h2>
              <p className="mt-2 text-sm text-white/80">Ubuntu 가이드와 install.sh 스크립트를 함께 제공합니다.</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/projects"
                className="inline-flex items-center justify-center rounded-full bg-white/15 px-6 py-3 text-sm font-semibold text-white backdrop-blur hover:bg-white/25"
              >
                프로젝트 허브 보기
              </Link>
              <Link
                href="/community"
                className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-primary"
              >
                커뮤니티 둘러보기
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
