import { authGuard } from '@/app/api/auth/auth-guard';
import { db, users } from '@/lib/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const userId = await authGuard();
    const [user] = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        isActive: users.isActive,
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);
    if (user) {
      return Response.json(user);
    } else {
      return Response.json(
        { code: 404, message: 'User not found' },
        { status: 404 }
      );
    }
  } catch (err) {
    return err as Response;
  }
}
