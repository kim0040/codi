'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PROJECT_COLUMNS } from '@/lib/constants';

interface Props {
  projectSlug: string;
}

export function ProjectTaskForm({ projectSlug }: Props) {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [owner, setOwner] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [column, setColumn] = useState(PROJECT_COLUMNS.TODO);
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!title || !owner || !dueDate) {
      setStatus('모든 필드를 입력해주세요.');
      return;
    }
    setLoading(true);
    setStatus(null);
    const response = await fetch(`/api/projects/${projectSlug}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, owner, dueDate, column })
    });
    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      setStatus(body.error ?? '작업 추가 중 오류가 발생했습니다.');
    } else {
      setStatus('작업이 추가되었습니다.');
      setTitle('');
      setOwner('');
      setDueDate('');
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <form className="space-y-2 text-xs" onSubmit={handleSubmit}>
      <p className="font-semibold text-slate-600 dark:text-slate-300">새 작업</p>
      <input className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-900" placeholder="작업명" value={title} onChange={(e) => setTitle(e.target.value)} />
      <input className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-900" placeholder="담당자" value={owner} onChange={(e) => setOwner(e.target.value)} />
      <input className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-900" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
      <select className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-900" value={column} onChange={(e) => setColumn(e.target.value)}>
        {Object.values(PROJECT_COLUMNS).map((col) => (
          <option key={col} value={col}>
            {col}
          </option>
        ))}
      </select>
      <button type="submit" disabled={loading} className="w-full rounded-full bg-primary px-3 py-2 text-xs font-semibold text-white disabled:opacity-50">
        {loading ? '추가 중...' : '작업 추가'}
      </button>
      {status ? <p className="text-[11px] text-slate-500 dark:text-slate-400">{status}</p> : null}
    </form>
  );
}
