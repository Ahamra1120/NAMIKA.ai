import { chatModel } from '../config/gemini';
import type { ChatSession } from '@google/generative-ai';

export function createChatSession(): ChatSession {
  return chatModel.startChat({
    history: [],
  });
}

export async function* sendChatMessage(
  session: ChatSession,
  message: string
): AsyncGenerator<string> {
  const result = await session.sendMessageStream(message);
  for await (const chunk of result.stream) {
    const text = chunk.text();
    if (text) yield text;
  }
}
