'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { RichTextEditor } from '@/components/rich-text-editor';

interface Props {
  categories: string[];
}

export function CommunityPostForm({ categories }: Props) {
  const { data: session } = useSession();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(categories[0] ?? '자유');
  const [content, setContent] = useState('<p></p>');
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!session) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 text-sm text-slate-500 dark:border-slate-700 dark:bg-white/5">
        로그인 후 커뮤니티 글을 작성할 수 있습니다.
      </div>
    );
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setStatus(null);

    const response = await fetch('/api/community/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content, category })
    });

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      setStatus(body.error ?? '글 작성 중 오류가 발생했습니다.');
    } else {
      setTitle('');
      setContent('');
      setStatus('게시글이 등록되었습니다.');
      router.refresh();
    }

    setLoading(false);
  };

  return (
    <form className="space-y-3 rounded-2xl border border-slate-200 bg-white/90 p-4 dark:border-slate-700 dark:bg-white/5" onSubmit={handleSubmit}>
      <p className="text-xs font-semibold uppercase tracking-[0.4em] text-primary">새 글 작성</p>
      <input
        type="text"
        placeholder="제목"
        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        required
      />
      <select
        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
        value={category}
        onChange={(event) => setCategory(event.target.value)}
      >
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
      <RichTextEditor value={content} onChange={setContent} />
      <button type="submit" disabled={loading} className="w-full rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">
        {loading ? '등록 중...' : '게시글 등록'}
      </button>
      {status ? <p className="text-xs text-slate-500 dark:text-slate-300">{status}</p> : null}
    </form>
  );
}
