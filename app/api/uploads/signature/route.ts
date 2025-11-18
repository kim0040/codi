import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createUploadSignature } from '@/lib/cloudinary';
import { USER_ROLES, isRoleAllowed } from '@/lib/rbac';

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!isRoleAllowed(session?.user.role, [USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN])) {
    return NextResponse.json({ error: '권한이 없습니다.' }, { status: 403 });
  }

  const body = await request
    .json()
    .catch(() => ({ folder: 'codingmaker' }));
  const folder = body.folder ?? 'codingmaker';

  try {
    const { timestamp, signature } = createUploadSignature(folder);
    return NextResponse.json({
      timestamp,
      signature,
      folder,
      cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY
    });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
