import { NextRequest, NextResponse } from 'next/server';
import { upsertQuizQuestion } from '@/db/recipes';
import { verifySession, COOKIE_NAME } from '@/lib/session';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const cookieValue = req.cookies.get(COOKIE_NAME)?.value ?? null;
  const role = cookieValue ? await verifySession(cookieValue) : null;
  if (role !== 'admin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  if (!body.question_text || typeof body.question_text !== 'string') {
    return NextResponse.json({ error: 'question_text is required' }, { status: 400 });
  }

  await upsertQuizQuestion({ id, question_text: body.question_text, question_text_es: body.question_text_es });
  return NextResponse.json({ ok: true });
}
