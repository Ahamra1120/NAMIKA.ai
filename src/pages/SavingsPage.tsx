import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { SavingsSetupForm } from '../components/savings/SavingsSetupForm';
import { ProgressSummary } from '../components/savings/ProgressSummary';
import { PlanCard } from '../components/savings/PlanCard';
import { IncomeTracker } from '../components/savings/IncomeTracker';
import { useSavings } from '../hooks/useSavings';
import { hasApiKey } from '../config/gemini';
import type { BusinessRecommendation } from '../types/calculator';
import type {
  IncomeEntries, SavingsGoal, SavingsGoalInput, SavingsLocationState, SavingsPlan,
} from '../types/savings';
import { todayKey, daysBetween } from '../utils/date';

export function SavingsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    goal, plan, entries, planLoading, planError,
    createGoal, setEntry, removeEntry, retryPlan, resetGoal,
  } = useSavings();

  // Track dari Kalkulator Bisnis: rekomendasi yang dipilih dikirim lewat router state
  const incoming = (location.state as SavingsLocationState | null)?.bisnis ?? null;
  const [linkedBusiness] = useState<BusinessRecommendation | null>(incoming);
  const [setupMode, setSetupMode] = useState(!!incoming);

  useEffect(() => {
    // Bersihkan state agar refresh halaman tidak membuka form lagi
    if (location.state) navigate(location.pathname, { replace: true, state: null });
  }, [location.state, location.pathname, navigate]);

  function handleCreate(input: SavingsGoalInput) {
    createGoal(input);
    setSetupMode(false);
  }

  function handleNewGoal() {
    if (!window.confirm('Buat target baru? Target dan catatan pendapatan saat ini akan dihapus.')) return;
    resetGoal();
    // Target baru selalu dimulai dari memilih bisnis di Kalkulator
    navigate('/kalkulator');
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="mb-8 flex items-center gap-4">
          <img src="/nabung-yuk.png" alt="" className="w-16 h-16 object-contain flex-shrink-0" />
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-1">Nabung Yuk</h1>
            <p className="text-gray-600">
              Tentukan target uangmu, dapatkan rencana personal dari AI, lalu catat pendapatanmu setiap hari.
            </p>
          </div>
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

        {goal && !setupMode ? (
          <SavingsDashboard
            key={goal.createdAt}
            goal={goal}
            plan={plan}
            entries={entries}
            planLoading={planLoading}
            planError={planError}
            onRetryPlan={retryPlan}
            onSaveEntry={setEntry}
            onRemoveEntry={removeEntry}
            onNewGoal={handleNewGoal}
          />
        ) : linkedBusiness ? (
          <>
            {goal && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6 flex items-center justify-between gap-3">
                <p className="text-sm text-amber-800">
                  Kamu masih punya target aktif. Membuat target baru akan menggantikannya.
                </p>
                <button
                  onClick={() => setSetupMode(false)}
                  className="text-sm font-semibold text-amber-700 hover:underline flex-shrink-0"
                >
                  Lihat target aktif
                </button>
              </div>
            )}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
              <SavingsSetupForm bisnis={linkedBusiness} onSubmit={handleCreate} />
            </div>
          </>
        ) : (
          <CalculatorFirstNotice />
        )}
      </div>
    </div>
  );
}

// Nabung Yuk adalah lanjutan Kalkulator Bisnis, jadi target hanya bisa dibuat dari bisnis yang dipilih di sana
function CalculatorFirstNotice() {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 text-center">
      <img src="/koin-kalkulator.png" alt="" className="w-20 h-20 object-contain mx-auto mb-4" />
      <h2 className="text-xl font-bold text-gray-800 mb-2">Temukan bisnismu dulu, yuk!</h2>
      <p className="text-gray-600 text-sm max-w-md mx-auto mb-6">
        Nabung Yuk membantumu mencapai target dari bisnis yang kamu jalankan. Isi Kalkulator Potensi
        Bisnis, pilih salah satu rekomendasi, lalu klik <strong>"Nabung untuk Bisnis Ini"</strong>.
      </p>
      <ol className="text-left text-sm text-gray-600 max-w-xs mx-auto mb-6 space-y-1.5">
        <li>1️⃣ Isi modal, minat, dan keahlianmu</li>
        <li>2️⃣ Pilih rekomendasi bisnis yang cocok</li>
        <li>3️⃣ Tentukan target dan mulai menabung</li>
      </ol>
      <Link
        to="/kalkulator"
        className="inline-block px-6 py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white font-semibold rounded-2xl shadow-lg hover:from-teal-600 hover:to-teal-700 transition-all"
      >
        Buka Kalkulator Bisnis →
      </Link>
    </div>
  );
}

type DashboardProps = {
  goal: SavingsGoal;
  plan: SavingsPlan | null;
  entries: IncomeEntries;
  planLoading: boolean;
  planError: string | null;
  onRetryPlan: () => void;
  onSaveEntry: (date: string, amount: number) => void;
  onRemoveEntry: (date: string) => void;
  onNewGoal: () => void;
};

function SavingsDashboard({
  goal, plan, entries, planLoading, planError,
  onRetryPlan, onSaveEntry, onRemoveEntry, onNewGoal,
}: DashboardProps) {
  const today = todayKey();
  const total = Object.values(entries).reduce((sum, v) => sum + v, 0);
  const hariKe = Math.min(goal.totalHari, Math.max(1, daysBetween(goal.startDate, today) + 1));
  const targetHarianIdeal = Math.ceil(goal.targetNominal / goal.totalHari);

  // Target hari ini menyesuaikan sisa target dibagi sisa hari (termasuk hari ini)
  const totalSebelumHariIni = total - (entries[today] ?? 0);
  const sisaHari = Math.max(1, daysBetween(today, goal.endDate) + 1);
  const targetHariIni = Math.max(0, Math.ceil((goal.targetNominal - totalSebelumHariIni) / sisaHari));

  return (
    <div className="space-y-6">
      <ProgressSummary
        goal={goal}
        total={total}
        hariKe={hariKe}
        targetHarianIdeal={targetHarianIdeal}
        targetHariIni={targetHariIni}
      />
      <PlanCard
        goal={goal}
        plan={plan}
        total={total}
        loading={planLoading}
        error={planError}
        onRetry={onRetryPlan}
      />
      <IncomeTracker
        goal={goal}
        entries={entries}
        targetHarian={targetHarianIdeal}
        onSave={onSaveEntry}
        onRemove={onRemoveEntry}
      />
      <button
        onClick={onNewGoal}
        className="w-full py-3 border-2 border-gray-200 text-gray-600 rounded-2xl font-medium hover:border-teal-300 hover:text-teal-600 transition-colors"
      >
        Buat Target Baru
      </button>
    </div>
  );
}
