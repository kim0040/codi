'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

type Props = {
  projectSlug: string;
  existingNames: string[];
  canUpload: boolean;
};

export function ProjectFileUploadForm({ projectSlug, existingNames, canUpload }: Props) {
  const router = useRouter();
  const [logicalName, setLogicalName] = useState('');
  const [language, setLanguage] = useState('');
  const [changeSummary, setChangeSummary] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const suggestionId = useMemo(() => `project-file-${projectSlug}`, [projectSlug]);

  if (!canUpload) {
    return null;
  }

  const handleUpload = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!logicalName.trim() || !file) {
      setStatus('파일과 논리명을 모두 입력해주세요.');
      return;
    }

    setUploading(true);
    setStatus('서명 발급 중...');

    try {
      const signatureResponse = await fetch('/api/uploads/signature', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ folder: `projects/${projectSlug}` })
      });

      if (!signatureResponse.ok) {
        throw new Error('Cloudinary 서명을 가져오지 못했습니다.');
      }

      const signature = await signatureResponse.json();
      if (!signature.cloudName || !signature.apiKey) {
        throw new Error('Cloudinary 환경 변수를 먼저 설정해주세요.');
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('api_key', signature.apiKey);
      formData.append('timestamp', signature.timestamp.toString());
      formData.append('signature', signature.signature);
      formData.append('folder', signature.folder);

      setStatus('Cloudinary로 업로드 중...');
      const uploadEndpoint = `https://api.cloudinary.com/v1_1/${signature.cloudName}/auto/upload`;
      const uploadResponse = await fetch(uploadEndpoint, {
        method: 'POST',
        body: formData
      });
      const uploadResult = await uploadResponse.json();
      if (!uploadResponse.ok) {
        throw new Error(uploadResult?.error?.message ?? 'Cloudinary 업로드 실패');
      }

      setStatus('LMS에 파일 버전을 기록 중...');
      const attachResponse = await fetch(`/api/projects/${projectSlug}/files`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          logicalName,
          fileName: file.name,
          fileUrl: uploadResult.secure_url,
          publicId: uploadResult.public_id,
          language,
          size: file.size,
          changeSummary
        })
      });

      if (!attachResponse.ok) {
        const error = await attachResponse.json().catch(() => ({}));
        throw new Error(error.error ?? '파일 버전을 저장하지 못했습니다.');
      }

      setStatus('업로드가 완료되었습니다.');
      setFile(null);
      setChangeSummary('');
      router.refresh();
    } catch (error) {
      setStatus((error as Error).message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <form className="space-y-3 rounded-2xl border border-dashed border-slate-300 p-4 dark:border-slate-700" onSubmit={handleUpload}>
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">새 버전 업로드</p>
      <div className="space-y-1 text-sm">
        <label htmlFor={`${suggestionId}-name`} className="font-semibold text-slate-600 dark:text-slate-300">
          논리명 / 파일명
        </label>
        <input
          id={`${suggestionId}-name`}
          list={suggestionId}
          value={logicalName}
          onChange={(event) => setLogicalName(event.target.value)}
          placeholder="예: attendance-worker.ts"
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
        />
        <datalist id={suggestionId}>
          {existingNames.map((name) => (
            <option key={name} value={name} />
          ))}
        </datalist>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-sm font-semibold text-slate-600 dark:text-slate-300">
          언어 (선택)
          <input
            type="text"
            value={language}
            onChange={(event) => setLanguage(event.target.value)}
            placeholder="typescript"
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
          />
        </label>
        <label className="text-sm font-semibold text-slate-600 dark:text-slate-300">
          변경 요약 (선택)
          <input
            type="text"
            value={changeSummary}
            onChange={(event) => setChangeSummary(event.target.value)}
            placeholder="rate-limit 패치"
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
          />
        </label>
      </div>
      <label className="text-sm font-semibold text-slate-600 dark:text-slate-300">
        파일 선택
        <input
          type="file"
          className="mt-1 block w-full text-sm"
          onChange={(event) => setFile(event.target.files?.[0] ?? null)}
        />
      </label>
      <button
        type="submit"
        disabled={uploading}
        className="w-full rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
      >
        {uploading ? '업로드 중...' : '새 버전 등록'}
      </button>
      {status ? <p className="text-xs text-slate-500 dark:text-slate-300">{status}</p> : null}
    </form>
  );
}
