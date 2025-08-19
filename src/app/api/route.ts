import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getPopularMovies } from "../lib/tmdb";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();

    if (!text) {
      return NextResponse.json({ reply: "⚠️ Input kosong" }, { status: 400 });
    }

    // 🔹 jika user minta film populer → jawab dari TMDB
    if (text.toLowerCase().includes("film populer")) {
      const movies = await getPopularMovies();
      const movieList = movies
        .map((m: any, i: number) => `${i + 1}. ${m.title} (${m.release_date})`)
        .join("\n");

      return NextResponse.json({
        reply: `🎬 Berikut film populer menurut TMDB:\n\n${movieList}`,
      });
    }
    // 🔹 selain itu → jawab pakai Gemini
    const result = await model.generateContent(text); // ✅ cukup string
    const reply = result.response.text(); // ✅ ambil jawaban

    return NextResponse.json({ reply });
  } catch (err: any) {
    console.error("❌ API Error:", err);
    return NextResponse.json(
      { reply: "⚠️ Terjadi error di server." },
      { status: 500 }
    );
  }
}
