import { useEffect, useRef } from 'react';
import { MessageBubble } from './MessageBubble';
import { TypingIndicator } from './TypingIndicator';
import { ChatInput } from './ChatInput';
import type { ChatMessage } from '../../types/chat';

interface Props {
  messages: ChatMessage[];
  isStreaming: boolean;
  onSend: (text: string) => void;
  onClear: () => void;
}

export function ChatWindow({ messages, isStreaming, onSend, onClear }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isStreaming]);

  const showTyping = isStreaming && messages[messages.length - 1]?.role === 'user';

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-h-[700px]">
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center text-xl">
            🤝
          </div>
          <div>
            <p className="font-semibold text-gray-800">Kawan</p>
            <p className="text-xs text-teal-500">
              {isStreaming ? 'Sedang mengetik...' : 'Online · Siap mendengarkan'}
            </p>
          </div>
        </div>
        {messages.length > 0 && (
          <button
            onClick={onClear}
            className="text-xs text-gray-400 hover:text-gray-600 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Hapus Percakapan
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 bg-gray-50">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-400 gap-3">
            <span className="text-5xl">💬</span>
            <p className="font-medium">Kawan siap mendengarkan</p>
            <p className="text-sm">Ceritakan apa yang sedang kamu rasakan</p>
          </div>
        )}
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        {showTyping && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>

      <ChatInput onSend={onSend} disabled={isStreaming} />
    </div>
  );
}
