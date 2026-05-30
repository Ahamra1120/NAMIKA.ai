import { useState } from 'react';
import type { CalculatorInput, BusinessRecommendation } from '../types/calculator';
import { getBusinessRecommendations } from '../services/geminiCalculator';

interface CalculatorState {
  recommendations: BusinessRecommendation[];
  loading: boolean;
  error: string | null;
}

export function useBusinessCalculator() {
  const [state, setState] = useState<CalculatorState>({
    recommendations: [],
    loading: false,
    error: null,
  });

  async function calculate(input: CalculatorInput) {
    if (input.modal <= 0) {
      setState((s) => ({ ...s, error: 'Modal harus lebih dari Rp 0.' }));
      return;
    }
    if (input.minatPekerjaan.length === 0) {
      setState((s) => ({ ...s, error: 'Pilih minimal 1 minat pekerjaan.' }));
      return;
    }
    if (input.keahlianUtama.length === 0) {
      setState((s) => ({ ...s, error: 'Tambahkan minimal 1 keahlian.' }));
      return;
    }

    setState({ recommendations: [], loading: true, error: null });

    try {
      const results = await getBusinessRecommendations(input);
      setState({ recommendations: results, loading: false, error: null });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Terjadi kesalahan tidak diketahui.';
      setState({
        recommendations: [],
        loading: false,
        error: `Gagal mendapatkan rekomendasi: ${message}`,
      });
    }
  }

  function reset() {
    setState({ recommendations: [], loading: false, error: null });
  }

  return { ...state, calculate, reset };
}
