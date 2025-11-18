'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProjectFileUploadForm } from '@/components/project-file-upload-form';

export type ProjectFileRecord = {
  id: string;
  logicalName: string;
  version: number;
  fileName: string;
  fileUrl: string;
  language?: string | null;
  size?: number | null;
  changeSummary?: string | null;
  uploadedAt: string;
  uploader?: string | null;
};

type Props = {
  projectSlug: string;
  projectTitle: string;
  files: ProjectFileRecord[];
  canManage: boolean;
};

const formatDate = (value: string) =>
  new Intl.DateTimeFormat('ko', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).format(new Date(value));

const formatSize = (value?: number | null) => {
  if (!value) return '';
  if (value > 1024 * 1024) {
    return `${(value / (1024 * 1024)).toFixed(1)} MB`;
  }
  if (value > 1024) {
    return `${(value / 1024).toFixed(1)} KB`;
  }
  return `${value} B`;
};

export function ProjectFileManager({ projectSlug, projectTitle, files, canManage }: Props) {
  const router = useRouter();
  const [status, setStatus] = useState<string | null>(null);
  const [preview, setPreview] = useState<{ title: string; content: string } | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);

  const groups = useMemo(() => {
    const map = new Map<string, ProjectFileRecord[]>();
    files.forEach((file) => {
      const list = map.get(file.logicalName) ?? [];
      list.push(file);
      map.set(file.logicalName, list);
    });
    return Array.from(map.entries()).map(([name, list]) => ({
      name,
      versions: list.sort((a, b) => b.version - a.version)
    }));
  }, [files]);

  const existingNames = groups.map((group) => group.name);

  const handlePreview = async (fileId: string, title: string) => {
    setPreview(null);
    setPreviewLoading(true);
    setStatus('코드 미리보기를 불러오는 중입니다...');
    try {
      const response = await fetch(`/api/projects/files/${fileId}/preview`);
      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.error ?? '미리보기를 불러오지 못했습니다.');
      }
      const data = await response.json();
      setPreview({
        title: `${title} v${data.version}`,
        content: data.content as string
      });
      setStatus(null);
    } catch (error) {
      setStatus((error as Error).message);
    } finally {
      setPreviewLoading(false);
    }
  };

  const handleDelete = async (fileId: string) => {
    if (!canManage) return;
    if (!window.confirm('선택한 파일 버전을 삭제할까요?')) {
      return;
    }
    setStatus('파일 삭제 중...');
    const response = await fetch(`/api/projects/files/${fileId}`, { method: 'DELETE' });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      setStatus(error.error ?? '삭제에 실패했습니다.');
      return;
    }
    setStatus('삭제되었습니다.');
    router.refresh();
  };

  if (!groups.length && !canManage) {
    return null;
  }

  return (
    <div className="space-y-4 rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm dark:border-slate-800 dark:bg-white/5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-primary">파일 버전</p>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{projectTitle}</h3>
        </div>
        <span className="text-xs text-slate-500 dark:text-slate-400">{files.length}개 버전 추적</span>
      </div>
      {groups.length ? (
        <div className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
          {groups.map((group) => (
            <div key={group.name} className="rounded-2xl border border-slate-100/70 bg-slate-50/70 p-3 dark:border-slate-800 dark:bg-slate-900/40">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-semibold text-slate-900 dark:text-white">{group.name}</p>
                <span className="text-xs text-slate-500 dark:text-slate-400">최근 v{group.versions[0]?.version}</span>
              </div>
              <ul className="mt-2 space-y-2">
                {group.versions.map((file) => (
                  <li key={file.id} className="rounded-xl bg-white/70 p-3 text-sm dark:bg-white/5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white">
                          v{file.version}{' '}
                          <span className="text-xs font-normal text-slate-500">
                            {file.language ?? '일반'} · {formatSize(file.size)}
                          </span>
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {file.changeSummary ?? '변경 요약 없음'} · {formatDate(file.uploadedAt)}
                          {file.uploader ? ` · ${file.uploader}` : null}
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <button
                          type="button"
                          className="rounded-full border border-slate-200 px-3 py-1 font-semibold text-slate-600 hover:border-primary hover:text-primary dark:border-slate-700 dark:text-slate-300"
                          onClick={() => handlePreview(file.id, group.name)}
                          disabled={previewLoading}
                        >
                          미리보기
                        </button>
                        <a
                          href={file.fileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-full border border-slate-200 px-3 py-1 font-semibold text-slate-600 hover:border-primary hover:text-primary dark:border-slate-700 dark:text-slate-300"
                        >
                          다운로드
                        </a>
                        {canManage ? (
                          <button
                            type="button"
                            className="rounded-full bg-red-500/10 px-3 py-1 font-semibold text-red-500"
                            onClick={() => handleDelete(file.id)}
                          >
                            삭제
                          </button>
                        ) : null}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-slate-500 dark:text-slate-300">아직 업로드된 파일이 없습니다.</p>
      )}
      <ProjectFileUploadForm projectSlug={projectSlug} existingNames={existingNames} canUpload={canManage} />
      {status ? <p className="text-xs text-slate-500 dark:text-slate-300">{status}</p> : null}
      {preview ? (
        <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 text-xs text-slate-600 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-200">
          <div className="flex items-center justify-between">
            <p className="font-semibold text-slate-900 dark:text-white">{preview.title}</p>
            <button type="button" className="text-xs font-semibold text-primary" onClick={() => setPreview(null)}>
              닫기
            </button>
          </div>
          <pre className="mt-2 max-h-64 overflow-y-auto whitespace-pre-wrap rounded-xl bg-black/90 px-3 py-2 font-mono text-[11px] text-emerald-100 dark:bg-black/60">
            {preview.content}
          </pre>
        </div>
      ) : null}
    </div>
  );
}
