import { NextRequest, NextResponse } from 'next/server';
import { upsertRecipe, deleteRecipe } from '@/db/recipes';
import { verifySession, COOKIE_NAME } from '@/lib/session';

async function getRole(req: NextRequest) {
  const cookieValue = req.cookies.get(COOKIE_NAME)?.value ?? null;
  return cookieValue ? await verifySession(cookieValue) : null;
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const role = await getRole(req);
  if (role !== 'admin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  if (!body.title || !body.recipe_type) {
    return NextResponse.json({ error: 'title and recipe_type are required' }, { status: 400 });
  }

  const row = await upsertRecipe({ ...body, id });
  return NextResponse.json(row);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const role = await getRole(req);
  if (role !== 'admin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  await deleteRecipe(id);
  return NextResponse.json({ ok: true });
}
