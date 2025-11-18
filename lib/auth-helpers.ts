import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from './auth';
import { getDashboardPath, isRoleAllowed } from './rbac';

export async function requireRole(allowedRoles: readonly string[], currentPath: string) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect(`/login?callbackUrl=${encodeURIComponent(currentPath)}`);
  }

  if (!isRoleAllowed(session.user.role, allowedRoles)) {
    redirect(getDashboardPath(session.user.role));
  }

  return session;
}
