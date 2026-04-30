import { listRecipes } from '@/db/recipes';
import RecipeList from './RecipeList';

export default async function DashboardPage() {
  const recipes = await listRecipes({ status: 'published' });
  const sorted = [...recipes].sort((a, b) => a.title.localeCompare(b.title));
  return <RecipeList initialRecipes={sorted} />;
}
