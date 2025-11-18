import 'next-auth';
import 'next-auth/jwt';
import type { USER_ROLES } from '@/lib/rbac';

type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      role: UserRole;
      userTag: string;
    };
  }

  interface User {
    role: UserRole;
    userTag: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role?: UserRole;
    userTag?: string;
  }
}

declare module 'next-auth/adapters' {
  interface AdapterUser {
    role: UserRole;
    userTag: string;
  }
}
