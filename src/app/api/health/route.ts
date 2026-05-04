import { db } from '@/db/index';

export async function GET() {
  try {
    await db.$client.execute('SELECT 1');
    return Response.json({ status: 'ok', db: 'connected' }, { status: 200 });
  } catch {
    return Response.json({ status: 'error', db: 'disconnected' }, { status: 503 });
  }
}
