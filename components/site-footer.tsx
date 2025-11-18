'use client';

import { useState } from 'react';
import Link from 'next/link';
import { DataObject } from '@mui/icons-material';

const footerNavLinks = [
    { href: "/#about", label: "학원소개" },
    { href: "/#courses", label: "과정안내" },
    { href: "/#news", label: "소식/이벤트" },
    { href: "/#contact", label: "문의하기" },
];

const socialLinks = [
    { href: "https://blog.naver.com/kkj0201", label: "Blog" },
    { href: "https://www.instagram.com/codingmaker_kj/", label: "Instagram" },
    { href: "mailto:contact@codingmaker.kr", label: "Email" },
];

export function SiteFooter() {
  const [open, setOpen] = useState(false);

  return (
    <footer className="bg-white dark:bg-background-dark border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="text-primary text-2xl">
                <DataObject />
              </div>
              <h3 className="text-gray-900 dark:text-white text-base font-bold">코딩메이커 아카데미 허브</h3>
            </div>
            <p className="text-secondary dark:text-gray-400">
              주소: 전남 광양시 무등길 47 (중동 1549-9)<br />
              연락처: 061-745-3355<br />
              사업자등록번호: 123-45-67890
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <h4 className="font-bold text-gray-900 dark:text-white">바로가기</h4>
            <ul className="space-y-2">
              {footerNavLinks.map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-secondary dark:text-gray-400 hover:text-primary dark:hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col gap-4">
            <h4 className="font-bold text-gray-900 dark:text-white">소셜 미디어</h4>
            <div className="flex space-x-4 text-secondary dark:text-gray-400">
              {socialLinks.map(link => (
                 <a key={link.href} href={link.href} target="_blank" rel="noreferrer" className="hover:text-primary dark:hover:text-white">
                    {link.label}
                 </a>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800 text-center text-xs text-secondary dark:text-gray-500">
          <p>© 2024 CodingMaker Academy. All rights reserved.</p>
          <Link href="/privacy" className="hover:text-primary dark:hover:text-white mt-2 inline-block">
            개인정보처리방침
          </Link>
        </div>
         <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 pt-8">
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
      </div>
    </footer>
  );
}
