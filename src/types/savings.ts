import type { BusinessRecommendation } from './calculator';

export type DurationUnit = 'hari' | 'minggu' | 'bulan';

export interface SavingsGoalInput {
  targetNominal: number;
  durasi: number;
  satuan: DurationUnit;
  // Terisi jika pengguna datang dari hasil Kalkulator Potensi Bisnis
  bisnis: BusinessRecommendation | null;
}

export interface SavingsGoal extends SavingsGoalInput {
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD, inklusif
  totalHari: number;
  createdAt: string;
}

export interface SavingsMilestone {
  judul: string;
  periode: string;
  sampaiHariKe: number;
  targetKumulatif: number;
  fokus: string;
}

export interface SavingsPlan {
  ringkasan: string;
  tahapan: SavingsMilestone[];
  tips: string[];
  kataSemangat: string;
}

// Pendapatan per tanggal (YYYY-MM-DD -> rupiah)
export type IncomeEntries = Record<string, number>;

// Router state saat pengguna masuk ke /nabung dari hasil Kalkulator Bisnis
export interface SavingsLocationState {
  bisnis?: BusinessRecommendation;
}
