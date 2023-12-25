import { LoginPostResponse } from '@/lib/api-types';
import { db, users } from '@/lib/schema';
import { verify } from '@node-rs/argon2';
import { eq } from 'drizzle-orm';
import { sign } from 'jsonwebtoken';
import type { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);
  if (user && (await verify(user.password, password))) {
    // @ts-expect-error remove password from response
    delete user.password;
    const issuedAt = Math.trunc(Date.now() / 1000);
    return Response.json({
      user,
      tokens: {
        access: {
          expires: new Date(issuedAt + 5 * 60 * 1000) as unknown as string,
          token: sign(
            { sub: user.id, iat: issuedAt },
            process.env.JWT_SECRET!,
            {
              expiresIn: '5m',
            }
          ),
        },
      },
    } as LoginPostResponse);
  } else {
    return Response.json(
      { code: 401, message: 'Invalid email or password' },
      { status: 401 }
    );
  }
}
