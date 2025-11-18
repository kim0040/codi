import type { NextAuthOptions } from 'next-auth';
import type { Adapter } from 'next-auth/adapters';
import Credentials from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { compare } from 'bcryptjs';
import { prisma } from './prisma';
import { USER_ROLES } from '@/lib/rbac';

type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

const adapter = PrismaAdapter(prisma) as Adapter;

export const authOptions: NextAuthOptions = {
  adapter,
  session: {
    strategy: 'jwt'
  },
  pages: {
    signIn: '/login'
  },
  providers: [
    Credentials({
      name: '이메일 로그인',
      credentials: {
        email: { label: '이메일', type: 'email' },
        password: { label: '비밀번호', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });

        if (!user || !user.password) {
          return null;
        }

        const isValid = await compare(credentials.password, user.password);
        if (!isValid) {
          return null;
        }

        const userRole = (user.role ?? USER_ROLES.ASSOCIATE_MEMBER) as UserRole;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: userRole,
          userTag: user.userTag
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as unknown as { role?: UserRole }).role;
        token.userTag = (user as unknown as { userTag?: string }).userTag;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = (token.role as UserRole) ?? USER_ROLES.ASSOCIATE_MEMBER;
        session.user.userTag = (token.userTag as string) ?? '';
        session.user.id = token.sub as string;
      }
      return session;
    }
  }
};
