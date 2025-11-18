import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
  }

  await prisma.notification.updateMany({
    where: { id: params.id, OR: [{ userId: session.user.id }, { userId: null }] },
    data: { readAt: new Date() }
  });

  return NextResponse.json({ success: true });
}
