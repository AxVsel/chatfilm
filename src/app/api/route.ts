// /app/api/gemini/route.ts
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getPopularMovies, searchMovies } from "@/app/lib/tmdb";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { text } = body;

    let prompt = text;
    const lower = text.toLowerCase();

    // -------------------
    // DAFTAR KEYWORDS
    // -------------------
    const popularKeywords = [
      "film populer",
      "rekomendasi film",
      "film terbaru",
      "saat ini",
    ];

    const searchKeywords = [
      "cari",
      "cari film",
      "rating",
      "tentang",
      "dari",
      "judul",
      "berjudul",
    ];
    // cek apakah kalimat mengandung kata populer
    const isPopular = popularKeywords.some((k) => lower.includes(k));
    // cek apakah kalimat mengandung kata pencarian
    const isSearch = searchKeywords.some((k) => lower.includes(k));

    // -------------------
    // PRIORITAS: SEARCH
    // -------------------
    if (isSearch) {
      // ambil query dengan hapus kata kunci
      let query = text
        .replace(
          /(cari|cari film|rating|tentang|dari|rekomendasi film|film terbaru|saat ini|berjudul)/gi,
          ""
        )
        .trim();

      if (!query && isPopular) {
        // fallback → kalau query kosong, tapi ada kata populer
        const match = text.match(/\d+/);
        const limit = match ? parseInt(match[0]) : 5;

        const movies = await getPopularMovies(limit);
        const movieList = movies
          .map(
            (m: any, i: number) => `${i + 1}. ${m.title} (${m.release_date})`
          )
          .join("\n");

        prompt = `Berikan jawaban natural seperti manusia. Saat ini ${limit} film populer adalah:\n${movieList}\nBuat rekomendasi singkat atau komentar tentang film-film ini.`;
      } else if (query) {
        // lakukan search film
        const movies = await searchMovies(query, 5);

        if (movies.length === 0) {
          prompt = `Tidak ada hasil untuk film dengan kata kunci "${query}".`;
        } else {
          const movieList = movies
            .map(
              (m: any, i: number) => `${i + 1}. ${m.title} (${m.release_date})`
            )
            .join("\n");

          prompt = `Berikan jawaban natural seperti manusia. Berikut hasil pencarian untuk "${query}":\n${movieList}\nTambahkan komentar singkat atau rekomendasi.`;
        }
      }
    }

    // -------------------
    // INTENT: POPULER
    // -------------------
    else if (isPopular) {
      const match = text.match(/\d+/);
      const limit = match ? parseInt(match[0]) : 5;

      const movies = await getPopularMovies(limit);
      const movieList = movies
        .map((m: any, i: number) => `${i + 1}. ${m.title} (${m.release_date})`)
        .join("\n");

      prompt = `Berikan jawaban natural seperti manusia. Saat ini ${limit} film populer adalah:\n${movieList}\nBuat rekomendasi singkat atau komentar tentang film-film ini.`;
    }

    // -------------------
    // JALANKAN AI
    // -------------------
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);

    const reply =
      result.response.candidates?.[0]?.content.parts[0]?.text ||
      "Maaf, saya tidak bisa menjawab.";

    return NextResponse.json({ reply });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
