import { useState } from 'react';
import { CalculatorForm } from '../components/calculator/CalculatorForm';
import { ResultsList } from '../components/calculator/ResultsList';
import { useBusinessCalculator } from '../hooks/useBusinessCalculator';
import { hasApiKey } from '../config/gemini';
import type { CalculatorInput } from '../types/calculator';

export function CalculatorPage() {
  const { recommendations, loading, error, calculate, reset } = useBusinessCalculator();
  const [lastInput, setLastInput] = useState<CalculatorInput | null>(null);

  function handleSubmit(input: CalculatorInput) {
    setLastInput(input);
    calculate(input);
  }

  function handleRetry() {
    if (lastInput) calculate(lastInput);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            📊 Kalkulator Potensi Bisnis
          </h1>
          <p className="text-gray-500">
            Ceritakan kondisimu dan biarkan AI menemukan peluang yang paling cocok untukmu.
          </p>
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

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 mb-8">
          <CalculatorForm onSubmit={handleSubmit} loading={loading} />
        </div>

        {(recommendations.length > 0 || loading || error) && (
          <div>
            <ResultsList
              recommendations={recommendations}
              loading={loading}
              error={error}
              onRetry={handleRetry}
            />
            {recommendations.length > 0 && (
              <button
                onClick={reset}
                className="mt-6 w-full py-3 border-2 border-gray-200 text-gray-600 rounded-2xl font-medium hover:border-teal-300 hover:text-teal-600 transition-colors"
              >
                Coba Lagi dengan Data Berbeda
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
