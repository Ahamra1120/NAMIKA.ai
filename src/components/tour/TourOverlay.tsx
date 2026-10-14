import { useEffect, useRef, useState } from 'react';
import type { TourStep } from '../../constants/tourSteps';

interface Props {
  steps: TourStep[];
  onClose: () => void;
}

const PAD = 8; // jarak sorotan dari tepi elemen
const GAP = 16; // jarak kartu dari sorotan
const GUTTER = 16; // jarak minimum kartu dari tepi layar
const MIN_SPACE = 230; // perkiraan tinggi kartu untuk memilih atas/bawah

function findTarget(target?: string): Element | null {
  return target ? document.querySelector(`[data-tour="${target}"]`) : null;
}

export function TourOverlay({ steps, onClose }: Props) {
  // Langkah opsional yang elemennya tidak ada di halaman (mis. hasil belum muncul) dilewati
  const [available] = useState(() => steps.filter((s) => !s.optional || findTarget(s.target)));
  const [index, setIndex] = useState(0);
  const [measured, setMeasured] = useState<{ index: number; rect: DOMRect } | null>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  const step = available[index];
  const isLast = index === available.length - 1;
  const rect = measured?.index === index ? measured.rect : null;

  function next() {
    if (isLast) onClose();
    else setIndex((i) => i + 1);
  }

  function prev() {
    setIndex((i) => Math.max(0, i - 1));
  }

  // Ukur posisi elemen yang disorot dan ikuti saat scroll/resize
  useEffect(() => {
    const el = findTarget(step?.target);
    if (!el) return;
    el.scrollIntoView({ block: 'center', behavior: 'smooth' });
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setMeasured({ index, rect: el.getBoundingClientRect() }));
    };
    update();
    window.addEventListener('resize', update);
    window.addEventListener('scroll', update, true);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', update);
      window.removeEventListener('scroll', update, true);
    };
  }, [step, index]);

  useEffect(() => {
    nextRef.current?.focus();
  }, [index]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight') next();
      else if (e.key === 'ArrowLeft') prev();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  if (!step) return null;

  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const cardWidth = Math.min(352, vw - GUTTER * 2);

  let cardStyle: React.CSSProperties;
  if (rect) {
    const left = Math.min(
      Math.max(GUTTER, rect.left + rect.width / 2 - cardWidth / 2),
      vw - cardWidth - GUTTER
    );
    if (vh - rect.bottom >= MIN_SPACE) cardStyle = { left, top: rect.bottom + PAD + GAP };
    else if (rect.top >= MIN_SPACE) cardStyle = { left, bottom: vh - rect.top + PAD + GAP };
    // Elemen terlalu tinggi (mis. jendela chat): kartu ditaruh di bawah layar, di atas elemen
    else cardStyle = { left, bottom: GUTTER };
  } else {
    cardStyle = { left: '50%', top: '50%', transform: 'translate(-50%, -50%)' };
  }

  return (
    <div className="fixed inset-0 z-[100]" role="dialog" aria-modal="true" aria-labelledby="tour-title">
      {rect ? (
        <div
          className="fixed rounded-2xl ring-4 ring-teal-300 pointer-events-none transition-all duration-300"
          style={{
            top: rect.top - PAD,
            left: rect.left - PAD,
            width: rect.width + PAD * 2,
            height: rect.height + PAD * 2,
            boxShadow: '0 0 0 9999px rgba(15, 23, 42, 0.6)',
          }}
        />
      ) : (
        <div className="fixed inset-0 bg-slate-900/60" />
      )}

      {/* Animasi di elemen dalam agar transform-nya tidak menimpa transform pemusatan */}
      <div className="fixed" style={{ ...cardStyle, width: cardWidth }}>
        <div key={index} className="bg-white rounded-2xl shadow-2xl p-5 animate-message-pop-left">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-teal-500 uppercase tracking-wide">
              Panduan · {index + 1} dari {available.length}
            </span>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 flex items-center justify-center"
              aria-label="Tutup panduan"
            >
              ✕
            </button>
          </div>
  
          <h2 id="tour-title" className="text-lg font-bold text-gray-800 mb-1.5">
            {step.title}
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{step.content}</p>
  
          <div className="flex gap-1.5 mt-4">
            {available.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all ${
                  i === index ? 'w-5 bg-teal-500' : i < index ? 'w-1.5 bg-teal-300' : 'w-1.5 bg-gray-200'
                }`}
              />
            ))}
          </div>
  
          <div className="flex items-center justify-between mt-4">
            {!isLast ? (
              <button onClick={onClose} className="text-sm text-gray-400 hover:text-gray-600">
                Lewati
              </button>
            ) : (
              <span />
            )}
            <div className="flex gap-2">
              {index > 0 && (
                <button
                  onClick={prev}
                  className="px-4 py-2 text-sm font-medium text-gray-600 border-2 border-gray-200 rounded-xl hover:border-teal-300 hover:text-teal-600 transition-colors"
                >
                  Kembali
                </button>
              )}
              <button
                ref={nextRef}
                onClick={next}
                className="px-4 py-2 text-sm font-semibold text-white bg-teal-600 rounded-xl hover:bg-teal-700 transition-colors"
              >
                {isLast ? 'Selesai ✓' : 'Lanjut →'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
