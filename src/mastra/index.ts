import { Mastra } from '@mastra/core';
import { Agent } from '@mastra/core/agent';
import { createTool } from '@mastra/core/tools';
import { createAnthropic } from '@ai-sdk/anthropic';
import { z } from 'zod';

const anthropic = createAnthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Prototype tool: fetch a recipe by name from context (no RAG yet)
const getRecipeTool = createTool({
  id: 'getRecipe',
  description: 'Look up a recipe by name from the Pelican Brewery recipe list.',
  inputSchema: z.object({
    name: z.string().describe('Recipe name to look up'),
  }),
  execute: async ({ name }) => {
    // Prototype stub — real implementation queries db in V1
    return { result: `Recipe lookup for "${name}" is not yet implemented in prototype.` };
  },
});

export const pellitoAgent = new Agent({
  id: 'pellito',
  name: 'Pellito',
  instructions: `You are Pellito the Deckhand, a helpful kitchen training assistant for Pelican Brewery in Pacific City, Oregon.
You help line cooks learn recipes, understand procedures, and prepare for quizzes.
You answer questions about Pelican Brewery recipes clearly and concisely.
If asked about topics outside kitchen training (legal, medical, bartending, personal), politely redirect to recipe and food prep questions.
Keep answers brief and practical — line cooks are busy.`,
  model: anthropic('claude-haiku-4-5-20251001'),
  tools: { getRecipeTool },
});

export const mastra = new Mastra({
  agents: { pellitoAgent },
});
