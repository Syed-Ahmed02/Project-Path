import { streamText } from 'ai';
import { createOpenRouter } from '@openrouter/ai-sdk-provider';

export const maxDuration = 30;

const openrouter = createOpenRouter({ apiKey: process.env.OPENROUTER_API_KEY! });

export async function POST(req: Request) {
  const { messages } = await req.json();
  const result = streamText({
    model: openrouter('openai/gpt-4o-mini'),
    system: 'You generate an actionable, realistic project implementation plan with milestones and risks.' ,
    messages,
  });
  return result.toUIMessageStreamResponse();
}


