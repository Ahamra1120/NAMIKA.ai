import { forwardRef } from 'react';

interface Props {
  value: number;
  onChange: (value: number) => void;
  id?: string;
}

export const CurrencyInput = forwardRef<HTMLInputElement, Props>(function CurrencyInput(
  { value, onChange, id },
  ref
) {
  const formatted = value > 0 ? new Intl.NumberFormat('id-ID').format(value) : '';

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace(/\D/g, '');
    onChange(raw ? parseInt(raw, 10) : 0);
  }

  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
        Rp
      </span>
      <input
        ref={ref}
        id={id}
        type="text"
        inputMode="numeric"
        value={formatted}
        onChange={handleChange}
        placeholder="0"
        className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl text-lg font-semibold focus:border-teal-500 focus:outline-none transition-colors"
      />
    </div>
  );
});
