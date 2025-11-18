import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { canAccessProject } from '@/lib/project-access';

export async function POST(request: Request, { params }: { params: { slug: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
    }

    const body = await request.json().catch(() => null);
    const logicalName = (body?.logicalName as string | undefined)?.trim();
    const fileName = (body?.fileName as string | undefined)?.trim();
    const fileUrl = (body?.url as string | undefined) ?? (body?.fileUrl as string | undefined);
    const language = (body?.language as string | undefined)?.trim();
    const changeSummary = (body?.changeSummary as string | undefined)?.trim();
    const publicId = body?.publicId as string | undefined;
    const rawSize = body?.size as number | undefined;

    if (!logicalName || !fileName || !fileUrl) {
      return NextResponse.json({ error: '파일명과 URL이 필요합니다.' }, { status: 400 });
    }

    const project = await prisma.project.findUnique({ where: { slug: params.slug } });
    if (!project) {
      return NextResponse.json({ error: '프로젝트를 찾을 수 없습니다.' }, { status: 404 });
    }

    const permitted = await canAccessProject(project.id, session.user.id, session.user.role);
    if (!permitted) {
      return NextResponse.json({ error: '파일을 업로드할 권한이 없습니다.' }, { status: 403 });
    }

    const latest = await prisma.projectFile.aggregate({
      where: { projectId: project.id, logicalName },
      _max: { version: true }
    });
    const nextVersion = (latest._max.version ?? 0) + 1;

    const record = await prisma.projectFile.create({
      data: {
        projectId: project.id,
        logicalName,
        fileName,
        fileUrl,
        publicId,
        language,
        changeSummary,
        version: nextVersion,
        size: typeof rawSize === 'number' ? Math.round(rawSize) : null,
        uploadedById: session.user.id
      },
      include: { uploadedBy: true }
    });

    await prisma.projectLog.create({
      data: {
        projectId: project.id,
        userId: session.user.id,
        message: `${session.user.name ?? session.user.userTag}님이 ${logicalName} v${nextVersion}을 업로드했습니다.`
      }
    });

    return NextResponse.json(
      {
        id: record.id,
        logicalName: record.logicalName,
        fileName: record.fileName,
        version: record.version,
        fileUrl: record.fileUrl,
        uploadedAt: record.uploadedAt,
        language: record.language,
        size: record.size,
        changeSummary: record.changeSummary,
        uploader: record.uploadedBy?.name ?? record.uploadedBy?.userTag ?? '익명'
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: '파일 버전 등록에 실패했습니다.' }, { status: 500 });
  }
}
