import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { generateText } from 'ai';

const openrouter = createOpenRouter({ apiKey: process.env.OPENROUTER_API_KEY! });

export type WebSearchResult = {
  title: string;
  url: string;
  snippet?: string;
};

export async function webSearch(query: string): Promise<WebSearchResult[]> {
  // Placeholder: use a simple free API interface. Replace with your provider.
  // You can swap to Serper, Tavily, or SearchAPI; keep return shape stable.
  try {
    const res = await fetch(process.env.WEB_SEARCH_ENDPOINT as string, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.WEB_SEARCH_API_KEY}`,
      },
      body: JSON.stringify({ q: query, num: 5 }),
      cache: 'no-store',
    });
    if (!res.ok) return [];
    const data = await res.json();
    // Normalize common shapes
    const items: any[] = data.results ?? data.items ?? [];
    return items.slice(0, 5).map((i) => ({
      title: i.title ?? i.name ?? 'Result',
      url: i.url ?? i.link ?? i.href ?? '#',
      snippet: i.snippet ?? i.description ?? i.content ?? undefined,
    }));
  } catch {
    return [];
  }
}

export async function generateIdea(inputs: unknown, searchResults: WebSearchResult[]) {
  const system = `You help generate unique, high-signal project ideas.
You will be given prior ideas and/or a target niche. Consider the web search results of similar concepts and produce a more differentiated idea.`;

  const user = `Inputs JSON:\n${JSON.stringify(inputs, null, 2)}\n\nSimilar ideas online:\n${searchResults.map((r, i) => `${i + 1}. ${r.title} - ${r.url}\n${r.snippet ?? ''}`).join('\n\n')}`;

  const { text } = await generateText({
    model: openrouter('openai/gpt-4o-mini'),
    system,
    prompt: user,
  });
  return text;
}

export async function generatePlan(fromIdea: string) {
  const system = `You are a senior product/engineering planner.
Create a concise, step-by-step, realistic implementation plan for the proposed idea.
Include: architecture sketch, milestones, features, risks, and success metrics.`;
  const user = fromIdea;
  const { text } = await generateText({
    model: openrouter('openai/gpt-4o-mini'),
    system,
    prompt: user,
  });
  return text;
}


