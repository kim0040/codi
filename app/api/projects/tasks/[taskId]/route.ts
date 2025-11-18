import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { AUDIENCES, NOTIFICATION_TYPES } from '@/lib/constants';
import { canAccessProject } from '@/lib/project-access';

export async function PATCH(request: Request, { params }: { params: { taskId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
  }

  const task = await prisma.projectTask.findUnique({ where: { id: params.taskId } });
  if (!task) {
    return NextResponse.json({ error: '작업을 찾을 수 없습니다.' }, { status: 404 });
  }

  const permitted = await canAccessProject(task.projectId, session.user.id, session.user.role);
  if (!permitted) {
    return NextResponse.json({ error: '이 프로젝트에 대한 권한이 없습니다.' }, { status: 403 });
  }

  const body = await request.json().catch(() => ({}));
  const data: Record<string, unknown> = {};
  if (body.title) data.title = body.title;
  if (body.owner) data.owner = body.owner;
  if (body.column) data.column = body.column;
  if (body.dueDate) data.dueDate = new Date(body.dueDate);

  const updated = await prisma.projectTask.update({ where: { id: params.taskId }, data });

  if (body.column && body.column !== task.column) {
    await prisma.projectLog.create({
      data: {
        projectId: task.projectId,
        userId: session.user.id,
        message: `${session.user.name ?? session.user.userTag}님이 "${task.title}" 작업을 ${body.column} 열로 이동했습니다.`
      }
    });
  }

  return NextResponse.json(updated);
}

export async function DELETE(request: Request, { params }: { params: { taskId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
  }

  const task = await prisma.projectTask.findUnique({ where: { id: params.taskId } });
  if (!task) {
    return NextResponse.json({ error: '작업을 찾을 수 없습니다.' }, { status: 404 });
  }

  const permitted = await canAccessProject(task.projectId, session.user.id, session.user.role);
  if (!permitted) {
    return NextResponse.json({ error: '이 프로젝트에 대한 권한이 없습니다.' }, { status: 403 });
  }

  await prisma.projectTask.delete({ where: { id: params.taskId } });

  await prisma.notification.create({
    data: {
      title: '프로젝트 작업 업데이트',
      message: `${session.user.name ?? session.user.userTag}님이 "${task.title}" 작업을 삭제했습니다.`,
      audience: AUDIENCES.ADMIN,
      category: NOTIFICATION_TYPES.PROJECT,
      link: '/projects'
    }
  });

  return NextResponse.json({ success: true });
}
