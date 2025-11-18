'use client';

import { useMemo, useState } from 'react';
import type { CommunityPost } from '@prisma/client';

interface Props {
  posts: CommunityPost[];
  categories: string[];
}

const formatDate = (value: string) => new Intl.DateTimeFormat('ko', { month: '2-digit', day: '2-digit' }).format(new Date(value));

export function CommunityPostList({ posts, categories }: Props) {
  const [activeCategory, setActiveCategory] = useState('전체');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const filtered = useMemo(() => {
    return posts.filter((post) => {
      const byCategory = activeCategory === '전체' || post.category === activeCategory;
      const keyword = search.trim().toLowerCase();
      const contentText = post.content.replace(/<[^>]+>/g, '').toLowerCase();
      const bySearch = !keyword || post.title.toLowerCase().includes(keyword) || contentText.includes(keyword);
      return byCategory && bySearch;
    });
  }, [activeCategory, posts, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize);

  const changePage = (next: number) => {
    setPage(Math.min(totalPages, Math.max(1, next)));
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {['전체', ...categories].map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => {
                setActiveCategory(category);
                setPage(1);
              }}
              className={`rounded-full border px-4 py-2 text-sm transition ${
                activeCategory === category
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-slate-200 text-slate-600 hover:border-primary hover:text-primary dark:border-slate-700 dark:text-slate-300'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
        <input
          type="search"
          placeholder="검색 (제목/내용)"
          className="rounded-full border border-slate-200 px-4 py-2 text-sm dark:border-slate-700"
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setPage(1);
          }}
        />
      </div>

      <div className="space-y-4">
        {pageItems.length === 0 ? (
          <p className="text-center text-sm text-slate-400">결과가 없습니다.</p>
        ) : (
          pageItems.map((post) => (
            <article key={post.id} className="rounded-2xl border border-slate-100 bg-slate-50/60 p-5 shadow-sm dark:border-slate-800 dark:bg-white/5">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-semibold text-primary">{post.category}</span>
                <span>
                  {post.commentCount} 댓글 · {post.likeCount} 공감 · {formatDate(post.createdAt as unknown as string)}
                </span>
              </div>
              <h3 className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">{post.title}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-300">{post.authorName} · {post.authorRole}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{post.content.replace(/<[^>]+>/g, '').slice(0, 120)}...</p>
            </article>
          ))
        )}
      </div>

      <div className="flex items-center justify-between text-sm text-slate-500">
        <button
          type="button"
          onClick={() => changePage(page - 1)}
          disabled={page === 1}
          className="rounded-full border border-slate-200 px-3 py-1 disabled:opacity-50 dark:border-slate-700"
        >
          이전
        </button>
        <span>
          {page} / {totalPages}
        </span>
        <button
          type="button"
          onClick={() => changePage(page + 1)}
          disabled={page === totalPages}
          className="rounded-full border border-slate-200 px-3 py-1 disabled:opacity-50 dark:border-slate-700"
        >
          다음
        </button>
      </div>
    </div>
  );
}
