'use client';

const formatterCache = new Map<string, Intl.DateTimeFormat>();

type Props = {
  value: string | number | Date;
  options?: Intl.DateTimeFormatOptions;
};

const defaultOptions: Intl.DateTimeFormatOptions = {
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit'
};

export function FormattedDate({ value, options }: Props) {
  const locale = typeof navigator !== 'undefined' ? navigator.language : 'ko-KR';
  const key = `${locale}-${JSON.stringify(options ?? defaultOptions)}`;
  const formatter = formatterCache.get(key) ?? new Intl.DateTimeFormat(locale, options ?? defaultOptions);
  if (!formatterCache.has(key)) {
    formatterCache.set(key, formatter);
  }
  const date = typeof value === 'string' || typeof value === 'number' ? new Date(value) : value;
  return formatter.format(date);
}
