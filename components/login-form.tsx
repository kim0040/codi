'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';

const sampleAccounts = [
  { label: '원장님', email: 'ceo@codingmaker.kr', password: 'admin1234' },
  { label: '멘토', email: 'mentor@codingmaker.kr', password: 'mentor1234' },
  { label: '학생', email: 'student1@codingmaker.kr', password: 'student1234' },
  { label: '학부모', email: 'parent@codingmaker.kr', password: 'parent1234' }
];

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams?.get('callbackUrl') ?? '/dashboard';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const response = await signIn('credentials', {
      email,
      password,
      redirect: false,
      callbackUrl
    });

    setLoading(false);

    if (!response || response.error) {
      setError('이메일 또는 비밀번호를 다시 확인해주세요.');
      return;
    }

    router.replace(response.url ?? callbackUrl);
  };

  return (
    <div className="flex flex-col gap-6 rounded-3xl border border-slate-200 bg-white/90 p-8 shadow-xl dark:border-slate-800 dark:bg-[#0e1724]">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="email" className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            이메일
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-transparent px-4 py-3 text-sm outline-none transition focus:border-primary dark:border-slate-700"
            placeholder="you@example.com"
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            비밀번호
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-transparent px-4 py-3 text-sm outline-none transition focus:border-primary dark:border-slate-700"
            placeholder="••••••••"
            required
          />
        </div>
        {error ? <p className="text-sm font-semibold text-red-500">{error}</p> : null}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? '로그인 중...' : '로그인'}
        </button>
      </form>

      <div className="rounded-2xl border border-dashed border-slate-200/70 bg-slate-50/60 p-4 text-sm dark:border-slate-700 dark:bg-white/5">
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-primary">샘플 계정</p>
        <ul className="mt-3 space-y-2">
          {sampleAccounts.map((account) => (
            <li key={account.email} className="flex flex-wrap items-center justify-between gap-2 text-slate-600 dark:text-slate-300">
              <span className="font-semibold">{account.label}</span>
              <span className="text-xs">{account.email} · {account.password}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
