import { useState } from 'react';
import { ModalInput } from './ModalInput';
import { InterestSelector } from './InterestSelector';
import { SkillsInput } from './SkillsInput';
import type { CalculatorInput } from '../../types/calculator';

interface Props {
  onSubmit: (input: CalculatorInput) => void;
  loading: boolean;
}

export function CalculatorForm({ onSubmit, loading }: Props) {
  const [modal, setModal] = useState(0);
  const [minat, setMinat] = useState<string[]>([]);
  const [keahlian, setKeahlian] = useState<string[]>([]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit({ modal, minatPekerjaan: minat, keahlianUtama: keahlian });
  }

  const isValid = modal > 0 && minat.length > 0 && keahlian.length > 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <ModalInput value={modal} onChange={setModal} />
      <InterestSelector selected={minat} onChange={setMinat} />
      <SkillsInput skills={keahlian} onChange={setKeahlian} />

      <button
        type="submit"
        disabled={!isValid || loading}
        className="w-full py-4 bg-gradient-to-r from-teal-500 to-teal-600 text-white font-semibold text-lg rounded-2xl shadow-lg hover:from-teal-600 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.01] active:scale-[0.99]"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-3">
            <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
            Sedang Menganalisis...
          </span>
        ) : (
          '✨ Temukan Peluang Bisnisku'
        )}
      </button>
    </form>
  );
}
