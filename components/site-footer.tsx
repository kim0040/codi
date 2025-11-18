'use client';

import { useState } from 'react';
import Link from 'next/link';

export function SiteFooter() {
  const [open, setOpen] = useState(false);

  return (
    <footer className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-[#0b121b]">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-slate-500 dark:text-slate-400 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-semibold text-slate-900 dark:text-white">코딩메이커 아카데미 허브</p>
          <p>전남 광양시 무등길 47 · 대표: 김원장 · 사업자등록 123-45-67890</p>
        </div>
        <div className="flex flex-wrap gap-4">
          <a href="mailto:contact@codingmaker.kr" className="hover:text-primary">contact@codingmaker.kr</a>
          <a href="tel:02-123-4567" className="hover:text-primary">02-123-4567</a>
          <Link href="/kiosk/login" className="hover:text-primary">
            키오스크 로그인
          </Link>
        </div>
      </div>
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 pb-8">
        <button
          type="button"
          className="flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-primary hover:text-primary dark:border-slate-700 dark:text-slate-300"
          onClick={() => setOpen((prev) => !prev)}
        >
          사이트에 관하여
          <span className="text-xs">{open ? '접기 ▲' : '자세히 ▼'}</span>
        </button>
        {open ? (
          <div className="space-y-3 rounded-2xl border border-slate-100 bg-slate-50/60 p-4 text-sm text-slate-600 dark:border-slate-800 dark:bg-white/5 dark:text-slate-300">
            <p>
              코딩메이커학원은 자체 LMS·프로젝트·키오스크 시스템까지 직접 제작합니다. 이 사이트 역시 광양 중동 캠퍼스 학생과 멘토가 협업해 Next.js, Prisma, Cloudinary 등 100% 무료 스택으로 구현했습니다.
            </p>
            <p>
              개발자 소개: 김현민 — 코딩메이커에 가장 먼저 등록해 수강했던 1기 학생이며, 현재는 대학생으로 재학 중입니다. 학원 운영 노하우를 직접 반영하고, 실무와 교육이 연결되는 플랫폼을 만들고자 꾸준히 개선하고 있습니다.
            </p>
            <p>
              앞으로도 학원에서 사용하는 모든 디지털 도구를 자체 제작·확장하여 학생·학부모·멘토에게 더 나은 경험을 제공하겠습니다.
            </p>
          </div>
        ) : null}
      </div>
    </footer>
  );
}
