"use client";

import { useEffect, useRef, useState } from "react";
import { Message, SendData, ThemeMode } from "@/types/chat";
import ChatInput from "./ChatInput";
import ChatMessage from "./ChatMessage";

const SUGGESTION_CHIPS = [
  { icon: "🍿", text: "Rekomendasi film plot twist terbaik 2024" },
  { icon: "📺", text: "Top 5 Series Netflix yang wajib ditonton" },
  { icon: "⛩️", text: "Anime underrated genre mystery/thriller" },
  { icon: "🎭", text: "Siapa pemeran utama film Oppenheimer?" },
];

export default function Chatfilm() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState<ThemeMode>("dark");
  const [autoSpeak, setAutoSpeak] = useState<boolean>(false);
  const [currentlySpeakingId, setCurrentlySpeakingId] = useState<number | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Initialize Theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("chatfilm_theme") as ThemeMode | null;
    if (savedTheme === "light" || savedTheme === "dark") {
      setTheme(savedTheme);
    }
  }, []);

  // Save Theme to localStorage & Update HTML root class
  const toggleTheme = () => {
    const nextTheme: ThemeMode = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("chatfilm_theme", nextTheme);
  };

  // Text-To-Speech (TTS) Engine
  const handleSpeak = (id: number, text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      alert("Maaf, browser Anda tidak mendukung fitur Text-to-Speech.");
      return;
    }

    // Stop current speech if playing
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "id-ID";
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    // Pick Indonesian voice if available
    const voices = window.speechSynthesis.getVoices();
    const idVoice = voices.find((v) => v.lang.includes("id") || v.lang.includes("ID"));
    if (idVoice) {
      utterance.voice = idVoice;
    }

    utterance.onstart = () => {
      setCurrentlySpeakingId(id);
    };

    utterance.onend = () => {
      setCurrentlySpeakingId(null);
    };

    utterance.onerror = (event: SpeechSynthesisErrorEvent) => {
      if (event.error !== "interrupted" && event.error !== "canceled") {
        console.warn("SpeechSynthesis event status:", event.error);
      }
      setCurrentlySpeakingId(null);
    };

    window.speechSynthesis.speak(utterance);
  };

  const handleStopSpeak = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setCurrentlySpeakingId(null);
  };

  const handleSend = async (data: SendData) => {
    // Stop speaking when user sends a new message
    handleStopSpeak();

    let fileUrl: string | undefined;
    let base64Image: string | undefined;
    let mimeType: string | undefined;

    if (data.file) {
      const file = data.file;
      fileUrl = URL.createObjectURL(file);
      mimeType = file.type;

      const reader = new FileReader();
      base64Image = await new Promise<string>((resolve) => {
        reader.onloadend = () =>
          resolve((reader.result as string).split(",")[1]);
        reader.readAsDataURL(file);
      });
    }

    // Tampilkan pesan user
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        text: data.text,
        fileUrl,
        type: "user",
        fileName: data.file?.name,
      },
    ]);

    try {
      setLoading(true);

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: data.text,
          image: base64Image,
          mimeType,
        }),
      });

      if (!res.ok) throw new Error("API error");

      const json = await res.json();
      const botMessageId = Date.now() + 1;
      const replyText = json.reply;

      // Tampilkan balasan bot
      setMessages((prev) => [
        ...prev,
        { id: botMessageId, text: replyText, type: "bot" },
      ]);

      // If Auto Speak is active, speak out automatically
      if (autoSpeak && replyText) {
        const plainText = replyText
          .replace(/[\*\#\`\-\_]/g, " ")
          .replace(/\s+/g, " ")
          .trim();
        setTimeout(() => {
          handleSpeak(botMessageId, plainText);
        }, 300);
      }
    } catch (err) {
      console.error("Error sending message:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 2,
          text: "⚠️ Terjadi kesalahan saat menghubungi AI server. Pastikan koneksi internet Anda lancar.",
          type: "bot",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickPrompt = (promptText: string) => {
    handleSend({ text: promptText });
  };

  const handleClearHistory = () => {
    if (confirm("Apakah Anda yakin ingin menghapus riwayat obrolan?")) {
      handleStopSpeak();
      setMessages([]);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const isDark = theme === "dark";

  return (
    <div
      className={`flex flex-col w-full h-full font-sans transition-colors duration-300 ${
        isDark ? "bg-[#090d16] text-slate-100" : "bg-slate-50 text-slate-900"
      }`}
    >
      {/* Header */}
      <header
        className={`px-4 py-3 sm:px-6 sm:py-4 border-b backdrop-blur-md flex items-center justify-between z-10 shadow-sm transition-colors duration-300 ${
          isDark
            ? "bg-slate-900/90 border-slate-800"
            : "bg-white/90 border-slate-200"
        }`}
      >
        {/* Brand */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div
            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-lg sm:text-xl shadow-md border ${
              isDark
                ? "bg-gradient-to-br from-red-600 via-rose-600 to-red-700 text-white border-rose-400/20"
                : "bg-gradient-to-br from-red-500 to-rose-600 text-white border-rose-300"
            }`}
          >
            🍿
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold tracking-wide flex items-center gap-2">
              <span className={isDark ? "text-white" : "text-slate-900"}>
                ChatFilm
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/20 text-red-500 font-semibold border border-red-500/30">
                AI
              </span>
            </h1>
            <p
              className={`text-xs flex items-center gap-1.5 ${
                isDark ? "text-slate-400" : "text-slate-500"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Asisten AI Film, Series & Anime
            </p>
          </div>
        </div>

        {/* Action Toolbar (Auto Speak, Light/Dark Mode Toggle, Clear) */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Auto Speak Toggle */}
          <button
            onClick={() => {
              if (autoSpeak) handleStopSpeak();
              setAutoSpeak(!autoSpeak);
            }}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1 border ${
              autoSpeak
                ? "bg-rose-600 text-white border-rose-500 shadow-sm"
                : isDark
                ? "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700"
                : "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200"
            }`}
            title={
              autoSpeak
                ? "Auto Suara Aktif (AI membaca otomatis)"
                : "Aktifkan Auto Suara AI"
            }
          >
            <span>{autoSpeak ? "🔊 Suara ON" : "🔇 Suara OFF"}</span>
          </button>

          {/* Light / Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-xl text-xs sm:text-sm border transition-all flex items-center justify-center ${
              isDark
                ? "bg-slate-800 text-amber-300 border-slate-700 hover:bg-slate-700"
                : "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200"
            }`}
            title={
              isDark ? "Beralih ke Mode Terang (Light Mode)" : "Beralih ke Mode Gelap (Dark Mode)"
            }
          >
            <span>{isDark ? "☀️" : "🌙"}</span>
          </button>

          {/* Clear History Button */}
          {messages.length > 0 && (
            <button
              onClick={handleClearHistory}
              className={`p-2 rounded-xl text-xs sm:text-sm transition-colors flex items-center gap-1 ${
                isDark
                  ? "text-slate-400 hover:text-red-400 hover:bg-slate-800"
                  : "text-slate-500 hover:text-red-600 hover:bg-slate-100"
              }`}
              title="Bersihkan riwayat obrolan"
            >
              <span>🗑️</span>
              <span className="hidden md:inline">Bersihkan</span>
            </button>
          )}
        </div>
      </header>

      {/* Chat Messages Main Area */}
      <main
        className={`flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 transition-colors duration-300 ${
          isDark
            ? "bg-gradient-to-b from-[#090d16] via-[#0d1322] to-[#090d16]"
            : "bg-slate-50"
        }`}
      >
        {/* Welcome Empty State */}
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 max-w-lg mx-auto my-auto animate-fade-in">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-red-600 to-rose-700 flex items-center justify-center text-3xl sm:text-4xl shadow-xl mb-4 border border-rose-500/30 text-white">
              🍿
            </div>
            <h2
              className={`text-xl sm:text-2xl font-bold mb-2 ${
                isDark ? "text-white" : "text-slate-900"
              }`}
            >
              Selamat Datang di ChatFilm!
            </h2>
            <p
              className={`text-xs sm:text-sm mb-6 leading-relaxed ${
                isDark ? "text-slate-400" : "text-slate-600"
              }`}
            >
              Tanyakan apa saja seputar rekomendasi film, alur cerita series, karakter anime, atau dengarkan balasan AI secara langsung!
            </p>

            {/* Quick Suggestion Chips */}
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-left">
              {SUGGESTION_CHIPS.map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuickPrompt(chip.text)}
                  className={`p-3 border rounded-xl text-xs sm:text-sm transition-all flex items-start gap-2.5 group shadow-sm ${
                    isDark
                      ? "bg-slate-900/80 hover:bg-slate-800 border-slate-800 hover:border-rose-500/40 text-slate-300"
                      : "bg-white hover:bg-slate-100 border-slate-200/90 hover:border-rose-400 text-slate-700"
                  }`}
                >
                  <span className="text-base group-hover:scale-110 transition-transform">
                    {chip.icon}
                  </span>
                  <span className="line-clamp-2 leading-snug">{chip.text}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Message List */}
        {messages.map((msg) => (
          <ChatMessage
            key={msg.id}
            message={msg}
            theme={theme}
            isSpeaking={currentlySpeakingId === msg.id}
            onSpeak={handleSpeak}
            onStopSpeak={handleStopSpeak}
          />
        ))}

        {/* Loading Indicator */}
        {loading && (
          <div className="flex items-end gap-2.5 my-2">
            <div className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-rose-700 text-white text-sm sm:text-base font-bold shadow-md border border-rose-400/20">
              🍿
            </div>
            <div
              className={`px-4 py-3 rounded-2xl rounded-bl-xs border text-xs sm:text-sm flex items-center gap-2 shadow-sm ${
                isDark
                  ? "bg-slate-900 border-slate-800 text-slate-400"
                  : "bg-white border-slate-200 text-slate-500"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
              ChatFilm sedang mengetik...
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </main>

      {/* Footer / Input Bar */}
      <footer
        className={`p-3 sm:p-4 border-t backdrop-blur-md shadow-lg transition-colors duration-300 ${
          isDark
            ? "bg-slate-900/90 border-slate-800"
            : "bg-white/90 border-slate-200"
        }`}
      >
        <ChatInput onSend={handleSend} theme={theme} />
      </footer>
    </div>
  );
}
