import { Link, useLocation } from 'react-router-dom';
import { hasActiveSavingsGoal } from '../../hooks/useSavings';
import { useTour } from '../tour/tourContext';

export function Navbar() {
  const { pathname } = useLocation();
  const { page, startTour } = useTour();
  // Nabung Yuk hanya muncul setelah pengguna membuat target lewat Kalkulator Bisnis.
  // Dibaca ulang setiap pindah halaman (Navbar re-render karena useLocation).
  const showSavings = hasActiveSavingsGoal();

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center hover:opacity-80 transition-opacity">
          <img src="/header-namika.png" alt="Namika AI" className="h-10 object-contain" />
        </Link>

        <div className="flex items-center gap-1">
          <Link
            to="/kalkulator"
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              pathname === '/kalkulator'
                ? 'bg-teal-50 text-teal-700'
                : 'text-gray-600 hover:text-teal-600 hover:bg-teal-50'
            }`}
          >
            <span>📊</span>
            <span className="hidden sm:inline">Kalkulator Bisnis</span>
          </Link>
          {(showSavings || pathname === '/nabung') && (
            <Link
              to="/nabung"
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                pathname === '/nabung'
                  ? 'bg-teal-50 text-teal-700'
                  : 'text-gray-600 hover:text-teal-600 hover:bg-teal-50'
              }`}
            >
              <img src="/nabung-yuk.png" alt="" className="w-5 h-5 object-contain" />
              <span className="hidden sm:inline">Nabung Yuk</span>
            </Link>
          )}
          <Link
            to="/curhat"
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              pathname === '/curhat'
                ? 'bg-teal-50 text-teal-700'
                : 'text-gray-600 hover:text-teal-600 hover:bg-teal-50'
            }`}
          >
            <span>💬</span>
            <span className="hidden sm:inline">Curhat dengan Kawan</span>
          </Link>
          {page && (
            <button
              type="button"
              onClick={startTour}
              data-tour="help-button"
              title="Bantuan penggunaan aplikasi"
              aria-label="Bantuan penggunaan aplikasi"
              className="ml-2 w-9 h-9 flex-shrink-0 rounded-full border-2 border-teal-200 text-teal-600 font-bold hover:bg-teal-50 hover:border-teal-400 transition-colors"
            >
              ?
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
