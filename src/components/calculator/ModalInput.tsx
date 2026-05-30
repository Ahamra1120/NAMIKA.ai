interface Props {
  value: number;
  onChange: (value: number) => void;
}

const QUICK_AMOUNTS = [
  { label: 'Rp 100rb', value: 100_000 },
  { label: 'Rp 500rb', value: 500_000 },
  { label: 'Rp 1jt', value: 1_000_000 },
  { label: 'Rp 5jt', value: 5_000_000 },
  { label: 'Rp 10jt', value: 10_000_000 },
  { label: 'Rp 50jt', value: 50_000_000 },
];

export function ModalInput({ value, onChange }: Props) {
  const formatted = value > 0
    ? new Intl.NumberFormat('id-ID').format(value)
    : '';

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace(/\D/g, '');
    onChange(raw ? parseInt(raw, 10) : 0);
  }

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        Modal yang Tersedia
      </label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
          Rp
        </span>
        <input
          type="text"
          inputMode="numeric"
          value={formatted}
          onChange={handleChange}
          placeholder="0"
          className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl text-lg font-semibold focus:border-teal-500 focus:outline-none transition-colors"
        />
      </div>
      <div className="flex flex-wrap gap-2 mt-3">
        {QUICK_AMOUNTS.map((a) => (
          <button
            key={a.value}
            type="button"
            onClick={() => onChange(a.value)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium border-2 transition-all ${
              value === a.value
                ? 'border-teal-500 bg-teal-50 text-teal-700'
                : 'border-gray-200 text-gray-600 hover:border-teal-300 hover:bg-teal-50'
            }`}
          >
            {a.label}
          </button>
        ))}
      </div>
    </div>
  );
}
