import { Link } from 'react-router-dom';

export function HomePage() {
  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 pt-16 pb-24">
        <div className="text-center mb-16">
          <img
            src="/header-namika.png"
            alt="Namika AI"
            className="mx-auto mb-4 w-72 md:w-96 object-contain drop-shadow-lg"
          />
          <p className="text-lg text-gray-700 max-w-2xl mx-auto leading-relaxed font-medium drop-shadow-sm">
            Kamu tidak sendirian. Temukan peluang bisnis yang cocok dengan kondisimu,
            dan ceritakan bebanmu kepada Kawan yang selalu siap mendengarkan.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Link
            to="/kalkulator"
            className="group bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-md border border-white/60 hover:shadow-xl hover:border-teal-200 transition-all duration-300"
          >
            <div className="flex justify-center mb-5">
              <img
                src="/koin-kalkulator.png"
                alt="Kalkulator Bisnis"
                className="w-24 h-24 object-contain group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-teal-700 transition-colors text-center">
              Kalkulator Potensi Bisnis
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed mb-6 text-center">
              Masukkan modal, minat, dan keahlianmu. AI akan merekomendasikan
              ide bisnis konkret lengkap dengan estimasi pendapatan dan level risiko.
            </p>
            <div className="flex flex-wrap gap-2 mb-6 justify-center">
              {['💰 Modal', '❤️ Minat', '⭐ Keahlian', '🎯 Rekomendasi AI'].map((tag) => (
                <span key={tag} className="px-3 py-1 bg-teal-50 text-teal-600 text-xs font-medium rounded-full">
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex justify-center">
              <span className="inline-flex items-center gap-2 text-teal-600 font-semibold text-sm group-hover:gap-3 transition-all">
                Mulai Sekarang
                <span>→</span>
              </span>
            </div>
          </Link>

          <Link
            to="/curhat"
            className="group bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-md border border-white/60 hover:shadow-xl hover:border-teal-200 transition-all duration-300"
          >
            <div className="flex justify-center mb-5">
              <img
                src="/curhat-pengetahuan.png"
                alt="Curhat dengan Kawan"
                className="w-24 h-24 object-contain group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-teal-700 transition-colors text-center">
              Curhat dengan Kawan
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed mb-6 text-center">
              Terkadang kamu butuh seseorang yang mendengarkan. Kawan hadir
              24/7 untuk menemanimu, tanpa menghakimi, dengan empati yang tulus.
            </p>
            <div className="flex flex-wrap gap-2 mb-6 justify-center">
              {['🫂 Empati', '🔒 Privat', '💬 Bebas Curhat', '🧠 Dukungan Psikologis'].map((tag) => (
                <span key={tag} className="px-3 py-1 bg-teal-50 text-teal-600 text-xs font-medium rounded-full">
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex justify-center">
              <span className="inline-flex items-center gap-2 text-teal-600 font-semibold text-sm group-hover:gap-3 transition-all">
                Cerita dengan Kawan
                <span>→</span>
              </span>
            </div>
          </Link>
        </div>

        <div className="mt-12 bg-amber-50/90 backdrop-blur-sm border border-amber-200 rounded-2xl p-5 text-center">
          <p className="text-amber-700 text-sm">
            <strong>Catatan:</strong> Aplikasi ini adalah alat bantu, bukan pengganti konsultasi profesional.
            Untuk darurat kesehatan mental, hubungi <strong>Into The Light Indonesia: 119 ext 8</strong>
          </p>
        </div>
      </div>
    </div>
  );
}
