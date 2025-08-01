import { createOpenRouter } from '@openrouter/ai-sdk-provider';

export const useOpenRouter = createOpenRouter({
    apiKey: process.env.OPENROUTER_API_KEY!,
  });