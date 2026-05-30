export function TypingIndicator() {
  return (
    <div className="flex items-start gap-3 mb-4">
      <div className="flex-shrink-0 w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center text-sm">
        🤝
      </div>
      <div className="bg-white border border-gray-100 shadow-sm rounded-2xl rounded-tl-sm px-4 py-3">
        <div className="flex gap-1 items-center h-5">
          <span className="w-2 h-2 bg-teal-400 rounded-full animate-bounce [animation-delay:0ms]" />
          <span className="w-2 h-2 bg-teal-400 rounded-full animate-bounce [animation-delay:150ms]" />
          <span className="w-2 h-2 bg-teal-400 rounded-full animate-bounce [animation-delay:300ms]" />
        </div>
      </div>
    </div>
  );
}
