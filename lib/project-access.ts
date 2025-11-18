import { prisma } from '@/lib/prisma';
import { USER_ROLES } from '@/lib/rbac';

type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

const ADMIN_ROLES = new Set<UserRole>([USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN]);

export async function canAccessProject(projectId: string, userId: string, role?: UserRole | null) {
  if (!userId) {
    return false;
  }
  if (role && ADMIN_ROLES.has(role)) {
    return true;
  }
  const membership = await prisma.projectMember.findFirst({
    where: { projectId, userId }
  });
  return Boolean(membership);
}

export async function canManageProject(projectId: string, userId: string, role?: UserRole | null, ownerOnly = false) {
  if (!userId) {
    return false;
  }
  if (role && ADMIN_ROLES.has(role)) {
    return true;
  }
  const membership = await prisma.projectMember.findFirst({
    where: { projectId, userId }
  });
  if (!membership) {
    return false;
  }
  if (ownerOnly) {
    return membership.role === 'Owner';
  }
  return true;
}
