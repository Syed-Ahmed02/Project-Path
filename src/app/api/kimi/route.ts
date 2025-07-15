import { streamText, UIMessage, convertToModelMessages } from 'ai';
import { useOpenRouter } from '../../../../utils/useOpenRouter';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
    const { messages }: { messages: UIMessage[] } = await req.json();

    const result = streamText({
      model: useOpenRouter.chat('meta-llama/llama-3.1-405b-instruct'),
      messages: convertToModelMessages(messages),
    });
  
    return result.toUIMessageStreamResponse();
}