'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { USER_ROLES } from '@/lib/rbac';

interface WeekOption {
  id: string;
  title: string;
  weekNumber: number;
}

interface Props {
  classSlug: string;
  weeks: WeekOption[];
}

export function MaterialUploadForm({ classSlug, weeks }: Props) {
  const { data: session } = useSession();
  const [weekId, setWeekId] = useState(weeks[0]?.id ?? '');
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  if (!session || ![USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN].includes(session.user.role) || weeks.length === 0) {
    return null;
  }

  const handleUpload = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file || !weekId) {
      setStatus('업로드할 파일과 주차를 선택해주세요.');
      return;
    }

    setUploading(true);
    setStatus('업로드 사전 준비 중...');

    try {
      const signatureResponse = await fetch('/api/uploads/signature', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ folder: `classes/${classSlug}` })
      });

      if (!signatureResponse.ok) {
        throw new Error('Cloudinary 서명을 가져오지 못했습니다.');
      }

      const signatureData = await signatureResponse.json();
      if (!signatureData.cloudName || !signatureData.apiKey) {
        throw new Error('Cloudinary 환경 변수가 설정되지 않았습니다.');
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('api_key', signatureData.apiKey ?? '');
      formData.append('timestamp', signatureData.timestamp.toString());
      formData.append('signature', signatureData.signature);
      formData.append('folder', signatureData.folder);

      setStatus('Cloudinary에 업로드 중...');

      const uploadResponse = await fetch(`https://api.cloudinary.com/v1_1/${signatureData.cloudName}/auto/upload`, {
        method: 'POST',
        body: formData
      });

      const uploadResult = await uploadResponse.json();
      if (!uploadResponse.ok) {
        throw new Error(uploadResult?.error?.message ?? 'Cloudinary 업로드에 실패했습니다.');
      }

      setStatus('LMS에 자료를 연결하는 중...');

      const attachResponse = await fetch(`/api/classes/${classSlug}/materials`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          weekId,
          file: {
            name: file.name,
            url: uploadResult.secure_url,
            publicId: uploadResult.public_id,
            size: file.size
          }
        })
      });

      if (!attachResponse.ok) {
        throw new Error('커리큘럼에 자료를 연결하는 중 문제가 발생했습니다.');
      }

      setStatus('업로드가 완료되었습니다.');
      setFile(null);
    } catch (error) {
      setStatus((error as Error).message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <form className="space-y-3 rounded-2xl border border-dashed border-slate-300 p-4 dark:border-slate-700" onSubmit={handleUpload}>
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">자료 업로드 (ADMIN)</p>
      <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
        주차 선택
        <select
          className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
          value={weekId}
          onChange={(event) => setWeekId(event.target.value)}
        >
          {weeks.map((week) => (
            <option key={week.id} value={week.id}>
              Week {week.weekNumber} · {week.title}
            </option>
          ))}
        </select>
      </label>
      <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
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
        {uploading ? '업로드 중...' : 'Cloudinary 업로드'}
      </button>
      {status ? <p className="text-xs text-slate-500 dark:text-slate-300">{status}</p> : null}
    </form>
  );
}
