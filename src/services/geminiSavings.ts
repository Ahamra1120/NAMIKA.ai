import { calculatorModel } from '../config/gemini';
import { SAVINGS_SYSTEM_PROMPT } from '../constants/prompts';
import type { SavingsGoal, SavingsPlan } from '../types/savings';
import { formatIDR } from '../utils/format';
import { formatDateLong } from '../utils/date';

function buildPrompt(goal: SavingsGoal): string {
  const perHari = Math.ceil(goal.targetNominal / goal.totalHari);
  const b = goal.bisnis;
  const bisnisInfo = b
    ? `- Bisnis yang dijalankan: ${b.nama}
- Deskripsi bisnis: ${b.deskripsi}
- Estimasi modal awal: ${b.estimasiBiayaAwal}
- Potensi pendapatan bulanan: ${b.potensiPendapatanBulanan}
- Level risiko: ${b.levelRisiko}`
    : '- Pengguna belum memilih ide bisnis spesifik; buat rencana umum berbasis pendapatan harian';

  return `${SAVINGS_SYSTEM_PROMPT}

Data pengguna:
- Target nominal: ${formatIDR(goal.targetNominal)}
- Jangka waktu: ${goal.durasi} ${goal.satuan} (${goal.totalHari} hari, ${formatDateLong(goal.startDate)} s.d. ${formatDateLong(goal.endDate)})
- Rata-rata yang perlu dikumpulkan per hari: ${formatIDR(perHari)}
${bisnisInfo}

Buat rencana personal untuk ${goal.totalHari} hari tersebut. Tahapan terakhir harus memiliki sampaiHariKe = ${goal.totalHari} dan targetKumulatif = ${goal.targetNominal}.`;
}

function parsePlan(text: string): SavingsPlan {
  const fenceMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
  const objectMatch = text.match(/\{[\s\S]*\}/);
  const raw = fenceMatch?.[1] ?? objectMatch?.[0] ?? text.trim();
  const parsed = JSON.parse(raw) as Partial<SavingsPlan>;

  if (!parsed || !Array.isArray(parsed.tahapan)) {
    throw new Error('Format rencana dari AI tidak valid');
  }

  return {
    ringkasan: parsed.ringkasan ?? '',
    tahapan: parsed.tahapan.map((t) => ({
      ...t,
      sampaiHariKe: Number(t.sampaiHariKe) || 0,
      targetKumulatif: Number(t.targetKumulatif) || 0,
    })),
    tips: Array.isArray(parsed.tips) ? parsed.tips : [],
    kataSemangat: parsed.kataSemangat ?? '',
  };
}

export async function getSavingsPlan(goal: SavingsGoal): Promise<SavingsPlan> {
  const result = await calculatorModel.generateContent(buildPrompt(goal));
  return parsePlan(result.response.text());
}
