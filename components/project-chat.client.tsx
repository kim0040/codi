'use client';

import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { FormattedDate } from '@/components/formatted-date';

type ChatMessage = {
  id: string;
  authorTag: string;
  message: string;
  createdAt: string;
};

type Props = {
  projectId: string;
  projectSlug: string;
  projectTitle: string;
  canChat: boolean;
  currentUserTag?: string | null;
};

export default function ProjectChatClient({ projectId, projectSlug, projectTitle, canChat, currentUserTag }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!canChat) return;
    let mounted = true;
    setLoading(true);
    fetch(`/api/projects/${projectSlug}/messages`)
      .then(async (response) => {
        if (!response.ok) {
          const error = await response.json().catch(() => ({}));
          throw new Error(error.error ?? '채팅을 불러오지 못했습니다.');
        }
        const data = (await response.json()) as ChatMessage[];
        if (mounted) {
          setMessages(data);
        }
      })
      .catch((error: Error) => {
        if (mounted) {
          setStatus(error.message);
        }
      })
      .finally(() => {
        if (mounted) {
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, [canChat, projectSlug]);

  useEffect(() => {
    if (!canChat) return;
    const socket = io({ path: '/api/socket' });
    socket.emit('join', { projectId });
    socket.on('chat-message', (message: ChatMessage) => {
      setMessages((prev) => {
        if (prev.some((item) => item.id === message.id)) {
          return prev;
        }
        return [...prev, message];
      });
    });
    return () => {
      socket.disconnect();
    };
  }, [canChat, projectId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !canChat) {
      return;
    }
    setSending(true);
    setStatus(null);
    try {
      const response = await fetch(`/api/projects/${projectSlug}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
      });
      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.error ?? '메시지를 보낼 수 없습니다.');
      }
      const data = (await response.json()) as ChatMessage;
      setMessages((prev) => {
        if (prev.some((item) => item.id === data.id)) {
          return prev;
        }
        return [...prev, data];
      });
      setInput('');
    } catch (error) {
      setStatus((error as Error).message);
    } finally {
      setSending(false);
    }
  };

  if (!canChat) {
    return (
      <div className="rounded-2xl border border-slate-100 bg-white/80 p-4 text-sm text-slate-500 dark:border-slate-800 dark:bg-white/5 dark:text-slate-300">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">{projectTitle}</p>
        <p className="mt-2 text-sm">로그인 후 프로젝트 멤버에게만 채팅 권한이 부여됩니다.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-3 rounded-2xl border border-slate-100 bg-white/80 p-4 dark:border-slate-800 dark:bg-white/5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">프로젝트 채팅</p>
        <p className="font-semibold text-slate-900 dark:text-white">{projectTitle}</p>
      </div>
      <div className="max-h-72 overflow-y-auto space-y-2 text-sm">
        {loading ? <p className="text-xs text-slate-500">불러오는 중...</p> : null}
        {messages.length === 0 && !loading ? <p className="text-xs text-slate-500">아직 메시지가 없습니다.</p> : null}
        {messages.map((msg) => (
          <div key={msg.id} className="rounded-xl bg-slate-50 px-3 py-2 text-slate-700 dark:bg-slate-900/40 dark:text-slate-200">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span className="font-semibold text-primary">{msg.authorTag}</span>
              <span className="text-slate-500 dark:text-slate-300">
                <FormattedDate value={msg.createdAt} />
              </span>
            </div>
            <p>{msg.message}</p>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 rounded-2xl border border-slate-200 px-3 py-2 text-sm dark:border-slate-700"
          placeholder={currentUserTag ? `${currentUserTag}로 전송` : '메시지 입력'}
        />
        <button
          type="button"
          onClick={handleSend}
          disabled={sending || !input.trim()}
          className="rounded-2xl bg-primary px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
        >
          전송
        </button>
      </div>
      {status ? <p className="text-xs text-slate-500 dark:text-slate-400">{status}</p> : null}
    </div>
  );
}
