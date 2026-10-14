import { createContext, useContext } from 'react';
import type { TourPage } from '../../constants/tourSteps';

interface TourContextValue {
  // Halaman saat ini yang punya panduan (null jika tidak ada)
  page: TourPage | null;
  startTour: () => void;
}

export const TourContext = createContext<TourContextValue>({ page: null, startTour: () => {} });

export function useTour() {
  return useContext(TourContext);
}
