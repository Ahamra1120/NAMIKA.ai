import { WORK_INTERESTS } from '../../constants/workInterests';

interface Props {
  selected: string[];
  onChange: (selected: string[]) => void;
}

export function InterestSelector({ selected, onChange }: Props) {
  function toggle(id: string) {
    if (selected.includes(id)) {
      onChange(selected.filter((s) => s !== id));
    } else {
      onChange([...selected, id]);
    }
  }

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        Minat Pekerjaan{' '}
        <span className="font-normal text-gray-400">(pilih yang kamu suka)</span>
      </label>
      <div className="flex flex-wrap gap-2">
        {WORK_INTERESTS.map((interest) => {
          const isSelected = selected.includes(interest.id);
          return (
            <button
              key={interest.id}
              type="button"
              onClick={() => toggle(interest.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium border-2 transition-all ${
                isSelected
                  ? 'border-teal-500 bg-teal-500 text-white shadow-sm'
                  : 'border-gray-200 text-gray-600 hover:border-teal-300 hover:bg-teal-50'
              }`}
            >
              <span>{interest.emoji}</span>
              <span>{interest.label}</span>
            </button>
          );
        })}
      </div>
      {selected.length > 0 && (
        <p className="text-xs text-teal-600 mt-2 font-medium">
          {selected.length} minat dipilih
        </p>
      )}
    </div>
  );
}
