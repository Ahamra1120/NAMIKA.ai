import type { SavingsGoal } from '../../types/savings';
import { formatIDR } from '../../utils/format';
import { formatDateLong } from '../../utils/date';

interface Props {
  goal: SavingsGoal;
  total: number;
  hariKe: number;
  // Jumlah hari yang sudah "jatuh tempo" untuk dibandingkan dengan jadwal
  hariDihitung: number;
  targetHarianIdeal: number;
  targetHariIni: number;
}

export function ProgressSummary({
  goal, total, hariKe, hariDihitung, targetHarianIdeal, targetHariIni,
}: Props) {
  const pct = Math.min(100, Math.round((total / goal.targetNominal) * 100));
  const sisa = Math.max(0, goal.targetNominal - total);
  const seharusnya = Math.min(goal.targetNominal, targetHarianIdeal * hariDihitung);
  const selisih = total - seharusnya;
  const tercapai = total >= goal.targetNominal;

  return (
    <div data-tour="nabung-progress" className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
      {goal.bisnis && (
        <p className="text-xs font-semibold text-teal-500 uppercase tracking-wide mb-1">
          🔗 {goal.bisnis.nama}
        </p>
      )}
      <div className="flex items-end justify-between gap-3 mb-3">
        <div>
          <p className="text-sm text-gray-500">Terkumpul</p>
          <p className="text-3xl font-bold text-gray-800">{formatIDR(total)}</p>
          <p className="text-sm text-gray-500">dari target {formatIDR(goal.targetNominal)}</p>
        </div>
        <p className="text-4xl font-bold text-teal-600">{pct}%</p>
      </div>

      <div className="h-3 bg-gray-100 rounded-full overflow-hidden mb-5">
        <div
          className="h-full rounded-full bg-gradient-to-r from-teal-400 to-teal-600 transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>

      {tercapai ? (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-4 text-center">
          <p className="text-2xl mb-1">🎉</p>
          <p className="font-bold text-green-700">Selamat, targetmu tercapai!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Stat label="Hari ke" value={`${hariKe} / ${goal.totalHari}`} />
          <Stat label="Sisa target" value={formatIDR(sisa)} />
          <Stat label="Target ideal / hari" value={formatIDR(targetHarianIdeal)} />
          <Stat label="Target hari ini" value={formatIDR(targetHariIni)} highlight />
        </div>
      )}

      {!tercapai && (
        <p className={`mt-4 text-sm ${selisih >= 0 ? 'text-green-600' : 'text-amber-600'}`}>
          {selisih >= 0
            ? `👍 Kamu sesuai jadwal${selisih > 0 ? `, bahkan lebih cepat ${formatIDR(selisih)}` : ''}.`
            : `⏳ Kamu tertinggal ${formatIDR(-selisih)} dari jadwal. Target hari ini sudah disesuaikan agar tetap tercapai.`}{' '}
          <span className="text-gray-400">Batas waktu: {formatDateLong(goal.endDate)}.</span>
        </p>
      )}
    </div>
  );
}

function Stat({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`rounded-xl p-3 ${highlight ? 'bg-teal-50' : 'bg-gray-50'}`}>
      <p className={`text-xs font-medium mb-1 ${highlight ? 'text-teal-500' : 'text-gray-400'}`}>{label}</p>
      <p className={`text-sm font-semibold ${highlight ? 'text-teal-700' : 'text-gray-700'}`}>{value}</p>
    </div>
  );
}
