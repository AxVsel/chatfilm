# 🎬 ChatFilm AI - Asisten Pintar Rekomendasi Film, Series & Anime

**ChatFilm AI** adalah aplikasi web cerdas berbasis **Next.js 15 (App Router)** dan **Google Gemini AI API** yang dirancang untuk memberikan rekomendasi film, sinopsis serial TV, analisis karakter anime, serta pembahasan poster/gambar seputar dunia hiburan sinematik.

---

## ✨ Fitur Utama (Key Features)

- 🤖 **Interaksi AI Cerdas**: Menggunakan model Gemini 2.5 Flash dengan *content filter* khusus topik hiburan sinematik (Film, Series, Anime, Aktor, Sutradara).
- 🗣️ **Text-To-Speech (Suara AI)**: Pembacaan suara jawaban AI secara alami dalam Bahasa Indonesia (*Web Speech API*) dilengkapi tombol dengarkan manual dan opsi *Auto-Speak*.
- 🖼️ **Analisis Gambar & Poster**: Fitur unggah file/gambar berbasis vision untuk dianalisis dan dibahas oleh AI.
- ☀️ 🌙 **Dual Theme (Light & Dark Mode)**: Penyesuaian tema visual *Cinema Dark* dan *Clean Light* dengan penyimpanan preferensi pengguna (`localStorage`).
- 📱 **Desain 100% Responsif**: Tata letak yang mulus dan adaptif di perangkat Mobile (HP), Tablet, hingga PC/Desktop.
- 💡 **Quick Suggestion Chips**: Tombol cepat untuk prompt rekomendasi populer saat obrolan baru dimulai.
- 🧱 **Arsitektur Kode Modular**: Pemisahan komponen UI, tipe data TypeScript, dan modul API terisolasi secara rapi dan profesional.

---

## 🛠️ Teknologi & Stack (Tech Stack)

| Kategori | Teknologi |
| --- | --- |
| **Framework** | [Next.js 15](https://nextjs.org/) (App Router) |
| **Library UI & Styling** | [React 19](https://react.dev/), [Tailwind CSS v4](https://tailwindcss.com/) |
| **AI Integration** | [@google/generative-ai](https://www.npmjs.com/package/@google/generative-ai) (Gemini 2.5 Flash) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) |
| **Speech Engine** | Native Web Speech API (`SpeechSynthesis`) |

---

## 📁 Struktur Proyek (Directory Structure)

```text
chatfilm/
├── public/                 # Aset statis & favicon
├── src/
│   ├── app/                # Next.js App Router (Page & API Routes)
│   │   ├── api/
│   │   │   └── chat/
│   │   │       └── route.ts  # Endpoint API Handler Chatbot (/api/chat)
│   │   ├── globals.css     # Design system & CSS Variables (Dark/Light mode)
│   │   ├── layout.tsx      # Root Layout & Metadata SEO
│   │   └── page.tsx        # Halaman Utama (Main Container)
│   ├── components/         # Reusable React Components (PascalCase)
│   │   └── chat/
│   │       ├── Chatfilm.tsx   # Container utama & State Management Chatbot
│   │       ├── ChatInput.tsx  # Form input pesan & file preview
│   │       └── ChatMessage.tsx# Render item pesan, markdown & Voice TTS
│   ├── lib/                # Business logic & Helper functions
│   │   └── gemini.ts       # Integrasi Gemini AI SDK & Entertainment filter
│   └── types/              # TypeScript Interface definitions
│       └── chat.ts         # Contract data Message, SendData, Theme, API
├── .env.local              # Environment Variables (API Key)
├── package.json
└── README.md
```

---

## 🚀 Menjalankan Proyek (Getting Started)

### 1. Prasyarat (Prerequisites)
Pastikan Anda telah menginstal **Node.js** (v18+) dan manajer paket seperti `npm` atau `pnpm`.

### 2. Konfigurasi Environment Variable
Buat file `.env.local` di direktori akar proyek:
```env
GEMINI_API_KEY=API_KEY_GEMINI_ANDA
```

### 3. Instalasi Dependensi
```bash
npm install
```

### 4. Menjalankan Server Pengembang (Development Server)
```bash
npm run dev
```
Buka browser dan akses [http://localhost:3000](http://localhost:3000) untuk melihat hasilnya.

---

## 📝 Penggunaan & Arsitektur
- **Route Handler**: `/api/chat/route.ts` menangani request POST dan mengelola histori percakapan.
- **Filter Entertainment**: Logika penyaring topik hiburan diisolasi di `src/lib/gemini.ts`.
- **Theme Persistence**: Preferensi tema disimpan pada `localStorage` dengan key `chatfilm_theme`.

Developed with 💖 & Professional Frontend Standards.
