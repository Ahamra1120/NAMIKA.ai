# NAMIKA.ai

Aplikasi web berbasis AI untuk membantu masyarakat bangkit dari kesulitan ekonomi. Dibangun dengan React, TypeScript, dan Google Gemini AI.

## Fitur

- **Kalkulator Potensi Bisnis** — Masukkan modal, minat, dan keahlian. AI merekomendasikan ide bisnis konkret dengan estimasi pendapatan dan level risiko.
- **Curhat dengan Kawan** — Teman AI yang hadir 24/7 untuk mendengarkan dengan empati, tanpa menghakimi.

## Tech Stack

- React 19 + TypeScript
- Vite 8
- Tailwind CSS 3
- Google Gemini AI (gemini-2.5-flash)
- React Router v7

## Setup

1. Clone repo dan install dependencies:

```bash
npm install
```

2. Salin file environment:

```bash
cp .env.example .env.local
```

3. Isi API key Gemini di `.env.local`:

```
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

Dapatkan API key gratis di [Google AI Studio](https://aistudio.google.com/app/apikey).

4. Jalankan dev server:

```bash
npm run dev
```

Buka [http://localhost:5173](http://localhost:5173) di browser.

## Scripts

| Command | Deskripsi |
|---|---|
| `npm run dev` | Jalankan dev server |
| `npm run build` | Build untuk production |
| `npm run preview` | Preview hasil build |
| `npm run lint` | Cek linting |

## Struktur Proyek

```
src/
├── components/
│   ├── calculator/     # Form kalkulator bisnis
│   ├── chatbot/        # UI chat (bubble, input, window)
│   └── layout/         # Navbar
├── pages/              # HomePage, CalculatorPage, ChatbotPage
├── hooks/              # useChat, useBusinessCalculator
├── services/           # Gemini API integration
├── config/             # Konfigurasi API
├── constants/          # Prompt AI, daftar minat kerja
└── types/              # TypeScript types
```

## Catatan

Aplikasi ini adalah alat bantu, bukan pengganti konsultasi profesional. Untuk darurat kesehatan mental, hubungi **Into The Light Indonesia: 119 ext 8**.
