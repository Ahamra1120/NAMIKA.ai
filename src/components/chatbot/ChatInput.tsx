import { useState } from 'react';

interface Props {
  onSend: (text: string) => void;
  disabled: boolean;
}

export function ChatInput({ onSend, disabled }: Props) {
  const [text, setText] = useState('');

  function handleSend() {
    if (!text.trim() || disabled) return;
    onSend(text);
    setText('');
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="border-t border-gray-100 bg-white px-4 py-3">
      <div className="flex gap-3 items-end max-w-3xl mx-auto">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder="Ceritakan apa yang kamu rasakan... (Enter untuk kirim)"
          rows={1}
          className="flex-1 resize-none px-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-teal-500 focus:outline-none transition-colors text-sm leading-relaxed disabled:opacity-50 max-h-32 overflow-y-auto"
          style={{ height: 'auto' }}
          onInput={(e) => {
            const target = e.target as HTMLTextAreaElement;
            target.style.height = 'auto';
            target.style.height = Math.min(target.scrollHeight, 128) + 'px';
          }}
        />
        <button
          onClick={handleSend}
          disabled={!text.trim() || disabled}
          className="flex-shrink-0 w-12 h-12 bg-teal-500 text-white rounded-2xl flex items-center justify-center hover:bg-teal-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95"
          aria-label="Kirim pesan"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-5 h-5"
          >
            <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
          </svg>
        </button>
      </div>
      <p className="text-center text-xs text-gray-300 mt-2">
        Shift + Enter untuk baris baru
      </p>
    </div>
  );
}
