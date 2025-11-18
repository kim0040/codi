import { AUDIENCES } from '@/lib/constants';

export const USER_ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN: 'ADMIN',
  FULL_MEMBER: 'FULL_MEMBER',
  ASSOCIATE_MEMBER: 'ASSOCIATE_MEMBER',
  PARENT: 'PARENT',
  VISITOR: 'VISITOR'
} as const;

export const ROLE_LABELS: Record<string, string> = {
  [USER_ROLES.SUPER_ADMIN]: '원장 (T1)',
  [USER_ROLES.ADMIN]: '멘토 (T2)',
  [USER_ROLES.FULL_MEMBER]: '정회원 (T3)',
  [USER_ROLES.PARENT]: '학부모',
  [USER_ROLES.ASSOCIATE_MEMBER]: '준회원',
  [USER_ROLES.VISITOR]: '방문자'
};

export const DASHBOARD_ACCESS = {
  ADMIN: [USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN],
  STUDENT: [USER_ROLES.FULL_MEMBER],
  PARENT: [USER_ROLES.PARENT]
} as const;

const DEFAULT_DASHBOARD: Record<string, string> = {
  [USER_ROLES.SUPER_ADMIN]: '/dashboard/admin',
  [USER_ROLES.ADMIN]: '/dashboard/admin',
  [USER_ROLES.FULL_MEMBER]: '/dashboard/student',
  [USER_ROLES.PARENT]: '/dashboard/parent',
  [USER_ROLES.ASSOCIATE_MEMBER]: '/dashboard/student'
};

export function getDashboardPath(role?: string | null) {
  if (!role) return '/dashboard';
  return DEFAULT_DASHBOARD[role] ?? '/dashboard';
}

export function isRoleAllowed(role: string | undefined, allowed: readonly string[]) {
  if (!role) return false;
  return allowed.includes(role);
}

export function roleToAudience(role?: string | null) {
  switch (role) {
    case USER_ROLES.SUPER_ADMIN:
    case USER_ROLES.ADMIN:
      return AUDIENCES.ADMIN;
    case USER_ROLES.FULL_MEMBER:
    case USER_ROLES.ASSOCIATE_MEMBER:
      return AUDIENCES.STUDENT;
    case USER_ROLES.PARENT:
      return AUDIENCES.PARENT;
    default:
      return AUDIENCES.GENERAL;
  }
}
