import { useEffect } from 'react';
import { ChatWindow } from '../components/chatbot/ChatWindow';
import { useChat } from '../hooks/useChat';
import { hasApiKey } from '../config/gemini';

const GREETING = 'Halo! Saya Kawan, dan saya di sini untuk mendengarkan. 😊 Terkadang beban ekonomi bisa terasa sangat berat, dan wajar jika kamu merasa lelah atau khawatir. Ceritakan apa yang sedang kamu rasakan sekarang — tidak ada yang akan menghakimimu di sini.';

export function ChatbotPage() {
  const { messages, isStreaming, sendMessage, clearChat } = useChat();

  useEffect(() => {
    // Greeting is injected as display-only via displayMessages below
  }, []);

  // Add greeting to display if no messages
  const displayMessages = messages.length === 0
    ? [{
        id: 'greeting',
        role: 'model' as const,
        content: GREETING,
        timestamp: new Date(),
      }]
    : messages;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            🤝 Curhat dengan Kawan
          </h1>
          <p className="text-gray-500 text-sm">
            Ceritakan bebanmu. Kawan siap mendengarkan dengan empati, tanpa menghakimi.
          </p>
        </div>

        {!hasApiKey && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-6">
            <p className="text-amber-800 font-medium mb-1">⚠️ API Key belum dikonfigurasi</p>
            <p className="text-amber-700 text-sm">
              Salin file <code className="bg-amber-100 px-1 rounded">.env.example</code> menjadi{' '}
              <code className="bg-amber-100 px-1 rounded">.env.local</code> dan isi dengan Gemini API key kamu.
            </p>
          </div>
        )}

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <ChatWindow
            messages={displayMessages}
            isStreaming={isStreaming}
            onSend={sendMessage}
            onClear={clearChat}
          />
        </div>

        <div className="mt-4 bg-blue-50 border border-blue-100 rounded-xl p-4">
          <p className="text-blue-700 text-xs text-center">
            Percakapan ini bersifat privat dan hanya tersimpan di sesi browser ini.
            Kawan adalah AI — bukan psikolog. Untuk bantuan profesional: <strong>Into The Light 119 ext 8</strong>
          </p>
        </div>
      </div>
    </div>
  );
}
