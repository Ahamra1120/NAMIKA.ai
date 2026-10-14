import { useNavigate } from 'react-router-dom';
import type { BusinessRecommendation } from '../../types/calculator';
import type { SavingsLocationState } from '../../types/savings';

interface Props {
  recommendation: BusinessRecommendation;
  index: number;
}

const RISK_STYLES = {
  Rendah: {
    badge: 'bg-green-100 text-green-700 border border-green-200',
    icon: '🟢',
    bar: 'bg-green-400',
    barWidth: 'w-1/3',
  },
  Sedang: {
    badge: 'bg-yellow-100 text-yellow-700 border border-yellow-200',
    icon: '🟡',
    bar: 'bg-yellow-400',
    barWidth: 'w-2/3',
  },
  Tinggi: {
    badge: 'bg-red-100 text-red-700 border border-red-200',
    icon: '🔴',
    bar: 'bg-red-400',
    barWidth: 'w-full',
  },
};

export function ResultCard({ recommendation: r, index }: Props) {
  const risk = RISK_STYLES[r.levelRisiko] ?? RISK_STYLES['Sedang'];
  const navigate = useNavigate();

  function startSaving() {
    const state: SavingsLocationState = { bisnis: r };
    navigate('/nabung', { state });
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      <div className="bg-gradient-to-r from-teal-50 to-emerald-50 px-5 py-4 border-b border-gray-100">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex-shrink-0 w-8 h-8 bg-teal-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
              {index + 1}
            </span>
            <h3 className="font-bold text-gray-800 text-lg leading-tight">{r.nama}</h3>
          </div>
          <span className={`flex-shrink-0 px-2.5 py-1 rounded-full text-xs font-semibold ${risk.badge}`}>
            {risk.icon} {r.levelRisiko}
          </span>
        </div>
      </div>

      <div className="px-5 py-4 space-y-4">
        <p className="text-gray-600 text-sm leading-relaxed">{r.deskripsi}</p>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-xs text-gray-400 font-medium mb-1">Modal Awal</p>
            <p className="text-sm font-semibold text-gray-700">{r.estimasiBiayaAwal}</p>
          </div>
          <div className="bg-teal-50 rounded-xl p-3">
            <p className="text-xs text-teal-400 font-medium mb-1">Potensi / Bulan</p>
            <p className="text-sm font-semibold text-teal-700">{r.potensiPendapatanBulanan}</p>
          </div>
        </div>

        <div className="border-t pt-3">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">
            Kenapa cocok untukmu?
          </p>
          <p className="text-sm text-gray-600 leading-relaxed">{r.alasanKesesuaian}</p>
        </div>

        <div>
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>Level Risiko</span>
            <span>{r.levelRisiko}</span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div className={`h-full rounded-full ${risk.bar} ${risk.barWidth}`} />
          </div>
        </div>

        <button
          type="button"
          onClick={startSaving}
          className="w-full py-2.5 bg-teal-600 text-white text-sm font-semibold rounded-xl hover:bg-teal-700 transition-colors"
        >
          🐷 Nabung untuk Bisnis Ini →
        </button>
      </div>
    </div>
  );
}
