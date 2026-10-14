import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { TourContext } from './tourContext';
import { TourOverlay } from './TourOverlay';
import { TOUR_STEPS, pageFromPath, type TourPage } from '../../constants/tourSteps';

// Halaman yang panduannya sudah pernah ditutup/diselesaikan
const SEEN_KEY = 'namika_tour_seen';

function loadSeen(): TourPage[] {
  try {
    const raw = localStorage.getItem(SEEN_KEY);
    return raw ? (JSON.parse(raw) as TourPage[]) : [];
  } catch {
    return [];
  }
}

function markSeen(page: TourPage) {
  try {
    const seen = loadSeen();
    if (!seen.includes(page)) localStorage.setItem(SEEN_KEY, JSON.stringify([...seen, page]));
  } catch {
    // Storage tidak tersedia — panduan akan muncul lagi di kunjungan berikutnya
  }
}

export function TourProvider({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  const page = pageFromPath(pathname);
  const [active, setActive] = useState<TourPage | null>(null);

  // Buka otomatis saat pertama kali mengunjungi sebuah halaman
  useEffect(() => {
    if (!page || loadSeen().includes(page)) return;
    // Beri jeda agar halaman selesai dirender sebelum elemen disorot
    const timer = setTimeout(() => setActive(page), 600);
    return () => clearTimeout(timer);
  }, [page]);

  function close() {
    if (active) markSeen(active);
    setActive(null);
  }

  return (
    <TourContext.Provider value={{ page, startTour: () => page && setActive(page) }}>
      {children}
      {active && active === page && (
        <TourOverlay key={active} steps={TOUR_STEPS[active]} onClose={close} />
      )}
    </TourContext.Provider>
  );
}
