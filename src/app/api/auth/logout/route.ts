import { COOKIE_NAME } from '@/lib/session';

export async function POST() {
  const cookieHeader = `${COOKIE_NAME}=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0`;
  return Response.json({ ok: true }, {
    status: 200,
    headers: { 'Set-Cookie': cookieHeader },
  });
}
