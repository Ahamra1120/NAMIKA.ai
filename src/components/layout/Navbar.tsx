import { Link, useLocation } from 'react-router-dom';

export function Navbar() {
  const { pathname } = useLocation();

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-gray-800 hover:text-teal-600 transition-colors">
          <span className="text-2xl">🌱</span>
          <span className="text-lg">NAMIKA.ai</span>
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
        </div>
      </div>
    </nav>
  );
}
