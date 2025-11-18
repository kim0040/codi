import { AUDIENCES } from '@/lib/constants';
import { prisma } from '@/lib/prisma';
import { CommunityPostForm } from '@/components/community-post-form';
import { CommunityPostList } from '@/components/community-post-list';
import Link from 'next/link';

const boardTabs = ['전체', 'LMS 팁', '프로젝트', 'Q&A', '자유'];
const postCategories = boardTabs.filter((tab) => tab !== '전체');

export default async function CommunityPage() {
  const [posts, notices, tags] = await Promise.all([
    prisma.communityPost.findMany({ orderBy: { createdAt: 'desc' } }),
    prisma.announcement.findMany({ where: { audience: AUDIENCES.COMMUNITY }, orderBy: { publishedAt: 'desc' } }),
    prisma.trendingTag.findMany()
  ]);

  return (
    <div className="bg-slate-50/60 py-12 dark:bg-[#050a11]">
      <div className="mx-auto max-w-5xl space-y-8 rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-lg dark:border-slate-800 dark:bg-[#101a28]">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-primary">Community</p>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white">커뮤니티 허브</h1>
            <p className="text-sm text-slate-500 dark:text-slate-300">LMS, 프로젝트, Q&A, 자유게시판을 통합한 협업 공간</p>
          </div>
          <Link href="/projects" className="rounded-full bg-primary px-6 py-2 text-sm font-semibold text-white">
            Git-Lite 보러가기
          </Link>
        </div>
        <div className="flex flex-wrap justify-center gap-3 text-sm">
          {boardTabs.map((tab) => (
            <button key={tab} className="rounded-full border border-slate-200 px-4 py-2 text-slate-600 transition hover:border-primary hover:text-primary dark:border-slate-700 dark:text-slate-300">
              {tab}
            </button>
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-4">
            <CommunityPostForm categories={postCategories} />
            <CommunityPostList posts={posts} categories={postCategories} />
          </div>
          <aside className="space-y-5">
            <div className="rounded-2xl border border-primary/30 bg-primary/5 p-5">
              <h4 className="text-sm font-semibold text-primary">안내</h4>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                {notices.map((notice) => (
                  <li key={notice.id}>• {notice.title}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-5 dark:border-slate-800 dark:bg-white/5">
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white">실시간 태그</h4>
              <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold">
                {tags.map((tag) => (
                  <span key={tag.id} className="rounded-full bg-slate-100 px-3 py-1 text-slate-700 dark:bg-slate-900/40 dark:text-slate-200">
                    {tag.label}
                  </span>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
