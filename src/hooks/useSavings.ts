import { useState, useEffect } from 'react';
import type { SavingsGoal, SavingsGoalInput, SavingsPlan, IncomeEntries } from '../types/savings';
import { getSavingsPlan } from '../services/geminiSavings';
import { todayKey, computeEndDate, daysBetween } from '../utils/date';

// localStorage (bukan sessionStorage) karena pencatatan berlangsung berhari-hari
const STORAGE_KEY = 'nabung_yuk_data';

interface SavingsData {
  goal: SavingsGoal;
  plan: SavingsPlan | null;
  entries: IncomeEntries;
}

function loadData(): SavingsData | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as SavingsData;
    // Target harus berasal dari bisnis pilihan di Kalkulator; target lama tanpa bisnis dibuang
    if (!data.goal?.bisnis) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

function saveData(data: SavingsData | null) {
  try {
    if (data) localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    else localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Storage tidak tersedia (mode privat, dll) — data tetap jalan di memori
  }
}

// Dipakai Navbar/Home untuk menampilkan pintasan hanya jika pengguna sudah punya target
export function hasActiveSavingsGoal(): boolean {
  return loadData() !== null;
}

export function useSavings() {
  const [data, setData] = useState<SavingsData | null>(loadData);
  const [planLoading, setPlanLoading] = useState(false);
  const [planError, setPlanError] = useState<string | null>(null);

  useEffect(() => {
    saveData(data);
  }, [data]);

  async function generatePlan(goal: SavingsGoal) {
    setPlanLoading(true);
    setPlanError(null);
    try {
      const plan = await getSavingsPlan(goal);
      // Abaikan hasil jika target sudah diganti selama menunggu
      setData((d) => (d && d.goal.createdAt === goal.createdAt ? { ...d, plan } : d));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Terjadi kesalahan tidak diketahui.';
      setPlanError(`Gagal membuat rencana: ${message}`);
    } finally {
      setPlanLoading(false);
    }
  }

  function createGoal(input: SavingsGoalInput) {
    const startDate = todayKey();
    const endDate = computeEndDate(startDate, input.durasi, input.satuan);
    const goal: SavingsGoal = {
      ...input,
      startDate,
      endDate,
      totalHari: daysBetween(startDate, endDate) + 1,
      createdAt: new Date().toISOString(),
    };
    setData({ goal, plan: null, entries: {} });
    generatePlan(goal);
  }

  function setEntry(date: string, amount: number) {
    setData((d) => (d ? { ...d, entries: { ...d.entries, [date]: amount } } : d));
  }

  function removeEntry(date: string) {
    setData((d) => {
      if (!d) return d;
      const entries = { ...d.entries };
      delete entries[date];
      return { ...d, entries };
    });
  }

  function retryPlan() {
    if (data) generatePlan(data.goal);
  }

  function resetGoal() {
    setData(null);
    setPlanError(null);
  }

  return {
    goal: data?.goal ?? null,
    plan: data?.plan ?? null,
    entries: data?.entries ?? {},
    planLoading,
    planError,
    createGoal,
    setEntry,
    removeEntry,
    retryPlan,
    resetGoal,
  };
}
