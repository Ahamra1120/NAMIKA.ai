import { chatModel } from '../config/gemini';
import { CHATBOT_SYSTEM_PROMPT } from '../constants/prompts';
import type { ChatSession } from '@google/generative-ai';

export function createChatSession(): ChatSession {
  return chatModel.startChat({
    history: [],
    systemInstruction: CHATBOT_SYSTEM_PROMPT,
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
