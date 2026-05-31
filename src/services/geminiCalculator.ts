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
  // Try: JSON code block
  const fenceMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
  if (fenceMatch) {
    const parsed = JSON.parse(fenceMatch[1]);
    if (Array.isArray(parsed)) return parsed as BusinessRecommendation[];
  }

  // Try: raw JSON array anywhere in the text
  const arrayMatch = text.match(/\[[\s\S]*\]/);
  if (arrayMatch) {
    const parsed = JSON.parse(arrayMatch[0]);
    if (Array.isArray(parsed)) return parsed as BusinessRecommendation[];
  }

  // Try: plain text is already valid JSON
  const parsed = JSON.parse(text.trim());
  if (!Array.isArray(parsed)) throw new Error('Response bukan array JSON');
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
