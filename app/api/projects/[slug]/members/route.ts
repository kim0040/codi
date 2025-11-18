import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { AUDIENCES, NOTIFICATION_TYPES } from '@/lib/constants';
import { canManageProject } from '@/lib/project-access';

export async function POST(request: Request, { params }: { params: { slug: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
  }

  const project = await prisma.project.findUnique({ where: { slug: params.slug } });
  if (!project) {
    return NextResponse.json({ error: '프로젝트를 찾을 수 없습니다.' }, { status: 404 });
  }

  const canManage = await canManageProject(project.id, session.user.id, session.user.role, true);
  if (!canManage) {
    return NextResponse.json({ error: '프로젝트 멤버 초대 권한이 없습니다.' }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: '잘못된 요청입니다.' }, { status: 400 });
  }

  const { userTag, role = 'Member' } = body as { userTag?: string; role?: string };
  if (!userTag) {
    return NextResponse.json({ error: '초대할 사용자 태그가 필요합니다.' }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { userTag } });
  if (!user) {
    return NextResponse.json({ error: '해당 태그의 사용자가 없습니다.' }, { status: 404 });
  }

  try {
    const member = await prisma.projectMember.create({
      data: {
        projectId: project.id,
        userId: user.id,
        role
      }
    });

    await prisma.notification.create({
      data: {
        title: '프로젝트 초대',
        message: `${project.title} 프로젝트에 초대되었습니다.`,
        userId: user.id,
        category: NOTIFICATION_TYPES.PROJECT,
        link: '/projects',
        audience: AUDIENCES.STUDENT
      }
    });

    return NextResponse.json(member, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: '이미 등록된 멤버이거나 저장 중 오류가 발생했습니다.' }, { status: 400 });
  }
}
