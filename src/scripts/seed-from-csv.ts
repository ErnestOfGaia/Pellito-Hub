/**
 * Seed script: parses ingest/recipes.csv and upserts all recipes into SQLite.
 * Run with: npm run seed
 * Idempotent — safe to run multiple times.
 */
import { readFileSync, mkdirSync } from 'fs';
import path from 'path';
import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import { recipes } from '../db/schema';
import { eq } from 'drizzle-orm';

// ---------------------------------------------------------------------------
// DB setup (mirrors src/db/index.ts but standalone — no Next.js context)
// ---------------------------------------------------------------------------
mkdirSync(path.join(process.cwd(), 'data'), { recursive: true });

const client = createClient({
  url: `file:${path.join(process.cwd(), 'data/dev.db')}`,
});
const db = drizzle(client);

// ---------------------------------------------------------------------------
// CSV parser — handles quoted fields and pipe-delimited array columns
// ---------------------------------------------------------------------------
const ARRAY_COLUMNS = new Set(['ingredients', 'cook_steps', 'plate_steps', 'allergens']);

function parseCsvLine(line: string): string[] {
  const fields: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === ',' && !inQuotes) {
      fields.push(current);
      current = '';
    } else {
      current += ch;
    }
  }
  fields.push(current);
  return fields;
}

function parsePipeArray(raw: string): string[] {
  if (!raw.trim()) return [];
  return raw.split('|').map(s => s.trim()).filter(Boolean);
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function seed() {
  const csvPath = path.join(process.cwd(), 'ingest', 'recipes.csv');
  const raw = readFileSync(csvPath, 'utf-8');
  const lines = raw.split(/\r?\n/).filter(Boolean);

  const headers = parseCsvLine(lines[0]);
  const dataRows = lines.slice(1);

  console.log(`📋 Parsed ${dataRows.length} recipes from CSV`);

  let upserted = 0;
  let skipped = 0;

  for (const line of dataRows) {
    const values = parseCsvLine(line);
    const row: Record<string, string> = {};
    headers.forEach((h, i) => { row[h] = values[i] ?? ''; });

    const title = row.title?.trim();
    if (!title) { skipped++; continue; }

    // Build the record, splitting pipe-delimited array columns
    const record = {
      title,
      recipe_type: row.recipe_type?.trim() || 'Core',
      station: row.station?.trim() || null,
      is_new: row.is_new?.trim().toLowerCase() === 'true',
      yield: row.yield?.trim() || null,
      prep_time: row.prep_time?.trim() || null,
      shelf_life: row.shelf_life?.trim() || null,
      original_date: row.original_date?.trim() || null,
      revision_date: row.revision_date?.trim() || null,
      plateware: row.plateware?.trim() || null,
      ingredients: parsePipeArray(row.ingredients ?? ''),
      cook_steps: parsePipeArray(row.cook_steps ?? ''),
      plate_steps: parsePipeArray(row.plate_steps ?? ''),
      allergens: parsePipeArray(row.allergens ?? ''),
      marketing_lore: row.marketing_lore?.trim() || null,
      status: (row.status?.trim() as 'draft' | 'published' | 'archived') || 'published',
      updated_at: new Date(),
    };

    // Upsert by title (idempotent)
    const existing = await db
      .select({ id: recipes.id })
      .from(recipes)
      .where(eq(recipes.title, title))
      .limit(1);

    if (existing.length > 0) {
      await db
        .update(recipes)
        .set(record)
        .where(eq(recipes.title, title));
      console.log(`  ↻  Updated: ${title}`);
    } else {
      await db.insert(recipes).values(record);
      console.log(`  ✓  Inserted: ${title}`);
    }
    upserted++;
  }

  console.log(`\n✅ Done — ${upserted} upserted, ${skipped} skipped`);
  process.exit(0);
}

seed().catch(err => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
