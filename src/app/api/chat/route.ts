import { NextResponse } from "next/server";
import { genAI, allowedImageTypes, isEntertainmentRelated } from "@/lib/gemini";
import { ApiChatRequestBody } from "@/types/chat";

// Conversation history (in-memory per runtime instance)
let conversationHistory: any[] = [];

export async function POST(req: Request) {
  try {
    const body: ApiChatRequestBody = await req.json();
    const { text, image, mimeType } = body;

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const userParts: any[] = [];

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

    // Filter: Hanya izinkan topik hiburan jika ada teks
    if (text && !isEntertainmentRelated(text)) {
      return NextResponse.json({
        reply:
          "Maaf, ChatFilm hanya bisa menjawab seputar film, series, anime, aktor, dan dunia hiburan 🎬📺🍿",
      });
    }

    // Kirim conversation history + input baru ke model Gemini
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

    // Simpan history percakapan
    conversationHistory.push({ role: "user", parts: userParts });
    conversationHistory.push({
      role: "model",
      parts: [{ text: reply }],
    });

    return NextResponse.json({ reply, history: conversationHistory });
  } catch (error: any) {
    console.error("❌ Error di API route chat:", error);

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
