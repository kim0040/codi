import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { USER_ROLES } from '@/lib/rbac';

export async function POST(request: Request, { params }: { params: { slug: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || ![USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN].includes(session.user.role)) {
    return NextResponse.json({ error: '자료 업로드 권한이 없습니다.' }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: '잘못된 요청입니다.' }, { status: 400 });
  }

  const { weekId, file } = body as { weekId?: string; file?: { name?: string; url?: string; publicId?: string; size?: number } };

  if (!weekId || !file?.name || !file.url) {
    return NextResponse.json({ error: 'weekId, 파일 이름, URL이 필요합니다.' }, { status: 400 });
  }

  const klass = await prisma.class.findUnique({ where: { slug: params.slug } });
  if (!klass) {
    return NextResponse.json({ error: '클래스를 찾을 수 없습니다.' }, { status: 404 });
  }

  const week = await prisma.curriculumWeek.findUnique({ where: { id: weekId } });
  if (!week || week.classId !== klass.id) {
    return NextResponse.json({ error: '커리큘럼 주차를 찾을 수 없습니다.' }, { status: 404 });
  }

  const existing = week.files ? (JSON.parse(week.files) as Array<Record<string, unknown>>) : [];
  const entry = {
    id: crypto.randomUUID(),
    name: file.name,
    url: file.url,
    publicId: file.publicId,
    size: file.size,
    uploadedAt: new Date().toISOString(),
    uploaderId: session.user.id
  };
  existing.push(entry);

  await prisma.curriculumWeek.update({
    where: { id: week.id },
    data: { files: JSON.stringify(existing) }
  });

  return NextResponse.json(entry, { status: 201 });
}
