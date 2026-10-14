import { useRef, useState } from 'react';
import { CurrencyInput } from './CurrencyInput';
import type { IncomeEntries, SavingsGoal } from '../../types/savings';
import { formatIDR } from '../../utils/format';
import { addDays, formatDateLong, formatDateShort, todayKey } from '../../utils/date';

interface Props {
  goal: SavingsGoal;
  entries: IncomeEntries;
  targetHarian: number;
  onSave: (date: string, amount: number) => void;
  onRemove: (date: string) => void;
}

const COLLAPSED_COUNT = 14;

export function IncomeTracker({ goal, entries, targetHarian, onSave, onRemove }: Props) {
  const today = todayKey();
  // Tanggal yang boleh diisi: dari awal target sampai hari ini (atau batas akhir jika sudah lewat)
  const lastDay = today < goal.endDate ? today : goal.endDate;

  const days: string[] = [];
  for (let d = lastDay; d >= goal.startDate; d = addDays(d, -1)) days.push(d);
  // Hari ini belum dihitung "terlewat" karena masih bisa diisi nanti
  const missing = days.filter((d) => d !== today && !(d in entries));

  const [date, setDate] = useState(lastDay);
  const [amount, setAmount] = useState(entries[lastDay] ?? 0);
  const [showAll, setShowAll] = useState(false);
  const [savedMsg, setSavedMsg] = useState<string | null>(null);
  const amountRef = useRef<HTMLInputElement>(null);

  function selectDate(d: string) {
    setDate(d);
    setAmount(entries[d] ?? 0);
    setSavedMsg(null);
    amountRef.current?.focus();
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!date || date < goal.startDate || date > lastDay) return;
    onSave(date, amount);
    setSavedMsg(`Pendapatan ${formatDateLong(date)} tersimpan.`);
  }

  const visibleDays = showAll ? days : days.slice(0, COLLAPSED_COUNT);
  const isEditing = date in entries;

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 space-y-5">
      <div className="flex items-center gap-2">
        <span className="text-xl">📝</span>
        <h2 className="text-xl font-bold text-gray-800">Catat Pendapatan Harian</h2>
      </div>

      {missing.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
          <p className="text-sm text-amber-800 font-medium mb-2">
            ⏰ Ada {missing.length} hari yang belum kamu isi. Klik tanggalnya untuk mengisi:
          </p>
          <div className="flex flex-wrap gap-2">
            {missing.slice(0, 10).map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => selectDate(d)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                  date === d
                    ? 'border-amber-500 bg-amber-100 text-amber-800'
                    : 'border-amber-200 bg-white text-amber-700 hover:bg-amber-100'
                }`}
              >
                {formatDateShort(d)}
              </button>
            ))}
            {missing.length > 10 && (
              <span className="px-2 py-1.5 text-xs text-amber-600">+{missing.length - 10} lainnya</span>
            )}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="income-date" className="block text-sm font-semibold text-gray-700 mb-2">
              Tanggal
            </label>
            <input
              id="income-date"
              type="date"
              min={goal.startDate}
              max={lastDay}
              value={date}
              onChange={(e) => e.target.value && selectDate(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl font-semibold focus:border-teal-500 focus:outline-none transition-colors"
            />
          </div>
          <div>
            <label htmlFor="income-amount" className="block text-sm font-semibold text-gray-700 mb-2">
              Pendapatan
            </label>
            <CurrencyInput id="income-amount" ref={amountRef} value={amount} onChange={setAmount} />
          </div>
        </div>
        <p className="text-xs text-gray-400">
          {formatDateLong(date)} · Target harian {formatIDR(targetHarian)}. Isi 0 jika hari itu tidak ada
          pemasukan.
        </p>
        <button
          type="submit"
          className="w-full py-3 bg-teal-600 text-white font-semibold rounded-2xl hover:bg-teal-700 transition-colors"
        >
          {isEditing ? 'Perbarui Pendapatan' : 'Simpan Pendapatan'}
        </button>
        {savedMsg && <p className="text-sm text-green-600 text-center">✓ {savedMsg}</p>}
      </form>

      <div className="border-t pt-4">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Riwayat</p>
        <ul className="divide-y divide-gray-100">
          {visibleDays.map((d) => {
            const filled = d in entries;
            const value = entries[d] ?? 0;
            const hit = filled && value >= targetHarian;
            return (
              <li key={d} className="flex items-center justify-between gap-3 py-2.5">
                <button
                  type="button"
                  onClick={() => selectDate(d)}
                  className="flex items-center gap-2 text-left text-sm text-gray-700 hover:text-teal-700"
                >
                  <span>{!filled ? '⚪' : hit ? '✅' : '🟡'}</span>
                  <span>
                    {formatDateLong(d)}
                    {d === today && <span className="ml-1 text-xs text-teal-500 font-semibold">(hari ini)</span>}
                  </span>
                </button>
                <div className="flex items-center gap-3 flex-shrink-0">
                  {filled ? (
                    <>
                      <span className={`text-sm font-semibold ${hit ? 'text-green-600' : 'text-amber-600'}`}>
                        {formatIDR(value)}
                      </span>
                      <button
                        type="button"
                        onClick={() => onRemove(d)}
                        className="text-xs text-gray-400 hover:text-red-500"
                        aria-label={`Hapus pendapatan ${formatDateLong(d)}`}
                      >
                        Hapus
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => selectDate(d)}
                      className="text-xs font-semibold text-teal-600 hover:underline"
                    >
                      Isi
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
        {days.length > COLLAPSED_COUNT && (
          <button
            type="button"
            onClick={() => setShowAll((s) => !s)}
            className="mt-2 text-sm text-teal-600 font-medium hover:underline"
          >
            {showAll ? 'Tampilkan lebih sedikit' : `Tampilkan semua (${days.length} hari)`}
          </button>
        )}
      </div>
    </div>
  );
}
