import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// ✅ simpan history percakapan (sementara, hilang kalau server restart)
let conversationHistory: any[] = [];

// daftar kata kunci hiburan
const entertainmentKeywords = [
  "film",
  "movie",
  "cinema",
  "bioskop",
  "tayang",
  "episode",
  "series",
  "season",
  "trailer",
  "genre",
  "drama",
  "komedi",
  "romantis",
  "thriller",
  "aktor",
  "aktris",
  "pemeran",
  "cast",
  "character",
  "tokoh",
  "sutradara",
  "director",
  "produser",
  "aktor utama",
  "peran",
  "anime",
  "manga",
  "manhwa",
  "manhua",
  "episode anime",
  "season anime",
  "studio anime",
  "karakter anime",
  "seiyuu",
  "voice actor",
  "dubbing",
  "tv",
  "televisi",
  "serial",
  "sitcom",
  "documentary",
  "reality show",
  "streaming",
  "netflix",
  "hbo",
  "disney",
  "prime video",
  "crunchyroll",
  "hulu",
];

// ✅ whitelist mime type gambar
const allowedImageTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

function isEntertainmentRelated(text: string): boolean {
  if (!text) return false;
  const lower = text.toLowerCase();
  return entertainmentKeywords.some((keyword) => lower.includes(keyword));
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { text, image, mimeType } = body;

    // ✅ pakai model yang valid
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash", // ✅ harus ada -latest
    });

    let userParts: any[] = [];

    if (text) {
      userParts.push({ text });
    }

    if (image && mimeType) {
      if (!allowedImageTypes.includes(mimeType)) {
        return NextResponse.json({
          reply: `Maaf, file dengan format ${mimeType} tidak didukung. Hanya gambar (jpg, png, webp, gif) yang bisa dianalisis 📷`,
        });
      }

      userParts.push({
        inlineData: {
          data: image, // base64 string
          mimeType,
        },
      });
    }

    // 🔹 Filter: hanya hiburan
    if (text && !isEntertainmentRelated(text)) {
      return NextResponse.json({
        reply:
          "Maaf, ChatFilm hanya bisa menjawab seputar film, series, anime, aktor, dan dunia hiburan 🎬📺🍿",
      });
    }

    // ✅ kirim history lama + input baru ke model
    const result = await model.generateContent({
      contents: [
        ...conversationHistory,
        {
          role: "user",
          parts: userParts,
        },
      ],
    });

    const reply =
      result.response.candidates?.[0]?.content.parts[0]?.text ||
      "Maaf, saya tidak bisa menjawab.";

    // ✅ simpan history
    conversationHistory.push({ role: "user", parts: userParts });
    conversationHistory.push({
      role: "model",
      parts: [{ text: reply }],
    });

    return NextResponse.json({ reply, history: conversationHistory });
  } catch (error: any) {
    console.error("❌ Error di API route:", error);

    return NextResponse.json(
      {
        error: true,
        message: error.message || "Internal Server Error",
        details: error,
      },
      { status: 500 }
    );
  }
}
