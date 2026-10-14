export type TourPage = 'home' | 'kalkulator' | 'nabung' | 'curhat';

export interface TourStep {
  // Nilai atribut data-tour pada elemen yang disorot. Tanpa target = kartu di tengah layar.
  target?: string;
  // Lewati langkah ini jika elemennya tidak ada (mis. hasil kalkulator belum muncul).
  // Jika false dan elemen tidak ada, kartu tetap tampil di tengah layar.
  optional?: boolean;
  title: string;
  content: string;
}

export function pageFromPath(pathname: string): TourPage | null {
  if (pathname === '/') return 'home';
  if (pathname.startsWith('/kalkulator')) return 'kalkulator';
  if (pathname.startsWith('/nabung')) return 'nabung';
  if (pathname.startsWith('/curhat')) return 'curhat';
  return null;
}

export const TOUR_STEPS: Record<TourPage, TourStep[]> = {
  home: [
    {
      title: 'Selamat datang di Namika AI 👋',
      content:
        'Namika AI membantumu menemukan peluang usaha dan mencapai target keuanganmu. Alurnya:\n\n1. Kalkulator Bisnis: temukan bisnis yang cocok\n2. Nabung Yuk: capai target dari bisnis itu\n3. Curhat dengan Kawan: teman cerita kapan saja',
    },
    {
      target: 'home-kalkulator',
      title: 'Mulai dari Kalkulator Bisnis',
      content:
        'Isi modal, minat, dan keahlianmu. AI akan memberi 4–5 rekomendasi bisnis lengkap dengan modal awal, potensi pendapatan, dan level risikonya.',
    },
    {
      target: 'home-nabung',
      title: 'Nabung Yuk',
      content:
        'Setelah memilih bisnis di Kalkulator, klik "Nabung untuk Bisnis Ini" untuk membuat target dan rencana menabung dari AI. Kalau sudah punya target, pintasannya muncul di halaman ini dan di menu atas.',
    },
    {
      target: 'home-curhat',
      title: 'Curhat dengan Kawan',
      content: 'Lagi merasa berat? Ceritakan ke Kawan, AI pendengar yang hangat dan tidak menghakimi.',
    },
    {
      target: 'help-button',
      title: 'Butuh bantuan lagi?',
      content: 'Klik ikon ? ini kapan saja untuk membuka panduan di halaman yang sedang kamu buka.',
    },
  ],
  kalkulator: [
    {
      target: 'calc-modal',
      title: 'Modal yang tersedia',
      content: 'Ketik jumlah modal yang kamu punya, atau pilih nominal cepat di bawahnya.',
    },
    {
      target: 'calc-interest',
      title: 'Minat pekerjaan',
      content: 'Pilih satu atau lebih bidang yang kamu sukai.',
    },
    {
      target: 'calc-skills',
      title: 'Keahlian utama',
      content: 'Tulis keahlianmu lalu tekan Enter atau klik Tambah. Boleh lebih dari satu.',
    },
    {
      target: 'calc-submit',
      title: 'Temukan peluangmu',
      content: 'Setelah semua terisi, klik tombol ini. AI butuh beberapa detik untuk menganalisis.',
    },
    {
      target: 'calc-results',
      optional: true,
      title: 'Rekomendasi bisnismu',
      content: 'Bandingkan modal awal, potensi pendapatan per bulan, dan level risiko tiap bisnis.',
    },
    {
      target: 'calc-nabung',
      title: 'Lanjut ke Nabung Yuk',
      content:
        'Sudah menemukan yang cocok? Klik "Nabung untuk Bisnis Ini" di kartu bisnisnya untuk membuat target menabung. Tombol ini muncul setelah rekomendasi tampil.',
    },
  ],
  nabung: [
    {
      title: 'Nabung Yuk',
      content:
        'Fitur lanjutan dari Kalkulator Bisnis: tentukan target uang, dapatkan rencana personal dari AI, lalu catat pendapatanmu setiap hari.',
    },
    {
      target: 'nabung-gate',
      optional: true,
      title: 'Pilih bisnis dulu',
      content:
        'Target dibuat dari bisnis pilihanmu. Buka Kalkulator, pilih salah satu rekomendasi, lalu klik "Nabung untuk Bisnis Ini".',
    },
    {
      target: 'nabung-business',
      optional: true,
      title: 'Bisnis pilihanmu',
      content: 'Rencana dan saran target disesuaikan dengan bisnis ini. Klik "Ganti bisnis" untuk memilih yang lain.',
    },
    {
      target: 'nabung-target',
      optional: true,
      title: 'Target nominal',
      content:
        'Masukkan jumlah uang yang ingin kamu raih, atau pilih saran seperti balik modal atau potensi 1 bulan.',
    },
    {
      target: 'nabung-durasi',
      optional: true,
      title: 'Target waktu',
      content: 'Tentukan dalam berapa hari, minggu, atau bulan kamu ingin mencapainya.',
    },
    {
      target: 'nabung-submit',
      optional: true,
      title: 'Buat rencana',
      content: 'AI akan menyusun rencana personal berisi tahapan, target per tahap, dan tips.',
    },
    {
      target: 'nabung-progress',
      optional: true,
      title: 'Pantau progresmu',
      content:
        'Lihat total terkumpul, sisa target, dan target hari ini. Target hari ini otomatis menyesuaikan kalau kamu tertinggal.',
    },
    {
      target: 'nabung-plan',
      optional: true,
      title: 'Rencana personal dari AI',
      content: 'Ikuti tahapannya satu per satu. Tahapan yang sudah tercapai ditandai ✅.',
    },
    {
      target: 'nabung-tracker',
      optional: true,
      title: 'Catat pendapatan harian',
      content:
        'Pilih tanggal, isi pendapatan, lalu simpan. Lupa mengisi kemarin? Pilih saja tanggalnya. Hari yang terlewat juga ditandai di sini.',
    },
    {
      target: 'nabung-history',
      optional: true,
      title: 'Riwayat pendapatan',
      content: 'Semua hari tercatat di sini. Klik tanggal untuk mengubah, atau "Isi" untuk hari yang belum diisi.',
    },
  ],
  curhat: [
    {
      target: 'chat-window',
      title: 'Ngobrol dengan Kawan',
      content:
        'Kawan adalah AI pendengar yang hangat. Ceritakan apa pun yang kamu rasakan soal kondisi ekonomi atau pekerjaanmu.',
    },
    {
      target: 'chat-input',
      title: 'Ketik ceritamu',
      content: 'Tekan Enter untuk mengirim, atau Shift + Enter untuk baris baru.',
    },
    {
      target: 'chat-note',
      title: 'Privasi & bantuan profesional',
      content:
        'Percakapan hanya tersimpan di sesi browser ini. Kawan bukan psikolog. Untuk kondisi darurat, hubungi Into The Light 119 ext 8.',
    },
  ],
};
