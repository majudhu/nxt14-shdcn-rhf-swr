import type { users } from '@/lib/schema';
import type { AxiosError } from 'axios';
import type { Descendant } from 'slate';

export type AxiosApiError = AxiosError<{ code: number; message: string }>;

export interface LoginPostResponse {
  user: User;
  tokens: {
    access: { token: string; expires: string };
    refresh?: { token: string; expires: string };
  };
}

export interface PaginatedApiResponse<Result> {
  results: Result[];
  page: number;
  limit: number;
  totalPages: number;
  totalResults: number;
}

export interface FileUpload {
  id: number;
  name: string;
  displayName?: string;
  mimetype: string;
}

export function getImgUrl(
  src: string | FileUpload | null | undefined,
  size: 500 | 1000 | 1500
) {
  if ((typeof src === 'object' && !src?.name) || !src) return '';
  return `/uploads/images/${size}/${(typeof src === 'object'
    ? src.name
    : src
  ).replace(/(.*\.).*/, '$1webp')}`;
}

export type User = Omit<typeof users.$inferSelect, 'password'>;

type Language = 'en' | 'dv';

export interface HomePage {
  banners: {
    title: string;
    description?: string;
    image: FileUpload;
    link: string;
  }[];
  language: Language;
}

export async function apiFetch<Result>(url: string): Promise<Result | null> {
  try {
    const res = await fetch('http://localhost:3000/api/' + url, {
      cache: 'no-store',
    });
    const data = await res.json();
    if (res.ok) return data;
    else throw data;
  } catch (e) {
    console.error(`Error fetching ${url} from API`);
    console.error(e);
    return null;
  }
}

export function setCacheHeader(
  res: import('next').GetServerSidePropsContext['res'],
  maxage: number
) {
  res.setHeader(
    'Cache-Control',
    `public, max-age=${maxage}, s-maxage=${maxage}`
  );
}

export interface ApiFile {
  id: number;
  name: string;
  displayName: string;
  mimetype: string;
}

export interface News {
  id: number;
  title: string;
  category: string;
  publishedDate: string;
  thumbnail: FileUpload | null;
  thumbnailId: number | null;
  content: Descendant[];
  language: Language;
}

export type NewsList = PaginatedApiResponse<Omit<News, 'content'>>;

export const LANGUAGES_OPTIONS: { value: Language; label: string }[] = [
  { value: 'en', label: 'English' },
  { value: 'dv', label: 'Dhivehi' },
];

export const LANGUAGE_LABEL: Record<Language, string> = {
  en: 'English',
  dv: 'Dhivehi',
};
