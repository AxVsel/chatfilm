import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY || "";
export const genAI = new GoogleGenerativeAI(apiKey);

export const entertainmentKeywords = [
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

export const allowedImageTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

export function isEntertainmentRelated(text: string): boolean {
  if (!text) return false;
  const lower = text.toLowerCase();
  return entertainmentKeywords.some((keyword) => lower.includes(keyword));
}
