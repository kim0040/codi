import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { CommunityCommentList } from '@/components/community-comment-list';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

const formatDate = (value: Date) => format(value, 'yyyy-MM-dd HH:mm', { locale: ko });

export default async function CommunityDetailPage({ params }: { params: { id: string } }) {
  const post = await prisma.communityPost.findUnique({ where: { id: params.id } });
  if (!post) {
    notFound();
  }

  return (
    <div className="bg-slate-50/60 py-12 dark:bg-[#050a11]">
      <div className="mx-auto max-w-4xl space-y-6 rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-lg dark:border-slate-800 dark:bg-[#101a28]">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-primary">{post.category}</p>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{post.title}</h1>
          <p className="text-sm text-slate-500 dark:text-slate-300">{post.authorName} · {post.authorRole} · {formatDate(post.createdAt)}</p>
        </div>
        <article className="prose max-w-none dark:prose-invert" dangerouslySetInnerHTML={{ __html: post.content }} />
        <CommunityCommentList postId={post.id} />
      </div>
    </div>
  );
}
