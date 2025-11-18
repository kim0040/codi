import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { AUDIENCES, NOTIFICATION_TYPES } from '@/lib/constants';
import { ROLE_LABELS } from '@/lib/rbac';
import { sanitizeHtml } from '@/lib/sanitize-html';

export async function GET() {
  const posts = await prisma.communityPost.findMany({ orderBy: { createdAt: 'desc' }, take: 20 });
  return NextResponse.json(posts);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: '잘못된 요청입니다.' }, { status: 400 });
  }

  const { title, content, category } = body as { title?: string; content?: string; category?: string };
  const plain = content?.replace(/<[^>]+>/g, '').trim();

  if (!title || !content || !category || !plain) {
    return NextResponse.json({ error: '제목, 내용, 카테고리를 모두 입력해주세요.' }, { status: 400 });
  }

  const authorName = session.user.name ?? session.user.userTag ?? '익명';
  const authorRole = ROLE_LABELS[session.user.role] ?? session.user.role;

  const sanitizedContent = sanitizeHtml(content);

  const post = await prisma.communityPost.create({
    data: {
      title,
      content: sanitizedContent,
      category,
      authorName,
      authorRole
    }
  });

  await prisma.notification.create({
    data: {
      title: '새 커뮤니티 글',
      message: `${authorName}님이 "${title}"를 작성했습니다.`,
      audience: AUDIENCES.COMMUNITY,
      category: NOTIFICATION_TYPES.COMMUNITY,
      link: '/community'
    }
  });

  return NextResponse.json(post, { status: 201 });
}
