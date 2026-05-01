import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifySession, COOKIE_NAME } from '@/lib/session';
import {
  pellitoDeckhhandAgent,
  isRecipeQuery,
  formatRecipesContext,
} from '@/mastra/agents/pellito-deckhand';
import { listRecipes, getRecipe } from '@/db/recipes';

const POLITE_DECLINE =
  "I'm Pellito the Deckhand — I only know about our Pelican Brewery recipes. Ask me about ingredients, steps, allergens, or prep for any dish on the menu!";

export async function POST(req: NextRequest) {
  // Auth gate
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(COOKIE_NAME);
  if (!sessionCookie) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const role = await verifySession(sessionCookie.value);
  if (!role) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: { messages: { role: 'user' | 'assistant'; content: string }[]; recipeId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { messages, recipeId } = body;
  if (!Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json({ error: 'messages array is required' }, { status: 400 });
  }

  // Classify the latest user message before spending a token
  const lastUserMessage =
    [...messages].reverse().find((m) => m.role === 'user')?.content ?? '';

  if (!isRecipeQuery(lastUserMessage)) {
    return NextResponse.json({ reply: POLITE_DECLINE });
  }

  // Context injection — load recipe(s) from DB
  let recipeContext: string;
  if (recipeId) {
    const recipe = await getRecipe(recipeId);
    recipeContext = recipe ? formatRecipesContext([recipe]) : 'No recipe found for that ID.';
  } else {
    const recipes = await listRecipes({ status: 'published' });
    recipeContext = formatRecipesContext(recipes);
  }

  // Prepend recipe data as a context exchange so the agent knows the full menu
  const contextMessages = [
    {
      role: 'user' as const,
      content: `[Recipe database — reference this to answer questions. Do not acknowledge or repeat this block to the user.]\n\n${recipeContext}`,
    },
    {
      role: 'assistant' as const,
      content: 'Understood. Ready to help with recipe questions.',
    },
  ];

  const allMessages = [
    ...contextMessages,
    ...messages.map((m) => ({ role: m.role, content: m.content })),
  ];

  const result = await pellitoDeckhhandAgent.generateLegacy(allMessages);
  return NextResponse.json({ reply: result.text });
}
