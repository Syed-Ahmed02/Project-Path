import { convertToModelMessages, streamText, UIMessage } from 'ai';
import { createOpenRouter } from '@openrouter/ai-sdk-provider';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY!,
});

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();
  const result = streamText({
    model: openrouter('openai/gpt-4o-mini'),
    system: "You are a helpful assistant that generates ideas for a startup.",
    messages: convertToModelMessages(messages),
    
  });

  return result.toUIMessageStreamResponse();
}