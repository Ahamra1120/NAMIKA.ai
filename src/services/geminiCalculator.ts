import { calculatorModel } from '../config/gemini';
import { CALCULATOR_SYSTEM_PROMPT } from '../constants/prompts';
import { WORK_INTERESTS } from '../constants/workInterests';
import type { CalculatorInput, BusinessRecommendation } from '../types/calculator';

function formatIDR(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
}

function buildPrompt(input: CalculatorInput): string {
  const interestLabels = input.minatPekerjaan
    .map((id) => WORK_INTERESTS.find((w) => w.id === id)?.label ?? id)
    .join(', ');

  return `${CALCULATOR_SYSTEM_PROMPT}

Data pengguna:
- Modal yang tersedia: ${formatIDR(input.modal)}
- Minat pekerjaan: ${interestLabels}
- Keahlian utama: ${input.keahlianUtama.join(', ')}

Berikan 4-5 rekomendasi bisnis yang paling cocok. Pastikan semua estimasi biaya awal berada dalam batas modal yang tersedia (${formatIDR(input.modal)}).`;
}

function parseRecommendations(text: string): BusinessRecommendation[] {
  const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
  const jsonStr = jsonMatch ? jsonMatch[1] : text.trim();

  const parsed = JSON.parse(jsonStr);
  if (!Array.isArray(parsed)) throw new Error('Response bukan array');
  return parsed as BusinessRecommendation[];
}

export async function getBusinessRecommendations(
  input: CalculatorInput
): Promise<BusinessRecommendation[]> {
  const prompt = buildPrompt(input);
  const result = await calculatorModel.generateContent(prompt);
  const text = result.response.text();
  return parseRecommendations(text);
}
