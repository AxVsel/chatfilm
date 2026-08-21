"use client";

import { Message, ThemeMode } from "@/types/chat";

interface ChatMessageProps {
  message: Message;
  theme: ThemeMode;
  isSpeaking: boolean;
  onSpeak: (id: number, text: string) => void;
  onStopSpeak: () => void;
}

export default function ChatMessage({
  message,
  theme,
  isSpeaking,
  onSpeak,
  onStopSpeak,
}: ChatMessageProps) {
  const isUser = message.type === "user";
  const isDark = theme === "dark";

  const handleSpeakClick = () => {
    if (isSpeaking) {
      onStopSpeak();
    } else if (message.text) {
      // Clean markdown symbols for speech reading
      const plainText = message.text
        .replace(/[\*\#\`\-\_]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
      onSpeak(message.id, plainText);
    }
  };

  return (
    <div
      className={`flex items-end gap-2.5 my-2.5 ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      {/* Avatar Bot */}
      {!isUser && (
        <div
          className={`w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-xl font-bold shadow-md flex-shrink-0 text-sm sm:text-base border ${
            isDark
              ? "bg-gradient-to-br from-red-600 to-rose-700 text-white border-rose-400/20"
              : "bg-gradient-to-br from-red-500 to-rose-600 text-white border-rose-300"
          }`}
        >
          🍿
        </div>
      )}

      {/* Bubble Chat */}
      <div
        className={`px-4 py-3 rounded-2xl max-w-[85%] sm:max-w-md md:max-w-lg lg:max-w-xl break-words transition-all duration-200 text-sm sm:text-base relative group ${
          isUser
            ? isDark
              ? "bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white rounded-br-xs border border-rose-500/30 shadow-md"
              : "bg-gradient-to-r from-red-500 via-rose-500 to-red-600 text-white rounded-br-xs shadow-md"
            : isDark
            ? "bg-slate-900/90 text-slate-100 rounded-bl-xs border border-slate-800 shadow-md backdrop-blur-sm"
            : "bg-white text-slate-800 rounded-bl-xs border border-slate-200/90 shadow-sm"
        }`}
      >
        {/* Render Text */}
        {message.text &&
          (!isUser ? (
            <div className="space-y-2 leading-relaxed">
              {message.text.split("\n").map((line, i) => {
                const trimmed = line.trim();

                if (!trimmed) {
                  return <div key={i} className="h-1" />;
                }

                if (trimmed.startsWith("###")) {
                  return (
                    <h4
                      key={i}
                      className={`font-semibold text-base sm:text-lg mt-2 mb-1 ${
                        isDark ? "text-rose-400" : "text-red-600"
                      }`}
                    >
                      {trimmed.replace(/^###\s*/, "")}
                    </h4>
                  );
                }

                if (trimmed.startsWith("*") || trimmed.startsWith("-")) {
                  const content = trimmed
                    .replace(/^[\*\-]\s*/, "")
                    .replace(/\*\*(.*?)\*\*/g, "$1");
                  return (
                    <div key={i} className="flex items-start gap-2 ml-2 my-1">
                      <span
                        className={`font-bold select-none ${
                          isDark ? "text-rose-400" : "text-red-500"
                        }`}
                      >
                        •
                      </span>
                      <span>{content}</span>
                    </div>
                  );
                }

                const parts = line.split(/(\*\*.*?\*\*)/g);
                return (
                  <p key={i}>
                    {parts.map((part, j) =>
                      part.startsWith("**") && part.endsWith("**") ? (
                        <strong
                          key={j}
                          className={`font-semibold ${
                            isDark ? "text-white" : "text-slate-900"
                          }`}
                        >
                          {part.replace(/\*\*/g, "")}
                        </strong>
                      ) : (
                        part
                      )
                    )}
                  </p>
                );
              })}
            </div>
          ) : (
            <p className="whitespace-pre-line leading-relaxed">{message.text}</p>
          ))}

        {/* Action Toolbar for Bot Message (TTS Speak Button) */}
        {!isUser && message.text && (
          <div className="mt-2.5 pt-2 border-t border-slate-200/20 dark:border-slate-800 flex items-center justify-between gap-2">
            <button
              onClick={handleSpeakClick}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                isSpeaking
                  ? "bg-rose-500 text-white animate-pulse shadow-sm"
                  : isDark
                  ? "bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
              }`}
              title={isSpeaking ? "Hentikan Suara AI" : "Dengarkan Suara AI"}
            >
              <span>{isSpeaking ? "⏹️ Stop Suara" : "🔊 Dengarkan"}</span>
            </button>
            {isSpeaking && (
              <span className="text-[11px] text-rose-500 dark:text-rose-400 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping"></span>
                AI sedang berbicara...
              </span>
            )}
          </div>
        )}

        {/* Render Image / File Attachment */}
        {message.fileUrl && (
          <div className="mt-2 pt-2 border-t border-slate-200/20 dark:border-slate-800">
            {message.fileName?.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
              <a
                href={message.fileUrl}
                target="_blank"
                rel="noreferrer"
                className="block group relative overflow-hidden rounded-xl border border-slate-700/50"
              >
                <img
                  src={message.fileUrl}
                  alt="Uploaded preview"
                  className="max-h-56 w-full object-cover rounded-xl transition-transform duration-300 group-hover:scale-105"
                />
              </a>
            ) : (
              <a
                href={message.fileUrl}
                download={message.fileName}
                className={`inline-flex items-center gap-2 text-xs sm:text-sm font-medium px-3 py-1.5 rounded-lg border transition-colors ${
                  isUser
                    ? "bg-white/10 border-white/20 text-white hover:bg-white/20"
                    : isDark
                    ? "bg-slate-800 border-slate-700 text-rose-400 hover:bg-slate-700"
                    : "bg-slate-100 border-slate-200 text-red-600 hover:bg-slate-200"
                }`}
              >
                <span>📎</span>
                <span className="truncate max-w-[200px]">
                  {message.fileName || "Unduh file"}
                </span>
              </a>
            )}
          </div>
        )}
      </div>

      {/* Avatar User */}
      {isUser && (
        <div
          className={`w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-xl font-bold shadow-md flex-shrink-0 text-sm sm:text-base border ${
            isDark
              ? "bg-slate-800 text-slate-200 border-slate-700"
              : "bg-slate-200 text-slate-700 border-slate-300"
          }`}
        >
          👤
        </div>
      )}
    </div>
  );
}
