import { headers } from 'next/headers';
import { kv } from '@vercel/kv';
import { JwtPayload, verify } from 'jsonwebtoken';

export async function authGuard() {
  try {
    const token = headers().get('authorization')?.split('Bearer ')[1]!;
    const { sub, iat } = verify(token, process.env.JWT_SECRET!) as JwtPayload;
    if (await kv.get(`logout:${sub}:${iat}`)) {
      throw 'logged out token';
    }
    return +sub!;
  } catch (err) {
    throw Response.json(
      { code: 401, message: 'Please authenticate' },
      { status: 401 }
    );
  }
}
