import { NextRequest } from 'next/server';
import { signSession, COOKIE_NAME } from '@/lib/session';

type Role = 'admin' | 'linecook';

const CREDENTIALS: Record<string, Role> = {
  'admin:admin': 'admin',
  'linecook:linecook': 'linecook',
};

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();
  const role = CREDENTIALS[`${username}:${password}`];

  if (!role) {
    return Response.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const sessionValue = await signSession(role);
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  const cookieHeader = `${COOKIE_NAME}=${sessionValue}; HttpOnly; SameSite=Lax; Path=/${secure}`;

  return Response.json({ role }, {
    status: 200,
    headers: { 'Set-Cookie': cookieHeader },
  });
}
