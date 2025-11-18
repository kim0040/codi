import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { canAccessProject } from '@/lib/project-access';

export async function POST(request: Request, { params }: { params: { slug: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
  }

  const { title, owner, dueDate, column } = await request.json().catch(() => ({}));
  if (!title || !owner || !dueDate) {
    return NextResponse.json({ error: '필수 항목을 모두 입력해주세요.' }, { status: 400 });
  }

  const project = await prisma.project.findUnique({ where: { slug: params.slug } });
  if (!project) {
    return NextResponse.json({ error: '프로젝트를 찾을 수 없습니다.' }, { status: 404 });
  }

  const canManage = await canAccessProject(project.id, session.user.id, session.user.role);
  if (!canManage) {
    return NextResponse.json({ error: '작업을 추가할 권한이 없습니다.' }, { status: 403 });
  }

  const task = await prisma.projectTask.create({
    data: {
      projectId: project.id,
      title,
      owner,
      dueDate: new Date(dueDate),
      column: column ?? 'TODO'
    }
  });

  await prisma.projectLog.create({
    data: {
      projectId: project.id,
      userId: session.user.id,
      message: `${session.user.name ?? session.user.userTag}님이 "${title}" 작업을 생성했습니다.`
    }
  });

  return NextResponse.json(task, { status: 201 });
}
