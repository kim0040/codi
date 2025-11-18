'use client';

import { useState } from 'react';

export type AttachmentItem = {
  id?: string;
  name: string;
  url: string;
  uploadedAt?: string;
  canDelete?: boolean;
};

export function AttachmentList({ classSlug, weekId, items, canDelete }: { classSlug: string; weekId: string; items: AttachmentItem[]; canDelete: boolean }) {
  const [list, setList] = useState(items);
  const handleDelete = async (itemId?: string) => {
    if (!itemId) return;
    if (!confirm('해당 자료를 삭제할까요?')) return;
    const response = await fetch(`/api/classes/${classSlug}/materials/${itemId}`, { method: 'DELETE' });
    if (response.ok) {
      setList((prev) => prev.filter((file) => file.id !== itemId));
    } else {
      alert('삭제에 실패했습니다.');
    }
  };

  if (!list.length) return null;

  return (
    <div className="mt-3 rounded-2xl border border-slate-100/70 bg-slate-50/70 p-3 text-xs text-slate-600 dark:border-slate-700 dark:bg-slate-900/30 dark:text-slate-300">
      <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-primary">첨부 자료</p>
      <ul className="mt-2 space-y-2">
        {list.map((file) => (
          <li key={`${file.url}-${file.name}`} className="flex items-center justify-between gap-2">
            <a href={file.url} target="_blank" rel="noreferrer" className="truncate text-primary underline">
              {file.name}
            </a>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-400">{file.uploadedAt ? new Date(file.uploadedAt).toLocaleString('ko', { month: '2-digit', day: '2-digit', hour: '2-digit' }) : ''}</span>
              {canDelete && file.id ? (
                <button type="button" className="text-[11px] text-red-500" onClick={() => handleDelete(file.id)}>
                  삭제
                </button>
              ) : null}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
