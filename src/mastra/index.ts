import { Mastra } from '@mastra/core';
import { pellitoDeckhhandAgent } from './agents/pellito-deckhand';

export { pellitoDeckhhandAgent } from './agents/pellito-deckhand';
export { isRecipeQuery, formatRecipesContext } from './agents/pellito-deckhand';

export const mastra = new Mastra({
  agents: { pellitoDeckhhandAgent },
});
