import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      role: string;
      userTag: string;
    };
  }

  interface User {
    role: string;
    userTag: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role?: string;
    userTag?: string;
  }
}
