import { useState } from 'react';

interface Props {
  skills: string[];
  onChange: (skills: string[]) => void;
}

export function SkillsInput({ skills, onChange }: Props) {
  const [input, setInput] = useState('');

  function addSkill() {
    const trimmed = input.trim();
    if (trimmed && !skills.includes(trimmed)) {
      onChange([...skills, trimmed]);
    }
    setInput('');
  }

  function removeSkill(skill: string) {
    onChange(skills.filter((s) => s !== skill));
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
  }

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        Keahlian Utama{' '}
        <span className="font-normal text-gray-400">(tekan Enter untuk menambah)</span>
      </label>
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="cth: memasak, jahit, desain grafis..."
          className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:outline-none transition-colors"
        />
        <button
          type="button"
          onClick={addSkill}
          disabled={!input.trim()}
          className="px-4 py-3 bg-teal-500 text-white rounded-xl font-medium hover:bg-teal-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Tambah
        </button>
      </div>
      {skills.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {skills.map((skill) => (
            <span
              key={skill}
              className="flex items-center gap-1.5 bg-teal-100 text-teal-800 px-3 py-1.5 rounded-lg text-sm font-medium"
            >
              {skill}
              <button
                type="button"
                onClick={() => removeSkill(skill)}
                className="text-teal-500 hover:text-teal-700 leading-none"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
