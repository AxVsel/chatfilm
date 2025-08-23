// /app/api/gemini/route.ts
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// daftar kata kunci yang dianggap relevan dengan film
const filmKeywords = [
  "film",
  "movie",
  "cinema",
  "aktor",
  "aktris",
  "sutradara",
  "director",
  "pemeran",
  "cast",
  "genre",
  "bioskop",
  "tayang",
  "episode",
  "series",
  "trailer",
];

function isFilmRelated(text: string): boolean {
  if (!text) return false;
  const lower = text.toLowerCase();
  return filmKeywords.some((keyword) => lower.includes(keyword));
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { text, image, mimeType } = body;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    let input: any[] = [];

    if (text) {
      input.push({ text });
    }

    if (image && mimeType) {
      input.push({
        inlineData: {
          data: image, // base64
          mimeType,
        },
      });
    }

    // 🔹 Filter: kalau ada teks tapi bukan terkait film
    if (text && !isFilmRelated(text)) {
      return NextResponse.json({
        reply: "Maaf, ChatFilm hanya bisa menjawab tentang film saja 🎬",
      });
    }

    // 🔹 Kalau hanya gambar tanpa teks → tetap boleh dianalisa
    const result = await model.generateContent(input);

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
