import { Link } from 'react-router-dom';

export function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-emerald-50">
      <div className="max-w-4xl mx-auto px-4 pt-16 pb-24">
        <div className="text-center mb-16">
          <div className="text-6xl mb-6">🌱</div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 leading-tight">
            Bangkit dari{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-emerald-500">
              Kesulitan Ekonomi
            </span>
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Kamu tidak sendirian. Temukan peluang bisnis yang cocok dengan kondisimu,
            dan ceritakan bebanmu kepada Kawan yang selalu siap mendengarkan.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Link
            to="/kalkulator"
            className="group bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-lg hover:border-teal-100 transition-all duration-300"
          >
            <div className="text-5xl mb-5">📊</div>
            <h2 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-teal-700 transition-colors">
              Kalkulator Potensi Bisnis
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              Masukkan modal, minat, dan keahlianmu. AI akan merekomendasikan
              ide bisnis konkret lengkap dengan estimasi pendapatan dan level risiko.
            </p>
            <div className="flex flex-wrap gap-2 mb-6">
              {['💰 Modal', '❤️ Minat', '⭐ Keahlian', '🎯 Rekomendasi AI'].map((tag) => (
                <span key={tag} className="px-3 py-1 bg-teal-50 text-teal-600 text-xs font-medium rounded-full">
                  {tag}
                </span>
              ))}
            </div>
            <span className="inline-flex items-center gap-2 text-teal-600 font-semibold text-sm group-hover:gap-3 transition-all">
              Mulai Sekarang
              <span>→</span>
            </span>
          </Link>

          <Link
            to="/curhat"
            className="group bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-lg hover:border-teal-100 transition-all duration-300"
          >
            <div className="text-5xl mb-5">🤝</div>
            <h2 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-teal-700 transition-colors">
              Curhat dengan Kawan
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              Terkadang kamu butuh seseorang yang mendengarkan. Kawan hadir
              24/7 untuk menemanimu, tanpa menghakimi, dengan empati yang tulus.
            </p>
            <div className="flex flex-wrap gap-2 mb-6">
              {['🫂 Empati', '🔒 Privat', '💬 Bebas Curhat', '🧠 Dukungan Psikologis'].map((tag) => (
                <span key={tag} className="px-3 py-1 bg-teal-50 text-teal-600 text-xs font-medium rounded-full">
                  {tag}
                </span>
              ))}
            </div>
            <span className="inline-flex items-center gap-2 text-teal-600 font-semibold text-sm group-hover:gap-3 transition-all">
              Cerita dengan Kawan
              <span>→</span>
            </span>
          </Link>
        </div>

        <div className="mt-12 bg-amber-50 border border-amber-200 rounded-2xl p-5 text-center">
          <p className="text-amber-700 text-sm">
            <strong>Catatan:</strong> Aplikasi ini adalah alat bantu, bukan pengganti konsultasi profesional.
            Untuk darurat kesehatan mental, hubungi <strong>Into The Light Indonesia: 119 ext 8</strong>
          </p>
        </div>
      </div>
    </div>
  );
}
