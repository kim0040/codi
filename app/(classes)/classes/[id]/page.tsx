import { notFound } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { MaterialUploadForm } from '@/components/material-upload-form';
import { AttachmentList } from '@/components/attachment-list';
import { authOptions } from '@/lib/auth';
import { USER_ROLES, isRoleAllowed } from '@/lib/rbac';

type Attachment = {
  name: string;
  url: string;
  uploadedAt?: string;
  uploaderId?: string;
};

const formatDateTime = (value: Date) =>
  new Intl.DateTimeFormat('ko', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).format(value);

const classMeta = {
  'frontend-immersive': {
    tagline: '코딩종합 (중급)',
    tuition: '월 150,000원 / 1,000분',
    highlights: ['C언어·임베디드 베이스', '회로/전자 실습 장비 완비', '야간·주말반 운영']
  },
  'ai-modeling': {
    tagline: '하드코딩 (고급)',
    tuition: '월 170,000원 / 1,000분',
    highlights: ['직장인도 수강 가능한 집중 코스', '프로젝트 기반 임베디드 시스템', '전문가 1:5 내외 지도']
  },
  'creative-beginner': {
    tagline: '컴퓨터그래픽스 & 창작 메이커',
    tuition: '월 170,000원 / 1,000분',
    highlights: ['웹툰·3D 프린터·클립스튜디오', '창작자(20년 경력) 직접 코칭', '3D 프린터/재료비 별도 안내']
  }
} as const;

const defaultMeta = {
  tagline: '맞춤 커리큘럼 상담',
  tuition: '상담 문의',
  highlights: ['학생 수준에 맞춘 개인별 플랜', '구글폼 상담 → LMS 등록', '실습 재료비는 상담 시 공지']
};

const facilityHighlights = [
  '광양시 중동 5~9명 소수 정예, 자기주도형 학습 문화',
  '네이버 블로그/구글폼 상담 → LMS 게시판·알림으로 이어지는 커뮤니케이션',
  '컴퓨터·전자 장비 완비, 실습 재료비는 과정별로 별도청구'
];

export async function generateStaticParams() {
  const classes = await prisma.class.findMany({ select: { slug: true } });
  return classes.map((klass) => ({ id: klass.slug }));
}

export default async function ClassDetailPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const klass = await prisma.class.findUnique({
    where: { slug: params.id },
    include: { curriculums: { orderBy: { weekNumber: 'asc' } } }
  });

  if (!klass) {
    notFound();
  }

  const tags = klass.tags ? klass.tags.split(',').map((tag) => tag.trim()).filter(Boolean) : [];
  const meta = classMeta[klass.slug as keyof typeof classMeta] ?? defaultMeta;
  const canManage = isRoleAllowed(session?.user.role, [USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN]);

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
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">수업 정보</p>
            <p className="mt-2 text-base font-semibold text-slate-900 dark:text-white">{meta.tagline}</p>
            <p>스케줄 · {klass.schedule}</p>
            <p>수강료 · {meta.tuition}</p>
            <p>현재 수강생 · {klass.currentStudents ?? 0}명</p>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-5 dark:border-slate-800 dark:bg-white/5">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">강사진 & 실습 포인트</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600 dark:text-slate-300">
              {meta.highlights.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        <section className="rounded-3xl border border-slate-100 bg-white/90 p-6 text-sm text-slate-600 dark:border-slate-800 dark:bg-white/5 dark:text-slate-300">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">시설 & 상담 안내</p>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            {facilityHighlights.map((item) => (
              <div key={item} className="rounded-2xl border border-slate-100/70 bg-slate-50/70 p-4 dark:border-slate-700 dark:bg-slate-900/30">
                {item}
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">상담은 061-745-3355 혹은 블로그·구글폼으로 예약 후 진행됩니다.</p>
        </section>

        <MaterialUploadForm
          classSlug={klass.slug}
          weeks={klass.curriculums.map((item) => ({ id: item.id, title: item.title, weekNumber: item.weekNumber }))}
        />

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">커리큘럼 & 공개일</h2>
          <div className="space-y-3">
            {klass.curriculums.map((item) => {
              const attachments: Attachment[] = item.files ? JSON.parse(item.files) : [];
              return (
                <div key={item.id} className="rounded-2xl border border-slate-100 bg-white/90 p-4 dark:border-slate-800 dark:bg-white/5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Week {item.weekNumber}</p>
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{item.title}</h3>
                      
                    </div>
                    <div className="text-right">
                      <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">{item.status}</span>
                      <p className="text-xs text-slate-500">공개 {formatDateTime(item.openDate)}</p>
                    </div>
                  </div>
                  <AttachmentList classSlug={klass.slug} weekId={item.id} items={attachments} canDelete={canManage} />
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
