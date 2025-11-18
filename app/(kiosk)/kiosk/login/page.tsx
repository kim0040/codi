'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function KioskLoginPage() {
  const [apiKey, setApiKey] = useState('');
  const router = useRouter();
  const [message, setMessage] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!apiKey) {
      setMessage('API Key를 입력해주세요.');
      return;
    }
    window.localStorage.setItem('kioskApiKey', apiKey);
    setMessage('저장되었습니다. 출석 화면으로 이동합니다.');
    setTimeout(() => router.push('/kiosk/attendance'), 800);
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-background-light px-4 py-10 text-slate-900 transition-colors dark:bg-[#050a11] dark:text-white">
      <div className="w-full max-w-3xl rounded-[32px] border border-slate-200 bg-white p-8 shadow-2xl transition-colors dark:border-white/10 dark:bg-white/5">
        <p className="text-sm uppercase tracking-[0.3em] text-primary">Kiosk</p>
        <h1 className="mt-2 text-3xl font-bold">출석 키오스크 로그인</h1>
        <p className="text-sm text-slate-500 dark:text-blue-100">API Key는 관리자(T1)에게만 발급됩니다. 유출 금지!</p>
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="apiKey" className="block text-sm font-semibold text-slate-600 dark:text-blue-100">
              API Key 입력
            </label>
            <input
              id="apiKey"
              name="apiKey"
              type="password"
              value={apiKey}
              onChange={(event) => setApiKey(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-primary focus:ring-primary dark:border-white/20 dark:bg-black/30 dark:text-white dark:placeholder:text-white/50"
              placeholder="cm-kiosk-xxxx"
            />
          </div>
          <button className="w-full rounded-2xl bg-primary px-4 py-3 text-base font-semibold text-white">
            키오스크 진입
          </button>
        </form>
        <p className="mt-4 text-xs text-slate-500 dark:text-blue-200">로그인 성공 시 localStorage에 저장되며 10분 무휴지 정책이 적용됩니다.</p>
        {message ? <p className="mt-3 text-sm text-primary">{message}</p> : null}
      </div>
    </div>
  );
}
