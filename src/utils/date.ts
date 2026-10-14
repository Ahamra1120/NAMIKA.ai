import type { DurationUnit } from '../types/savings';

// Semua tanggal disimpan sebagai "YYYY-MM-DD" (waktu lokal) agar tidak bergeser karena zona waktu.

export function toDateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function fromDateKey(key: string): Date {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function todayKey(): string {
  return toDateKey(new Date());
}

export function addDays(key: string, n: number): string {
  const d = fromDateKey(key);
  d.setDate(d.getDate() + n);
  return toDateKey(d);
}

// Selisih hari b - a
export function daysBetween(a: string, b: string): number {
  const [ay, am, ad] = a.split('-').map(Number);
  const [by, bm, bd] = b.split('-').map(Number);
  return Math.round((Date.UTC(by, bm - 1, bd) - Date.UTC(ay, am - 1, ad)) / 86_400_000);
}

// Tanggal terakhir (inklusif) dari durasi yang dimulai pada `start`
export function computeEndDate(start: string, durasi: number, satuan: DurationUnit): string {
  const d = fromDateKey(start);
  if (satuan === 'hari') d.setDate(d.getDate() + durasi - 1);
  else if (satuan === 'minggu') d.setDate(d.getDate() + durasi * 7 - 1);
  else {
    d.setMonth(d.getMonth() + durasi);
    d.setDate(d.getDate() - 1);
  }
  return toDateKey(d);
}

export function formatDateLong(key: string): string {
  return fromDateKey(key).toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function formatDateShort(key: string): string {
  return fromDateKey(key).toLocaleDateString('id-ID', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
}
