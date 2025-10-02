// import { NextResponse } from "next/server";
// import { GoogleGenerativeAI } from "@google/generative-ai";

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// // daftar kata kunci yang dianggap relevan dengan dunia hiburan (film, series, anime, aktor, dll)
// const entertainmentKeywords = [
//   // Film & Series
//   "film",
//   "movie",
//   "cinema",
//   "bioskop",
//   "tayang",
//   "episode",
//   "series",
//   "season",
//   "trailer",
//   "genre",
//   "drama",
//   "komedi",
//   "romantis",
//   "thriller",

//   // Aktor & Aktris
//   "aktor",
//   "aktris",
//   "pemeran",
//   "cast",
//   "character",
//   "tokoh",
//   "sutradara",
//   "director",
//   "produser",
//   "aktor utama",
//   "peran",

//   // Anime & Manga
//   "anime",
//   "manga",
//   "manhwa",
//   "manhua",
//   "episode anime",
//   "season anime",
//   "studio anime",
//   "karakter anime",
//   "seiyuu", // pengisi suara Jepang
//   "voice actor",
//   "dubbing",

//   // Dunia Televisi & Hiburan
//   "tv",
//   "televisi",
//   "serial",
//   "sitcom",
//   "documentary",
//   "reality show",
//   "streaming",
//   "netflix",
//   "hbo",
//   "disney",
//   "prime video",
//   "crunchyroll",
//   "hulu",
// ];

// // ✅ whitelist mime type gambar
// const allowedImageTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];

// function isEntertainmentRelated(text: string): boolean {
//   if (!text) return false;
//   const lower = text.toLowerCase();
//   return entertainmentKeywords.some((keyword) => lower.includes(keyword));
// }

// export async function POST(req: Request) {
//   try {
//     const body = await req.json();
//     const { text, image, mimeType } = body;

//     const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

//     let input: any[] = [];

//     if (text) {
//       input.push({ text });
//     }

//     if (image && mimeType) {
//       // 🚨 cek apakah mimeType valid (hanya gambar)
//       if (!allowedImageTypes.includes(mimeType)) {
//         return NextResponse.json({
//           reply: `Maaf, file dengan format ${mimeType} tidak didukung. Hanya gambar (jpg, png, webp, gif) yang bisa dianalisis 📷`,
//         });
//       }

//       input.push({
//         inlineData: {
//           data: image, // base64
//           mimeType,
//         },
//       });
//     }

//     // 🔹 Filter: kalau ada teks tapi bukan terkait dunia hiburan (film/series/anime/aktor/tv)
//     if (text && !isEntertainmentRelated(text)) {
//       return NextResponse.json({
//         reply:
//           "Maaf, ChatFilm hanya bisa menjawab seputar film, series, anime, aktor, dan dunia hiburan 🎬📺🍿",
//       });
//     }

//     // 🔹 Kalau hanya gambar tanpa teks → tetap boleh dianalisa
//     const result = await model.generateContent(input);

//     const reply =
//       result.response.candidates?.[0]?.content.parts[0]?.text ||
//       "Maaf, saya tidak bisa menjawab.";

//     return NextResponse.json({ reply });
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json(
//       { error: "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// }
