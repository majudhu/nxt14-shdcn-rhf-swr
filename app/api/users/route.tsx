import { authGuard } from '@/app/api/auth/auth-guard';
import { PaginatedApiResponse, User } from '@/lib/api-types';
import { db, users } from '@/lib/schema';
import { hash } from '@node-rs/argon2';
import { count } from 'drizzle-orm';
import type { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    await authGuard();
  } catch (err) {
    return err as Response;
  }
  const page = +new URLSearchParams(new URL(req.url).search).get('page')! || 1;
  const [results, [{ value: totalResults }]] = await Promise.all([
    db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        isActive: users.isActive,
      })
      .from(users)
      .limit(10)
      .offset((page - 1) * 10),
    db.select({ value: count() }).from(users),
  ]);
  return Response.json({
    page,
    results,
    limit: 10,
    totalResults,
    totalPages: Math.ceil(totalResults / 10),
  } as PaginatedApiResponse<User>);
}

export async function POST(req: NextRequest) {
  try {
    await authGuard();
  } catch (err) {
    return err as Response;
  }
  const user = await req.json();
  user.password = await hash(user.password);
  const [{ id }] = await db
    .insert(users)
    .values(user)
    .returning({ id: users.id });
  delete user.password;
  user.id = id;
  return Response.json(user);
}
