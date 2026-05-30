import { useState, useRef, useEffect } from 'react';
import type { ChatSession } from '@google/generative-ai';
import type { ChatMessage } from '../types/chat';
import { createChatSession, sendChatMessage } from '../services/geminiChat';

const STORAGE_KEY = 'kawan_chat_history';

function loadHistory(): ChatMessage[] {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as ChatMessage[];
    return parsed.map((m) => ({ ...m, timestamp: new Date(m.timestamp) }));
  } catch {
    return [];
  }
}

function saveHistory(messages: ChatMessage[]) {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
}

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>(loadHistory);
  const [isStreaming, setIsStreaming] = useState(false);
  const sessionRef = useRef<ChatSession | null>(null);

  useEffect(() => {
    sessionRef.current = createChatSession();
  }, []);

  useEffect(() => {
    saveHistory(messages.filter((m) => !m.isStreaming));
  }, [messages]);

  async function sendMessage(text: string) {
    if (!text.trim() || isStreaming) return;

    if (!sessionRef.current) {
      sessionRef.current = createChatSession();
    }

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: text.trim(),
      timestamp: new Date(),
    };

    const aiMsgId = crypto.randomUUID();
    const aiMsg: ChatMessage = {
      id: aiMsgId,
      role: 'model',
      content: '',
      timestamp: new Date(),
      isStreaming: true,
    };

    setMessages((prev) => [...prev, userMsg, aiMsg]);
    setIsStreaming(true);

    try {
      const stream = sendChatMessage(sessionRef.current, text.trim());
      for await (const chunk of stream) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === aiMsgId ? { ...m, content: m.content + chunk } : m
          )
        );
      }
    } catch (err) {
      const errText =
        err instanceof Error
          ? `Maaf, ada kendala: ${err.message}`
          : 'Maaf, terjadi kesalahan. Coba lagi.';
      setMessages((prev) =>
        prev.map((m) =>
          m.id === aiMsgId ? { ...m, content: errText } : m
        )
      );
    } finally {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === aiMsgId ? { ...m, isStreaming: false } : m
        )
      );
      setIsStreaming(false);
    }
  }

  function clearChat() {
    sessionRef.current = createChatSession();
    setMessages([]);
    sessionStorage.removeItem(STORAGE_KEY);
  }

  return { messages, isStreaming, sendMessage, clearChat };
}
