import { listRecipes } from '@/db/recipes';
import RecipeAdminList from './RecipeAdminList';

export const dynamic = 'force-dynamic';

export default async function AdminRecipesPage() {
  const recipes = await listRecipes();
  const sorted = [...recipes].sort((a, b) => a.title.localeCompare(b.title));
  return <RecipeAdminList initialRecipes={sorted} />;
}
