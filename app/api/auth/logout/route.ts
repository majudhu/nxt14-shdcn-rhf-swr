import { JwtPayload, verify } from 'jsonwebtoken';
import { headers } from 'next/headers';
import { kv } from '@vercel/kv';

export async function POST() {
  try {
    const token = headers().get('authorization')?.split('Bearer ')[1]!;
    const { sub, iat, exp } = verify(
      token,
      process.env.JWT_SECRET!
    ) as JwtPayload;
    kv.set(`logout:${sub}:${iat}`, exp, { exat: exp! });
    return new Response(null, { status: 204 });
  } catch (err) {
    return Response.json(
      { code: 401, message: 'Please authenticate' },
      { status: 401 }
    );
  }
}
