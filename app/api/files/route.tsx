import { authGuard } from '@/app/api/auth/auth-guard';
import { PaginatedApiResponse } from '@/lib/api-types';
import { db, files } from '@/lib/schema';
import { count } from 'drizzle-orm';
import type { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const page = +new URLSearchParams(new URL(req.url).search).get('page')! || 1;
  const [results, [{ value: totalResults }]] = await Promise.all([
    db
      .select()
      .from(files)
      .limit(10)
      .offset((page - 1) * 10),
    db.select({ value: count() }).from(files),
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
  const file = await req.json();
  const [{ id }] = await db
    .insert(files)
    .values(file)
    .returning({ id: files.id });
  file.id = id;
  return Response.json(file);
}
