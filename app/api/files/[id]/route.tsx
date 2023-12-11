import { authGuard } from '@/app/api/auth/auth-guard';
import { db, files } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import type { NextRequest } from 'next/server';

interface Params {
  params: { id: string };
}

export async function GET(req: NextRequest, { params: { id } }: Params) {
  const [file] = await db
    .select()
    .from(files)
    .where(eq(files.id, +id))
    .limit(1);
  if (file) {
    return Response.json(file);
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
  const [file] = await db
    .update(files)
    .set(data)
    .where(eq(files.id, +id))
    .returning({
      id: files.id,
      name: files.name,
      displayName: files.displayName,
      mimetype: files.mimetype,
    });
  return Response.json(file);
}
