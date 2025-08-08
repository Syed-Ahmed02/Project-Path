import { convertToModelMessages, streamText, UIMessage } from 'ai';
import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { webSearch } from '@/lib/ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY!,
});

export async function POST(req: Request) {
  const body = await req.json();
  const messages = Array.isArray(body?.messages) ? (body.messages as UIMessage[]) : [];

  // Extract last user text best-effort for web search query
  const lastUser = [...messages].reverse().find((m) => m.role === 'user');
  let queryText = '';
  if (lastUser) {
    const anyMsg: any = lastUser as any;
    if (typeof anyMsg.content === 'string') queryText = anyMsg.content;
    else if (Array.isArray(anyMsg.parts) && anyMsg.parts[0]?.text) queryText = anyMsg.parts[0].text as string;
  }
  const results = await webSearch(queryText || '');

  const systemAugmented = `You are a helpful assistant that generates ideas for a startup. Return a concise, high-signal, differentiated idea.\n\nConsider these similar projects found online and avoid overlap:\n${results
    .map((r, i) => `${i + 1}. ${r.title} - ${r.url}\n${r.snippet ?? ''}`)
    .join('\n\n')}`;

  const result = streamText({
    model: openrouter('openai/gpt-4o-mini'),
    system: systemAugmented,
    messages: convertToModelMessages(messages),
  });
  return result.toUIMessageStreamResponse();
}