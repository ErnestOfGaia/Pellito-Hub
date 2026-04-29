/**
 * Recipe Repository — stable interface hiding the DB implementation.
 * Prototype: SQLite via Drizzle. V1+: swap to Postgres without changing callers.
 */
import { eq, and } from 'drizzle-orm';
import { db } from './index';
import { recipes } from './schema';

export type RecipeRow = typeof recipes.$inferSelect;
export type RecipeInput = Omit<typeof recipes.$inferInsert, 'id' | 'created_at' | 'updated_at'>;

export interface RecipeFilter {
  status?: 'draft' | 'published' | 'archived';
  recipe_type?: string;
}

// ---------------------------------------------------------------------------
// getRecipe — fetch a single recipe by ID
// ---------------------------------------------------------------------------
export async function getRecipe(id: string): Promise<RecipeRow | null> {
  const rows = await db
    .select()
    .from(recipes)
    .where(eq(recipes.id, id))
    .limit(1);
  return rows[0] ?? null;
}

// ---------------------------------------------------------------------------
// listRecipes — list all recipes with optional filtering
// ---------------------------------------------------------------------------
export async function listRecipes(filter?: RecipeFilter): Promise<RecipeRow[]> {
  const conditions = [];

  if (filter?.status) {
    conditions.push(eq(recipes.status, filter.status));
  }
  if (filter?.recipe_type) {
    conditions.push(eq(recipes.recipe_type, filter.recipe_type));
  }

  if (conditions.length === 0) {
    return db.select().from(recipes);
  }
  return db.select().from(recipes).where(and(...conditions));
}

// ---------------------------------------------------------------------------
// upsertRecipe — insert or update by ID (create if no id provided)
// ---------------------------------------------------------------------------
export async function upsertRecipe(
  input: RecipeInput & { id?: string },
): Promise<RecipeRow> {
  const { id, ...rest } = input;

  if (id) {
    // Update
    await db
      .update(recipes)
      .set({ ...rest, updated_at: new Date() })
      .where(eq(recipes.id, id));
    const updated = await getRecipe(id);
    if (!updated) throw new Error(`Recipe ${id} not found after update`);
    return updated;
  }

  // Insert — let schema generate the UUID
  const [inserted] = await db
    .insert(recipes)
    .values(rest)
    .returning();
  return inserted;
}

// ---------------------------------------------------------------------------
// deleteRecipe — hard delete by ID
// ---------------------------------------------------------------------------
export async function deleteRecipe(id: string): Promise<void> {
  await db.delete(recipes).where(eq(recipes.id, id));
}
