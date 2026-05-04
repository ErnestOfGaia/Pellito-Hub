import { notFound } from 'next/navigation';
import { getRecipe, listQuizQuestions } from '@/db/recipes';
import RecipeForm from './RecipeForm';

export const dynamic = 'force-dynamic';

export default async function AdminRecipeEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const isNew = id === 'new';
  const recipe = isNew ? null : await getRecipe(id);
  if (!isNew && !recipe) notFound();
  const questions = recipe ? await listQuizQuestions(recipe.id) : [];
  return <RecipeForm recipe={recipe} questions={questions} />;
}
