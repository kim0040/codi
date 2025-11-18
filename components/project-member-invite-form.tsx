'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';

interface Props {
  projectSlug: string;
}

export function ProjectMemberInviteForm({ projectSlug }: Props) {
  const { data: session } = useSession();
  const [userTag, setUserTag] = useState('');
  const [role, setRole] = useState('Member');
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!session) return null;

  const handleInvite = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!userTag) {
      setStatus('초대할 사용자 태그를 입력하세요.');
      return;
    }

    setLoading(true);
    setStatus(null);

    const response = await fetch(`/api/projects/${projectSlug}/members`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userTag, role })
    });

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      setStatus(body.error ?? '멤버 초대 중 오류가 발생했습니다.');
    } else {
      setStatus('초대가 완료되었습니다.');
      setUserTag('');
    }

    setLoading(false);
  };

  return (
    <form className="space-y-2 text-xs" onSubmit={handleInvite}>
      <p className="font-semibold text-slate-600 dark:text-slate-300">멤버 초대</p>
      <input
        type="text"
        placeholder="userTag (예: kimhyunmin#0003)"
        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-900"
        value={userTag}
        onChange={(event) => setUserTag(event.target.value)}
      />
      <select
        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-900"
        value={role}
        onChange={(event) => setRole(event.target.value)}
      >
        <option value="Member">Member</option>
        <option value="Owner">Owner</option>
      </select>
      <button type="submit" disabled={loading} className="w-full rounded-full bg-primary px-3 py-2 text-xs font-semibold text-white disabled:opacity-50">
        {loading ? '초대 중...' : '초대 보내기'}
      </button>
      {status ? <p className="text-[11px] text-slate-500 dark:text-slate-400">{status}</p> : null}
    </form>
  );
}
