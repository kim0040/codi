import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { USER_ROLES, isRoleAllowed } from '@/lib/rbac';
import { deleteResource } from '@/lib/cloudinary';

export async function DELETE(request: Request, { params }: { params: { slug: string; fileId: string } }) {
  const session = await getServerSession(authOptions);
  if (!isRoleAllowed(session?.user.role, [USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN])) {
    return NextResponse.json({ error: '삭제 권한이 없습니다.' }, { status: 403 });
  }

  const klass = await prisma.class.findUnique({ where: { slug: params.slug }, include: { curriculums: true } });
  if (!klass) {
    return NextResponse.json({ error: '클래스를 찾을 수 없습니다.' }, { status: 404 });
  }

  let deletedPublicId: string | undefined;
  let updated = false;
  for (const week of klass.curriculums) {
    if (!week.files) continue;
    const list = JSON.parse(week.files) as Array<{ id?: string; publicId?: string }>;
    const target = list.find((item) => item.id === params.fileId);
    const nextList = list.filter((item) => item.id !== params.fileId);
    if (target && nextList.length !== list.length) {
      deletedPublicId = target.publicId;
      await prisma.curriculumWeek.update({ where: { id: week.id }, data: { files: JSON.stringify(nextList) } });
      updated = true;
      break;
    }
  }

  if (!updated) {
    return NextResponse.json({ error: '파일을 찾을 수 없습니다.' }, { status: 404 });
  }

  if (deletedPublicId) {
    await deleteResource(deletedPublicId);
  }

  return NextResponse.json({ success: true });
}
