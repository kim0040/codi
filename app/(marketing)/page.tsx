import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';
import { ArrowRight, School, MessageSquare, CodeXml } from 'lucide-react';

export const dynamic = 'force-dynamic';

// Helper function to format date
const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
};

// Feature data from the template
const features = [
  {
    icon: School,
    title: '통합 학습 관리 시스템',
    description: 'LMS를 통해 학습 진행 상황과 출결을 한번에 관리합니다.',
  },
  {
    icon: MessageSquare,
    title: '실시간 학생/학부모 소통',
    description: '전용 커뮤니케이션 채널로 언제나 원활하게 소통하세요.',
  },
  {
    icon: CodeXml,
    title: '프로젝트 기반 학습',
    description: '실제 프로젝트를 수행하며 실무 역량을 강화합니다.',
  },
];

async function loadMarketingData() {
  const [newsResult, testimonialsResult] = await Promise.allSettled([
    prisma.newsItem.findMany({ orderBy: { publishedAt: 'desc' }, take: 3 }),
    prisma.testimonial.findMany({ take: 2 }),
  ]);

  if (newsResult.status === 'rejected' || testimonialsResult.status === 'rejected') {
    console.error('Failed to load marketing data', {
      newsError: newsResult.status === 'rejected' ? newsResult.reason : undefined,
      testimonialsError: testimonialsResult.status === 'rejected' ? testimonialsResult.reason : undefined,
    });
  }

  return {
    news: newsResult.status === 'fulfilled' ? newsResult.value : [],
    testimonials: testimonialsResult.status === 'fulfilled' ? testimonialsResult.value : [],
  };
}

export default async function MarketingPage() {
  const { news, testimonials } = await loadMarketingData();

  return (
    <main className="flex-1">
      {/* Hero Section */}
      <div className="relative py-20 sm:py-28 lg:py-36 bg-gradient-to-b from-background-light to-white dark:from-[#0f1923] dark:to-[#0b121b]">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-repeat opacity-5 dark:opacity-10"></div>
        <div className="relative flex min-h-[480px] flex-col gap-6 items-center justify-center text-center px-4">
          <div className="flex flex-col gap-4 max-w-3xl">
            <h1 className="text-gray-900 dark:text-white text-4xl font-black leading-tight tracking-tighter sm:text-5xl lg:text-6xl">
              미래를 코딩하다, <br />
              <span className="text-primary">코딩메이커 아카데미</span>
            </h1>
            <h2 className="text-secondary dark:text-gray-400 text-base font-normal leading-normal sm:text-lg lg:text-xl">
              통합 학습 관리(LMS), 실시간 소통, 프로젝트 기반 학습을 통해 최고의 코딩 전문가로 성장하세요.
            </h2>
          </div>
          <Link
            href="/#contact"
            className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 sm:h-14 sm:px-6 bg-primary text-white text-base font-bold leading-normal tracking-[0.015em] sm:text-lg transition hover:-translate-y-0.5 shadow-lg shadow-primary/30"
          >
            <span className="truncate">상담 신청하기</span>
          </Link>
        </div>
      </div>

      {/* Feature Section */}
      <div className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-12">
            <div className="flex flex-col gap-4 text-center">
              <h2 className="text-gray-900 dark:text-white tracking-tight text-3xl font-bold leading-tight sm:text-4xl">코딩메이커 아카데미의 강점</h2>
              <p className="text-secondary dark:text-gray-400 text-base font-normal leading-normal max-w-2xl mx-auto">
                우리는 체계적인 관리와 실무 중심의 교육으로 당신의 성공적인 미래를 만듭니다.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <div key={index} className="flex flex-1 gap-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-background-dark p-6 flex-col items-start text-left transition hover:-translate-y-1 hover:shadow-lg">
                  <div className="text-primary bg-primary/10 p-3 rounded-lg text-3xl">
                    <feature.icon className="size-8" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <h3 className="text-gray-900 dark:text-white text-lg font-bold leading-tight">{feature.title}</h3>
                    <p className="text-secondary dark:text-gray-400 text-sm font-normal leading-normal">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Latest News & Events Section */}
      {news.length > 0 && (
        <div className="py-16 sm:py-24 bg-white dark:bg-background-dark">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center pb-8">
              <h2 className="text-gray-900 dark:text-white text-3xl font-bold leading-tight tracking-tight">최신 소식 및 이벤트</h2>
              <Link href="/community" className="text-primary text-sm font-bold flex items-center gap-1">
                더보기 <ArrowRight className="text-base" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {news.map((item) => (
                <Link key={item.id} href={`/community/post/${item.id}`} className="flex flex-col gap-3 group">
                  <div className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-lg overflow-hidden border dark:border-gray-800">
                    <Image
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      alt={item.title}
                      src={item.imageUrl || `https://source.unsplash.com/random/400x225?coding,${item.id}`}
                      width={400}
                      height={225}
                    />
                  </div>
                  <div>
                    <p className="text-gray-900 dark:text-white text-base font-bold leading-normal">{item.title}</p>
                    <p className="text-secondary dark:text-gray-400 text-sm font-normal leading-normal">{formatDate(item.publishedAt)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Testimonials Section */}
      {testimonials.length > 0 && (
        <section className="py-16 sm:py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-6 text-center">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">팀과 학부모가 직접 전하는 변화</h2>
            </div>
            <div className="mt-10 grid gap-6 md:grid-cols-1">
                {testimonials.map((story) => (
                  <figure key={story.id} className="rounded-2xl border border-slate-200/80 bg-white/80 p-6 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-[#111a24]">
                    <blockquote className="text-base text-slate-700 dark:text-slate-300">“{story.quote}”</blockquote>
                    <figcaption className="mt-4 text-sm font-semibold text-slate-900 dark:text-white">
                      {story.person} · {story.role}
                    </figcaption>
                  </figure>
                ))}
            </div>
          </div>
        </section>
      )}

      {/* Call to Action (CTA) Banner */}
      <div id="contact" className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-primary/90 rounded-xl p-8 md:p-12 text-center text-white shadow-2xl shadow-primary/20">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">지금 바로 시작하세요!</h2>
            <p className="max-w-2xl mx-auto mb-6 text-white/90">
              상담 신청을 통해 코딩 전문가로의 첫걸음을 내딛어 보세요. 당신의 미래를 함께 만들겠습니다.
            </p>
            <a
              href="https://blog.naver.com/kkj0201"
              target="_blank"
              rel="noreferrer"
              className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-accent text-gray-900 text-base font-bold leading-normal tracking-[0.015em] mx-auto transition hover:scale-105"
            >
              <span className="truncate">상담 신청하기</span>
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
