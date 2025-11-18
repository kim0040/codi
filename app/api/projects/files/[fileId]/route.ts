import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { canManageProject } from '@/lib/project-access';
import { deleteResource } from '@/lib/cloudinary';

export async function DELETE(request: Request, { params }: { params: { fileId: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
    }

    const target = await prisma.projectFile.findUnique({ where: { id: params.fileId } });
    if (!target) {
      return NextResponse.json({ error: '파일을 찾을 수 없습니다.' }, { status: 404 });
    }

    const permitted = await canManageProject(target.projectId, session.user.id, session.user.role, true);
    if (!permitted) {
      return NextResponse.json({ error: '파일을 삭제할 권한이 없습니다.' }, { status: 403 });
    }

    await prisma.projectFile.delete({ where: { id: params.fileId } });

    if (target.publicId) {
      await deleteResource(target.publicId);
    }

    await prisma.projectLog.create({
      data: {
        projectId: target.projectId,
        userId: session.user.id,
        message: `${session.user.name ?? session.user.userTag}님이 ${target.logicalName} v${target.version} 파일을 삭제했습니다.`
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: '파일 삭제에 실패했습니다.' }, { status: 500 });
  }
}
