'use client';

import Link from 'next/link';
import { signOut } from 'next-auth/react';

type AuthenticatedUser = {
  name?: string | null;
  roleLabel?: string;
  userTag?: string;
};

type Props = {
  user: AuthenticatedUser | null;
};

export function UserAuthMenu({ user }: Props) {
  if (!user) {
    return (
      <Link
        href="/login"
        className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-primary hover:text-primary dark:border-slate-700 dark:text-slate-200"
      >
        로그인
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <div className="hidden text-right text-xs sm:block">
        <p className="text-sm font-semibold text-slate-900 dark:text-white">{user.name}</p>
        <p className="text-[11px] text-slate-500 dark:text-slate-300">{user.roleLabel}{user.userTag ? ` · ${user.userTag}` : ''}</p>
      </div>
      <button
        type="button"
        className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-800 dark:bg-white/10 dark:text-white"
        onClick={() => signOut({ callbackUrl: '/' })}
      >
        로그아웃
      </button>
    </div>
  );
}
