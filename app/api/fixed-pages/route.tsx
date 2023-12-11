import { authGuard } from '@/app/api/auth/auth-guard';
import { kv } from '@vercel/kv';
import type { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const params = new URLSearchParams(new URL(req.url).search);
  return Response.json(
    (await kv.get(
      `fixed-page-${params.get('page')}-${params.get('language')}`
    )) ?? { banners: [] }
  );
}

export async function PUT(req: NextRequest) {
  try {
    await authGuard();
  } catch (err) {
    return err as Response;
  }
  const data = await req.json();
  await kv.set(`fixed-page-${data.page}-${data.language}`, data);
  return Response.json(data);
}
