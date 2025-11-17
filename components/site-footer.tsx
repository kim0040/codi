import Link from 'next/link';

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-[#0b121b]">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-slate-500 dark:text-slate-400 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-semibold text-slate-900 dark:text-white">코딩메이커 아카데미 허브</p>
          <p>서울특별시 성동구 성수동 123 · 대표: 김원장 · 사업자등록 123-45-67890</p>
        </div>
        <div className="flex flex-wrap gap-4">
          <a href="mailto:contact@codingmaker.kr" className="hover:text-primary">contact@codingmaker.kr</a>
          <a href="tel:02-123-4567" className="hover:text-primary">02-123-4567</a>
          <Link href="/kiosk/login" className="hover:text-primary">
            키오스크 로그인
          </Link>
        </div>
      </div>
    </footer>
  );
}
