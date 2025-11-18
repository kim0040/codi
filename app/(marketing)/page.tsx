import Link from 'next/link';
import { ArrowRight, ClipboardCheck, Cpu, PenSquare, Users } from 'lucide-react';
import { METRIC_TYPES } from '@/lib/constants';
import { prisma } from '@/lib/prisma';

const iconMap = {
  Embedded: Cpu,
  Creative: PenSquare,
  Certification: ClipboardCheck,
  'Family Portal': Users
};

const features = [
  {
    title: '코딩·임베디드 전문 과정',
    description: 'C언어, 회로, 임베디드 시스템을 23년 경력 강사가 소수 정예로 지도합니다.',
    pill: 'Embedded'
  },
  {
    title: '창작 메이커 스튜디오',
    description: '웹툰·3D 프린터·클립스튜디오 등 실습 장비를 활용해 실무형 포트폴리오를 만듭니다.',
    pill: 'Creative'
  },
  {
    title: '컴활/자격 단기 특강',
    description: '컴퓨터활용능력 2급 실기 4주 집중반으로 직장인·고등생 수요를 지원합니다.',
    pill: 'Certification'
  },
  {
    title: '맞춤 상담·학부모 소통',
    description: '네이버 블로그/구글폼 상담 → LMS·알림 시스템으로 학사 커뮤니케이션을 자동화합니다.',
    pill: 'Family Portal'
  }
];

const academyInfo = [
  {
    label: '학원 주소',
    value: '전남 광양시 무등길 47 (중동 1549-9)',
    sub: '코딩메이커학원 · 광양 중동 캠퍼스'
  },
  {
    label: '대표 연락처',
    value: '061-745-3355',
    sub: '평일 14:00~19:00 / 토 14:00~17:00'
  },
  {
    label: '공식 채널',
    value: 'www.codingmaker.co.kr',
    sub: '블로그 blog.naver.com/kkj0201 · 인스타 @codingmaker_kj'
  }
];

const formatDate = (value: Date) =>
  new Intl.DateTimeFormat('ko', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(value);

const courses = [
  {
    title: '코딩종합 (중급)',
    audience: '고등 · 취준 · 직장인',
    tuition: '월 150,000원 (1,000분)',
    description: 'C언어, 임베디드, 전자회로 프로젝트 실습'
  },
  {
    title: '컴퓨터그래픽스 (고급)',
    audience: '웹툰·디자인 전공/취미',
    tuition: '월 170,000원 (1,000분)',
    description: '웹툰/인스타툰, 3D 모델링, 클립스튜디오'
  },
  {
    title: '컴활 2급 실기 특강',
    audience: '고등 · 성인',
    tuition: '8회 180,000원',
    description: '4주 집중, 8회 실습, 선착순 소수 정원'
  }
];

const reviewSummary = [
  { label: '강사진 강의력', value: '5.0 / 5.0' },
  { label: '커뮤니케이션', value: '5.0 / 5.0' },
  { label: '시설·환경', value: '5.0 / 5.0' },
  { label: '커리큘럼 자율성', value: '3.0 / 5.0', note: '자기주도·맞춤 중심' }
];

export default async function MarketingPage() {
  const [stats, classes, news, testimonials] = await Promise.all([
    prisma.metric.findMany({ where: { type: METRIC_TYPES.MARKETING } }),
    prisma.class.findMany({ orderBy: { name: 'asc' }, take: 3 }),
    prisma.newsItem.findMany({ orderBy: { publishedAt: 'desc' }, take: 3 }),
    prisma.testimonial.findMany({ take: 2 })
  ]);

  return (
    <div className="bg-gradient-to-b from-background-light to-white dark:from-[#0f1923] dark:to-[#0b121b]">
      <section id="about" className="relative mx-auto max-w-6xl px-4 pb-20 pt-16 sm:pt-24">
        <div className="mx-auto max-w-4xl text-center">
          <p className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            CodingMaker Academy Hub
          </p>
          <h1 className="mt-6 text-4xl font-black tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-[56px]">
            광양 중동 코딩메이커학원의 실무 교육을 100% 디지털화
          </h1>
          <p className="mt-6 text-lg text-slate-600 dark:text-slate-300">
            전남 광양시 무등길 47에 위치한 코딩·임베디드·창작 메이커 전문 학원의 상담, 출석, 커리큘럼, 커뮤니티를 Next.js 허브로 통합했습니다.
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
          <p className="mt-4 text-sm text-slate-500 dark:text-slate-300">
            상담 061-745-3355 · 평일 14:00~19:00 / 토 14:00~17:00 · www.codingmaker.co.kr
          </p>
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

      <section id="courses" className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-[#111a24]">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-primary">Review & Trust</p>
            <h2 className="mt-3 text-2xl font-bold text-slate-900 dark:text-white">학생 추천율 100%</h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-300">
              컴퓨터 시설과 실무 강사진 덕분에 후기 평균 5점 만점을 기록했습니다. 커리큘럼은 자율도가 높아 자기주도 학습을 선호하는 학생일수록 만족도가 큽니다.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {reviewSummary.map((item) => (
                <div key={item.label} className="rounded-2xl border border-slate-100/70 bg-slate-50/80 p-4 text-center dark:border-slate-800 dark:bg-white/5">
                  <p className="text-xs font-semibold text-primary">{item.label}</p>
                  <p className="mt-2 text-xl font-bold text-slate-900 dark:text-white">{item.value}</p>
                  {item.note ? <p className="text-xs text-slate-500 dark:text-slate-400">{item.note}</p> : null}
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-primary/10 to-blue-500/10 p-8 dark:border-slate-800 dark:from-primary/10 dark:to-blue-500/10">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-primary">상담/신청 가이드</p>
            <h2 className="mt-3 text-2xl font-bold text-slate-900 dark:text-white">블로그 · 구글폼으로 빠르게 상담</h2>
            <ul className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-200">
              <li>네이버 블로그(kkj0201)에서 최신 모집 공지 확인</li>
              <li>구글폼 상담 신청 → 담당 멘토가 맞춤 커리큘럼 제안</li>
              <li>실습 과정은 재료비(3D 프린터, 전자키트 등) 별도 청구</li>
              <li>학부모/직장인 대상 야간·주말 반 상시 운영</li>
            </ul>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                href="https://blog.naver.com/kkj0201"
                target="_blank"
                rel="noreferrer"
                className="inline-flex flex-1 items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white"
              >
                네이버 블로그 보기
              </Link>
              <Link
                href="https://www.instagram.com/codingmaker_kj/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex flex-1 items-center justify-center rounded-full border border-white/30 bg-white/20 px-6 py-3 text-sm font-semibold text-primary"
              >
                인스타그램 팔로우
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-[#111a24]">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-primary">About CodingMaker</p>
            <h2 className="mt-3 text-2xl font-bold text-slate-900 dark:text-white">광양 중동 실학습 환경</h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-300">
              코딩메이커학원은 전남 광양시 무등길 47(중동)에 위치한 실무형 IT·디지털 창작 전문 학원입니다. 23년 경력의 임베디드 강사진과 20년 차 웹툰 작가가 직접 수업을 진행하며, 평일 14~19시·토요일 14~17시에 상담을 운영합니다.
            </p>
            <div className="mt-6 space-y-4">
              {academyInfo.map((info) => (
                <div key={info.label} className="rounded-2xl border border-slate-100/70 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-white/5">
                  <p className="text-xs font-semibold text-primary">{info.label}</p>
                  <p className="text-lg font-semibold text-slate-900 dark:text-white">{info.value}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-300">{info.sub}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-[#0f1923]">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-primary">Course Highlights</p>
            <h2 className="mt-3 text-2xl font-bold text-slate-900 dark:text-white">소수 정예 커리큘럼 & 수강료</h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-300">
              클래스당 5~9명, 장기 과정 위주로 운영되며 실습 장비·재료비가 포함됩니다. 필요 시 구글폼으로 맞춤 상담을 진행합니다.
            </p>
            <div className="mt-6 space-y-3">
              {courses.map((course) => (
                <div key={course.title} className="rounded-2xl border border-slate-100/70 p-4 text-sm text-slate-600 dark:border-slate-700 dark:text-slate-300">
                  <p className="text-base font-semibold text-slate-900 dark:text-white">{course.title}</p>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">{course.audience}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{course.description}</p>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{course.tuition}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="news" className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
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

      <section id="contact" className="mx-auto max-w-6xl px-4 pb-24 pt-8">
        <div className="rounded-3xl bg-gradient-to-r from-primary to-blue-600 px-10 py-12 text-white shadow-2xl">
          <div className="grid gap-6 lg:grid-cols-2">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.4em] text-white/70">Contact</p>
              <h2 className="mt-2 text-3xl font-bold">코딩메이커학원은 자체 제작 플랫폼으로 운영합니다</h2>
              <p className="mt-2 text-sm text-white/80">
                LMS, 프로젝트, 키오스크까지 모두 직접 개발해 학습 데이터를 안전하게 관리합니다. 상담과 견적 문의는 아래 채널에서 바로 확인할 수 있습니다.
              </p>
            </div>
            <div className="space-y-3 text-sm">
              <p>대표 전화: <a href="tel:061-745-3355" className="font-semibold text-white underline">061-745-3355</a></p>
              <p>학원 주소: 전남 광양시 무등길 47 (중동 1549-9)</p>
              <p>상담 채널: 네이버 블로그(kkj0201) · 공식 홈페이지 www.codingmaker.co.kr</p>
              <p>운영 시간: 평일 14:00~19:00 / 토요일 14:00~17:00</p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link href="https://blog.naver.com/kkj0201" target="_blank" rel="noreferrer" className="inline-flex items-center justify-center rounded-full bg-white/15 px-6 py-3 font-semibold text-white backdrop-blur hover:bg-white/25">
                  블로그 상담 바로가기
                </Link>
                <Link href="mailto:contact@codingmaker.kr" className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 font-semibold text-primary">
                  이메일 문의
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
