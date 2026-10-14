import { ResultCard } from './ResultCard';
import type { BusinessRecommendation } from '../../types/calculator';

interface Props {
  recommendations: BusinessRecommendation[];
  loading: boolean;
  error: string | null;
  onRetry: () => void;
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
      <div className="bg-gray-100 px-5 py-4 h-16" />
      <div className="px-5 py-4 space-y-3">
        <div className="h-3 bg-gray-100 rounded w-full" />
        <div className="h-3 bg-gray-100 rounded w-3/4" />
        <div className="grid grid-cols-2 gap-3">
          <div className="h-14 bg-gray-100 rounded-xl" />
          <div className="h-14 bg-gray-100 rounded-xl" />
        </div>
        <div className="h-3 bg-gray-100 rounded w-full" />
        <div className="h-3 bg-gray-100 rounded w-2/3" />
      </div>
    </div>
  );
}

export function ResultsList({ recommendations, loading, error, onRetry }: Props) {
  if (loading) {
    return (
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="animate-spin h-5 w-5 border-2 border-teal-500 border-t-transparent rounded-full" />
          <p className="text-teal-700 font-medium">Gemini AI sedang menganalisis peluang bisnismu...</p>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => <SkeletonCard key={i} />)}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
        <p className="text-2xl mb-2">😕</p>
        <p className="text-red-700 font-medium mb-1">Aduh, ada kendala teknis</p>
        <p className="text-red-500 text-sm mb-4">{error}</p>
        <button
          onClick={onRetry}
          className="px-5 py-2 bg-red-100 text-red-700 rounded-xl font-medium hover:bg-red-200 transition-colors"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  if (recommendations.length === 0) return null;

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <span className="text-xl">🎯</span>
        <h2 className="text-xl font-bold text-gray-800">
          Rekomendasi Bisnis untuk Kamu
        </h2>
      </div>
      <div className="flex items-center gap-3 bg-teal-50 border border-teal-100 rounded-2xl p-3 mb-6 -mt-3">
        <img src="/nabung-yuk.png" alt="" className="w-10 h-10 object-contain flex-shrink-0" />
        <p className="text-sm text-teal-800">
          Sudah menemukan yang cocok? Klik <strong>"Nabung untuk Bisnis Ini"</strong> untuk membuat target
          dan rencana menabung dari bisnis tersebut.
        </p>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {recommendations.map((rec, i) => (
          <ResultCard key={i} recommendation={rec} index={i} />
        ))}
      </div>
    </div>
  );
}
