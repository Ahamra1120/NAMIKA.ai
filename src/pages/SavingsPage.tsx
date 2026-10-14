import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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
  const [linkedBusiness, setLinkedBusiness] = useState<BusinessRecommendation | null>(incoming);
  const [setupMode, setSetupMode] = useState(!!incoming);

  useEffect(() => {
    // Bersihkan state agar refresh halaman tidak membuka form lagi
    if (location.state) navigate(location.pathname, { replace: true, state: null });
  }, [location.state, location.pathname, navigate]);

  function handleCreate(input: SavingsGoalInput) {
    createGoal(input);
    setSetupMode(false);
    setLinkedBusiness(null);
  }

  function handleNewGoal() {
    if (!window.confirm('Buat target baru? Target dan catatan pendapatan saat ini akan dihapus.')) return;
    resetGoal();
    setSetupMode(true);
  }

  const showSetup = !goal || setupMode;

  return (
    <div className="min-h-screen">
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="mb-8 flex items-center gap-4">
          <span className="w-16 h-16 flex-shrink-0 flex items-center justify-center text-5xl">🐷</span>
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

        {showSetup ? (
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
              <SavingsSetupForm
                bisnis={linkedBusiness}
                onUnlinkBusiness={() => setLinkedBusiness(null)}
                onSubmit={handleCreate}
              />
            </div>
          </>
        ) : (
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
        )}
      </div>
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
