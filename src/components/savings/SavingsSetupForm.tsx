import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CurrencyInput } from './CurrencyInput';
import type { BusinessRecommendation } from '../../types/calculator';
import type { DurationUnit, SavingsGoalInput } from '../../types/savings';
import { formatIDR, parseIDRRange } from '../../utils/format';
import { todayKey, computeEndDate, daysBetween, formatDateLong } from '../../utils/date';

interface Props {
  bisnis: BusinessRecommendation;
  onSubmit: (input: SavingsGoalInput) => void;
}

const UNITS: { id: DurationUnit; label: string }[] = [
  { id: 'hari', label: 'Hari' },
  { id: 'minggu', label: 'Minggu' },
  { id: 'bulan', label: 'Bulan' },
];

function buildSuggestions(bisnis: BusinessRecommendation) {
  const suggestions: { label: string; value: number }[] = [];
  const modal = parseIDRRange(bisnis.estimasiBiayaAwal);
  const potensi = parseIDRRange(bisnis.potensiPendapatanBulanan);
  if (modal.length) {
    const v = Math.max(...modal);
    suggestions.push({ label: `Balik modal · ${formatIDR(v)}`, value: v });
  }
  if (potensi.length) {
    const v = Math.min(...potensi);
    suggestions.push({ label: `Potensi 1 bulan · ${formatIDR(v)}`, value: v });
    suggestions.push({ label: `Potensi 3 bulan · ${formatIDR(v * 3)}`, value: v * 3 });
  }
  return suggestions;
}

export function SavingsSetupForm({ bisnis, onSubmit }: Props) {
  const [target, setTarget] = useState(0);
  const [durasi, setDurasi] = useState(30);
  const [satuan, setSatuan] = useState<DurationUnit>('hari');

  const suggestions = buildSuggestions(bisnis);
  const isValid = target > 0 && durasi > 0;

  const start = todayKey();
  const end = durasi > 0 ? computeEndDate(start, durasi, satuan) : start;
  const totalHari = daysBetween(start, end) + 1;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid) return;
    onSubmit({ targetNominal: target, durasi, satuan, bisnis });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div data-tour="nabung-business" className="bg-teal-50 border border-teal-200 rounded-2xl p-4 flex items-start gap-3">
        <span className="text-2xl">🔗</span>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-teal-500 uppercase tracking-wide">
            Bisnis pilihanmu dari Kalkulator
          </p>
          <p className="font-bold text-teal-800">{bisnis.nama}</p>
          <p className="text-sm text-teal-700 mt-0.5">
            Modal {bisnis.estimasiBiayaAwal} · Potensi {bisnis.potensiPendapatanBulanan}/bulan
          </p>
        </div>
        <Link
          to="/kalkulator"
          className="text-xs text-teal-600 hover:text-teal-800 underline flex-shrink-0"
        >
          Ganti bisnis
        </Link>
      </div>

      <div data-tour="nabung-target">
        <label htmlFor="target-nominal" className="block text-sm font-semibold text-gray-700 mb-2">
          Target Nominal yang Ingin Diraih
        </label>
        <CurrencyInput id="target-nominal" value={target} onChange={setTarget} />
        <div className="flex flex-wrap gap-2 mt-3">
          {suggestions.map((s) => (
            <button
              key={s.label}
              type="button"
              onClick={() => setTarget(s.value)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium border-2 transition-all ${
                target === s.value
                  ? 'border-teal-500 bg-teal-50 text-teal-700'
                  : 'border-gray-200 text-gray-600 hover:border-teal-300 hover:bg-teal-50'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div data-tour="nabung-durasi">
        <label htmlFor="durasi" className="block text-sm font-semibold text-gray-700 mb-2">
          Target Waktu
        </label>
        <div className="flex gap-3">
          <input
            id="durasi"
            type="number"
            min={1}
            max={365}
            value={durasi || ''}
            onChange={(e) => setDurasi(Math.min(365, Math.max(0, parseInt(e.target.value, 10) || 0)))}
            className="w-28 px-4 py-3 border-2 border-gray-200 rounded-xl text-lg font-semibold focus:border-teal-500 focus:outline-none transition-colors"
          />
          <div className="flex flex-1 bg-gray-100 rounded-xl p-1">
            {UNITS.map((u) => (
              <button
                key={u.id}
                type="button"
                onClick={() => setSatuan(u.id)}
                className={`flex-1 rounded-lg text-sm font-semibold transition-all ${
                  satuan === u.id ? 'bg-white text-teal-700 shadow-sm' : 'text-gray-500 hover:text-teal-600'
                }`}
              >
                {u.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {isValid && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-sm text-amber-800">
          Kamu perlu mengumpulkan sekitar{' '}
          <strong>{formatIDR(Math.ceil(target / totalHari))}</strong> per hari selama{' '}
          <strong>{totalHari} hari</strong> (sampai {formatDateLong(end)}).
        </div>
      )}

      <button
        type="submit"
        data-tour="nabung-submit"
        disabled={!isValid}
        className="w-full py-4 bg-gradient-to-r from-teal-500 to-teal-600 text-white font-semibold text-lg rounded-2xl shadow-lg hover:from-teal-600 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.01] active:scale-[0.99]"
      >
        ✨ Buatkan Rencana Personalku
      </button>
    </form>
  );
}
