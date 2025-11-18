import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { ROLE_LABELS } from '@/lib/rbac';
import { sanitizeHtml } from '@/lib/sanitize-html';

export async function GET(request: Request, { params }: { params: { postId: string } }) {
  const comments = await prisma.communityComment.findMany({
    where: { postId: params.postId },
    orderBy: { createdAt: 'asc' }
  });
  return NextResponse.json(comments);
}

export async function POST(request: Request, { params }: { params: { postId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (!body?.content?.trim()) {
    return NextResponse.json({ error: '내용을 입력하세요.' }, { status: 400 });
  }

  const authorName = session.user.name ?? session.user.userTag ?? '익명';
  const authorRole = ROLE_LABELS[session.user.role] ?? session.user.role;

  const sanitized = sanitizeHtml(body.content);

  const comment = await prisma.communityComment.create({
    data: {
      postId: params.postId,
      content: sanitized,
      authorName,
      authorRole
    }
  });

  await prisma.communityPost.update({
    where: { id: params.postId },
    data: { commentCount: { increment: 1 } }
  });

  return NextResponse.json(comment, { status: 201 });
}
