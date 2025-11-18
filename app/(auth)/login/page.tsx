import type { Metadata } from 'next';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { LoginForm } from '@/components/login-form';
import { authOptions } from '@/lib/auth';
import { getDashboardPath } from '@/lib/rbac';

export const metadata: Metadata = {
  title: '로그인 | 코딩메이커 아카데미 허브'
};

type LoginPageProps = {
  searchParams?: {
    callbackUrl?: string;
  };
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const session = await getServerSession(authOptions);
  const callbackUrl = searchParams?.callbackUrl;

  if (session) {
    redirect(callbackUrl ?? getDashboardPath(session.user.role));
  }

  return (
    <div className="bg-gradient-to-b from-background-light to-white py-16 dark:from-[#050a11] dark:to-[#0d1624]">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-10 px-4 text-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-primary">Welcome Back</p>
          <h1 className="mt-4 text-3xl font-black text-slate-900 dark:text-white">코딩메이커 허브 로그인</h1>
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-300">
            역할별 대시보드, 커뮤니티, Git-Lite 프로젝트 허브를 이용하려면 먼저 인증하세요.
          </p>
        </div>
        <LoginForm />
        <Link href="/" className="text-sm font-semibold text-primary underline-offset-4 hover:underline">
          메인 페이지로 돌아가기
        </Link>
      </div>
    </div>
  );
}
