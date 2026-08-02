import type { ChatMessage } from '../../types/chat';

interface Props {
  message: ChatMessage;
}

function formatTime(date: Date) {
  return new Intl.DateTimeFormat('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function MessageBubble({ message }: Props) {
  const isUser = message.role === 'user';

  if (isUser) {
    return (
      <div className="flex justify-end mb-4 animate-message-pop">
        <div className="max-w-[80%]">
          <div className="bg-teal-500 text-white px-4 py-3 rounded-2xl rounded-tr-sm shadow-sm">
            <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{message.content}</p>
          </div>
          <p className="text-xs text-gray-400 text-right mt-1 px-1">
            {formatTime(message.timestamp)}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3 mb-4 animate-message-pop">
      <div className="flex-shrink-0 w-8 h-8 bg-teal-50 rounded-full overflow-hidden flex items-center justify-center mt-0.5">
        <img src="/curhat-pengetahuan.png" alt="Kawan" className="w-full h-full object-contain" />
      </div>
      <div className="max-w-[80%]">
        <div className="bg-white border border-gray-100 shadow-sm px-4 py-3 rounded-2xl rounded-tl-sm">
          <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-wrap break-words">
            {message.content}
            {message.isStreaming && (
              <span className="inline-block w-0.5 h-4 bg-teal-500 animate-pulse ml-0.5 align-text-bottom" />
            )}
          </p>
        </div>
        {!message.isStreaming && (
          <p className="text-xs text-gray-400 mt-1 px-1">
            Kawan · {formatTime(message.timestamp)}
          </p>
        )}
      </div>
    </div>
  );
}
