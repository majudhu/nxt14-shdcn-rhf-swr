import { authGuard } from '@/app/api/auth/auth-guard';
import { PaginatedApiResponse } from '@/lib/api-types';
import { db, files, news } from '@/lib/schema';
import { and, count, eq } from 'drizzle-orm';
import type { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const query = new URLSearchParams(new URL(req.url).search);
  const page = +query.get('page')! || 1;
  const language = query.get('language');
  const category = query.get('category');
  const whereQuery = and(
    language ? eq(news.language, language) : undefined,
    category ? eq(news.category, category) : undefined
  );
  const [results, [{ value: totalResults }]] = await Promise.all([
    db
      .select({
        id: news.id,
        title: news.title,
        category: news.category,
        publishedDate: news.publishedDate,
        language: news.language,
        thumbnailId: news.thumbnailId,
        thumbnail: files,
      })
      .from(news)
      .where(whereQuery)
      .limit(10)
      .offset((page - 1) * 10)
      .leftJoin(files, eq(news.thumbnailId, files.id)),
    db.select({ value: count() }).from(news).where(whereQuery),
  ]);
  return Response.json({
    page,
    results,
    limit: 10,
    totalResults,
    totalPages: Math.ceil(totalResults / 10),
  } as PaginatedApiResponse<any>);
}

export async function POST(req: NextRequest) {
  try {
    await authGuard();
  } catch (err) {
    return err as Response;
  }
  const item = await req.json();
  const [[{ id }], [thumbnail]] = await Promise.all([
    db.insert(news).values(item).returning({ id: news.id }),
    db.select().from(files).where(eq(files.id, item.thumbnailId)).limit(1),
  ]);
  item.thumbnail = thumbnail;
  item.id = id;
  return Response.json(item);
}
