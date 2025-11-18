'use client';

import { useEffect, useMemo, useState } from 'react';

interface CommentResponse {
  id: string;
  authorName: string;
  authorRole: string;
  content: string;
  createdAt: string;
}

export function CommunityCommentList({ postId }: { postId: string }) {
  const [comments, setComments] = useState<CommentResponse[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const formatTime = useMemo(
    () => (value: string) =>
      new Intl.DateTimeFormat('ko', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).format(new Date(value)),
    []
  );

  useEffect(() => {
    fetch(`/api/community/posts/${postId}/comments`)
      .then((res) => res.json())
      .then((data) => setComments(data ?? []))
      .catch(() => undefined);
  }, [postId]);

  const handleSubmit = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setStatus(null);
    const response = await fetch(`/api/community/posts/${postId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: input })
    });
    if (response.ok) {
      const data: CommentResponse = await response.json();
      setComments((prev) => [...prev, data]);
      setInput('');
      setStatus('댓글이 등록되었습니다.');
    } else if (response.status === 401) {
      setStatus('로그인 후 댓글을 작성할 수 있습니다.');
    } else {
      const error = await response.json().catch(() => ({}));
      setStatus(error.error ?? '댓글 등록에 실패했습니다.');
    }
    setLoading(false);
  };

  return (
    <div className="space-y-3 rounded-2xl border border-slate-100 bg-white/90 p-4 text-sm text-slate-600 dark:border-slate-800 dark:bg-white/5">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">댓글 {comments.length}개</p>
      <div className="grid gap-2">
        {comments.map((comment) => (
          <div key={comment.id} className="rounded-xl bg-slate-50 px-3 py-2 text-slate-700 dark:bg-slate-900/40 dark:text-slate-200">
            <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
              <p>
                <span className="font-semibold text-primary">{comment.authorName}</span> · {comment.authorRole}
              </p>
              <span>{formatTime(comment.createdAt)}</span>
            </div>
            <p className="mt-1" dangerouslySetInnerHTML={{ __html: comment.content }} />
          </div>
        ))}
        </div>
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 rounded-full border border-slate-200 px-3 py-2 text-xs focus:border-primary dark:border-slate-700"
          placeholder="댓글 작성"
        />
        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className="rounded-full bg-primary px-4 py-2 text-xs font-semibold text-white"
        >
          등록
        </button>
      </div>
      {status ? <p className="text-xs text-slate-500 dark:text-slate-300">{status}</p> : null}
    </div>
  );
}
