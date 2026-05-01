import { NextRequest, NextResponse } from 'next/server';
import { listRecipes } from '@/db/recipes';

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const search = searchParams.get('search') ?? undefined;
  const type = searchParams.get('type') ?? undefined;

  const rows = await listRecipes({
    status: 'published',
    station: type,
    search,
  });

  return NextResponse.json(rows);
}
