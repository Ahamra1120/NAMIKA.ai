import type { SavingsGoal, SavingsPlan } from '../../types/savings';
import { formatIDR } from '../../utils/format';
import { addDays, formatDateShort } from '../../utils/date';

interface Props {
  goal: SavingsGoal;
  plan: SavingsPlan | null;
  total: number;
  loading: boolean;
  error: string | null;
  onRetry: () => void;
}

export function PlanCard({ goal, plan, total, loading, error, onRetry }: Props) {
  if (loading) {
    return (
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="animate-spin h-5 w-5 border-2 border-teal-500 border-t-transparent rounded-full" />
          <p className="text-teal-700 font-medium">Gemini AI sedang menyusun rencana personalmu...</p>
        </div>
        <div className="space-y-3 animate-pulse">
          <div className="h-3 bg-gray-100 rounded w-full" />
          <div className="h-3 bg-gray-100 rounded w-3/4" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-gray-100 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
        <p className="text-red-700 font-medium mb-1">Rencana belum berhasil dibuat</p>
        <p className="text-red-500 text-sm mb-4">{error}</p>
        <p className="text-gray-500 text-xs mb-4">Kamu tetap bisa mencatat pendapatan harian di bawah.</p>
        <button
          onClick={onRetry}
          className="px-5 py-2 bg-red-100 text-red-700 rounded-xl font-medium hover:bg-red-200 transition-colors"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  if (!plan) return null;

  // Tahapan pertama yang belum tercapai = tahapan yang sedang berjalan
  const currentIdx = plan.tahapan.findIndex((t) => total < t.targetKumulatif);

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 space-y-5">
      <div className="flex items-center gap-2">
        <span className="text-xl">🗺️</span>
        <h2 className="text-xl font-bold text-gray-800">Rencana Personalmu</h2>
      </div>

      {plan.ringkasan && <p className="text-gray-600 text-sm leading-relaxed">{plan.ringkasan}</p>}

      <ol className="space-y-3">
        {plan.tahapan.map((t, i) => {
          const done = total >= t.targetKumulatif;
          const current = i === currentIdx;
          const sampai = t.sampaiHariKe > 0 ? addDays(goal.startDate, t.sampaiHariKe - 1) : null;
          return (
            <li
              key={i}
              className={`rounded-2xl border p-4 ${
                done
                  ? 'bg-green-50 border-green-200'
                  : current
                    ? 'bg-teal-50 border-teal-300'
                    : 'bg-gray-50 border-gray-100'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-1">
                <p className="font-semibold text-gray-800">
                  {done ? '✅' : current ? '📍' : '⚪'} {t.judul}
                </p>
                <span className="text-xs text-gray-500 flex-shrink-0 text-right">
                  {t.periode}
                  {sampai && <span className="block">s.d. {formatDateShort(sampai)}</span>}
                </span>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">{t.fokus}</p>
              <p className="text-xs font-semibold text-teal-700 mt-2">
                Target terkumpul: {formatIDR(t.targetKumulatif)}
              </p>
            </li>
          );
        })}
      </ol>

      {plan.tips.length > 0 && (
        <div className="border-t pt-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Tips untukmu</p>
          <ul className="space-y-1.5">
            {plan.tips.map((tip, i) => (
              <li key={i} className="text-sm text-gray-600 flex gap-2">
                <span>💡</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {plan.kataSemangat && (
        <p className="text-center text-teal-700 font-medium italic">"{plan.kataSemangat}"</p>
      )}
    </div>
  );
}
