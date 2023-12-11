import { authGuard } from '@/app/api/auth/auth-guard';
import { db, files, news } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import type { NextRequest } from 'next/server';

interface Params {
  params: { id: string };
}

export async function GET(req: NextRequest, { params: { id } }: Params) {
  if (id === 'categories') {
    const language = new URLSearchParams(new URL(req.url).search).get(
      'language'
    );
    const categories = await db
      .selectDistinct({
        category: news.category,
      })
      .from(news)
      .where(language ? eq(news.language, language) : undefined);
    return Response.json(categories.map((c) => c.category));
  }
  const [item] = await db
    .select()
    .from(news)
    .where(eq(news.id, +id || 0))
    .limit(1)
    .leftJoin(files, eq(news.thumbnailId, files.id));
  if (item) {
    return Response.json({ ...item.news, thumbnail: item.files });
  } else {
    return Response.json(
      { code: 404, message: 'File not found' },
      { status: 404 }
    );
  }
}

export async function PATCH(req: NextRequest, { params: { id } }: Params) {
  try {
    await authGuard();
  } catch (err) {
    return err as Response;
  }
  const data = await req.json();
  const [[item], [thumbnail]] = await Promise.all([
    db.update(news).set(data).where(eq(news.id, +id)).returning({
      id: news.id,
      title: news.title,
      category: news.category,
      publishedDate: news.publishedDate,
      content: news.content,
      language: news.language,
    }),
    db.select().from(files).where(eq(files.id, data.thumbnailId)).limit(1),
  ]);
  return Response.json({ ...item, thumbnail });
}

export async function DELETE(req: NextRequest, { params: { id } }: Params) {
  try {
    await authGuard();
  } catch (err) {
    return err as Response;
  }
  await db.delete(news).where(eq(news.id, +id));
  return new Response(null, { status: 204 });
}
