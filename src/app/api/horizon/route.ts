import { streamText, UIMessage, convertToModelMessages } from 'ai';
import { useOpenRouter } from '../../../utils/useOpenRouter';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
    const { input }  = await req.json();

    const result = streamText({
      model: useOpenRouter.chat('openrouter/horizon-beta'),
      system: "You are a helpful assistant that generates ideas for a startup.",
      prompt: input,
    });
    console.log("result",result);
    return result.toUIMessageStreamResponse();
}