import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { AUDIENCES } from '@/lib/constants';
import { roleToAudience } from '@/lib/rbac';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json([]);
  }

  const roleAudience = roleToAudience(session.user.role);

  const notifications = await prisma.notification.findMany({
    where: {
      OR: [
        { userId: session.user.id },
        { audience: roleAudience },
        { audience: AUDIENCES.GENERAL }
      ]
    },
    orderBy: { createdAt: 'desc' },
    take: 10
  });

  return NextResponse.json(notifications);
}

export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (!body?.ids) {
    return NextResponse.json({ error: '알림 ID가 필요합니다.' }, { status: 400 });
  }

  await prisma.notification.updateMany({
    where: {
      id: { in: body.ids as string[] },
      OR: [{ userId: session.user.id }, { userId: null }]
    },
    data: { readAt: new Date() }
  });

  return NextResponse.json({ success: true });
}
