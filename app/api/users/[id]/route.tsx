import { authGuard } from '@/app/api/auth/auth-guard';
import { db, users } from '@/lib/schema';
import { hash } from '@node-rs/argon2';
import { eq } from 'drizzle-orm';
import type { NextRequest } from 'next/server';

interface Params {
  params: { id: string };
}

export async function GET(req: NextRequest, { params: { id } }: Params) {
  const [user] = await db
    .select({
      id: users.id,
      name: users.name,
      role: users.role,
      email: users.email,
    })
    .from(users)
    .where(eq(users.id, +id))
    .limit(1);
  if (user) {
    return Response.json(user);
  } else {
    return Response.json(
      { code: 404, message: 'User not found' },
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
  if (+id === 1) {
    return Response.json(
      { code: 403, message: 'Cannot update the admin user' },
      { status: 403 }
    );
  }
  const data = await req.json();
  if (data.password) data.password = await hash(data.password);
  const [user] = await db
    .update(users)
    .set(data)
    .where(eq(users.id, +id))
    .returning({
      id: users.id,
      name: users.name,
      role: users.role,
      email: users.email,
    });
  return Response.json(user);
}

export async function DELETE(req: NextRequest, { params: { id } }: Params) {
  try {
    await authGuard();
  } catch (err) {
    return err as Response;
  }
  if (+id === 1) {
    return Response.json(
      { code: 403, message: 'Cannot delete the admin user' },
      { status: 403 }
    );
  }
  await db.delete(users).where(eq(users.id, +id));
  return new Response(null, { status: 204 });
}
