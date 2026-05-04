import { NextRequest, NextResponse } from 'next/server';
import { listRecipes, upsertRecipe } from '@/db/recipes';
import { verifySession, COOKIE_NAME } from '@/lib/session';

async function getRole(req: NextRequest) {
  const cookieValue = req.cookies.get(COOKIE_NAME)?.value ?? null;
  return cookieValue ? await verifySession(cookieValue) : null;
}

export async function GET(req: NextRequest) {
  const role = await getRole(req);
  if (role !== 'admin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const rows = await listRecipes();
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  const role = await getRole(req);
  if (role !== 'admin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  if (!body.title || !body.recipe_type) {
    return NextResponse.json({ error: 'title and recipe_type are required' }, { status: 400 });
  }

  const row = await upsertRecipe(body);
  return NextResponse.json(row, { status: 201 });
}
