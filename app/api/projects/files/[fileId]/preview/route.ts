import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { canAccessProject } from '@/lib/project-access';

const PREVIEW_LIMIT = 20000;

export async function GET(request: Request, { params }: { params: { fileId: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
    }

    const file = await prisma.projectFile.findUnique({ where: { id: params.fileId } });
    if (!file) {
      return NextResponse.json({ error: '파일을 찾을 수 없습니다.' }, { status: 404 });
    }

    const permitted = await canAccessProject(file.projectId, session.user.id, session.user.role);
    if (!permitted) {
      return NextResponse.json({ error: '파일 미리보기 권한이 없습니다.' }, { status: 403 });
    }

    const response = await fetch(file.fileUrl, { cache: 'no-store' });
    if (!response.ok) {
      return NextResponse.json({ error: '파일을 불러오지 못했습니다.' }, { status: 502 });
    }
    const content = await response.text();
    const truncated = content.length > PREVIEW_LIMIT ? `${content.slice(0, PREVIEW_LIMIT)}\n\n/* ... (이후 내용 생략) */` : content;

    return NextResponse.json({
      content: truncated,
      logicalName: file.logicalName,
      language: file.language,
      version: file.version
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: '미리보기를 생성하지 못했습니다.' }, { status: 500 });
  }
}
