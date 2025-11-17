'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

const STATUS_LABELS: Record<string, string> = {
  CHECK_IN: '입실',
  CHECK_OUT: '퇴실'
};

type KioskAttendanceFormProps = {
  onSuccess?: (message: string) => void;
};

export function KioskAttendanceForm({ onSuccess }: KioskAttendanceFormProps = {}) {
  const [storedApiKey, setStoredApiKey] = useState<string>('');
  const [userTag, setUserTag] = useState('');
  const [note, setNote] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const key = window.localStorage.getItem('kioskApiKey') ?? '';
    setStoredApiKey(key);
  }, []);

  const submitAttendance = async (status: 'CHECK_IN' | 'CHECK_OUT') => {
    if (!storedApiKey) {
      setMessage('먼저 키오스크 로그인을 완료해주세요.');
      return;
    }
    if (!userTag) {
      setMessage('이름#태그를 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/kiosk/check-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: storedApiKey, userTag, note, status })
      });
      const payload = await response.json();
      if (!response.ok) {
        setMessage(payload.message ?? '요청 실패');
      } else {
        const successMessage = payload.message ?? `${userTag} ${STATUS_LABELS[status]} 완료`;
        setMessage(successMessage);
        setUserTag('');
        setNote('');
        onSuccess?.(successMessage);
      }
    } catch (error) {
      console.error(error);
      setMessage('네트워크 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-8 flex flex-col gap-4">
      {!storedApiKey ? (
        <div className="rounded-2xl border border-amber-400/40 bg-amber-500/10 p-4 text-sm text-amber-100">
          <p>API Key가 설정되어 있지 않습니다.</p>
          <p className="mt-1">
            <Link href="/kiosk/login" className="font-semibold text-white underline">
              키오스크 로그인 페이지
            </Link>
            에서 먼저 키를 등록해주세요.
          </p>
        </div>
      ) : (
        <div className="rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-blue-100">
          현재 등록된 키오스크 기기: <b>{storedApiKey.replace(/.(?=.{4})/g, '*')}</b>
          <Link href="/kiosk/login" className="ml-3 text-xs font-semibold underline">
            키 변경
          </Link>
        </div>
      )}
      <input
        type="text"
        value={userTag}
        onChange={(event) => setUserTag(event.target.value)}
        className="w-full rounded-2xl border border-white/20 bg-black/40 px-5 py-4 text-lg tracking-wide placeholder:text-white/40 focus:border-primary focus:outline-none"
        placeholder="김현민#0001"
      />
      <textarea
        value={note}
        onChange={(event) => setNote(event.target.value)}
        className="w-full rounded-2xl border border-white/20 bg-black/30 px-5 py-3 text-sm placeholder:text-white/40 focus:border-primary focus:outline-none"
        placeholder="비고 (선택)"
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => submitAttendance('CHECK_IN')}
          disabled={isLoading || !storedApiKey}
          className="rounded-2xl bg-emerald-500/90 px-4 py-4 text-lg font-bold text-white disabled:opacity-70"
        >
          입실
        </button>
        <button
          type="button"
          onClick={() => submitAttendance('CHECK_OUT')}
          disabled={isLoading || !storedApiKey}
          className="rounded-2xl bg-rose-500/90 px-4 py-4 text-lg font-bold text-white disabled:opacity-70"
        >
          퇴실
        </button>
      </div>
      {message ? <p className="text-sm text-blue-200">{message}</p> : null}
    </div>
  );
}
