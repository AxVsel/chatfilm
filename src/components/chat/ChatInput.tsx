"use client";

import { useState, ChangeEvent } from "react";
import { ChatInputProps } from "@/types/chat";

export default function ChatInput({ onSend, theme }: ChatInputProps) {
  const [input, setInput] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const isDark = theme === "dark";

  const handleSend = () => {
    if (!input.trim() && !file) return;

    onSend({ text: input, file: file ?? undefined });
    setInput("");
    setFile(null);
    setPreview(null);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    setFile(selectedFile);

    if (selectedFile.type.startsWith("image/")) {
      setPreview(URL.createObjectURL(selectedFile));
    } else {
      setPreview(null);
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      {/* File Preview Banner */}
      {preview && (
        <div
          className={`relative inline-flex items-center self-start border p-1.5 rounded-xl gap-2 shadow-lg ${
            isDark
              ? "bg-slate-900 border-slate-700/80"
              : "bg-white border-slate-200"
          }`}
        >
          <img
            src={preview}
            alt="Preview"
            className="h-16 w-16 object-cover rounded-lg border border-slate-700/50"
          />
          <div className="flex flex-col pr-2">
            <span
              className={`text-xs font-medium truncate max-w-[150px] sm:max-w-[200px] ${
                isDark ? "text-slate-200" : "text-slate-800"
              }`}
            >
              {file?.name}
            </span>
            <span
              className={`text-[10px] ${
                isDark ? "text-slate-400" : "text-slate-500"
              }`}
            >
              Siap diunggah
            </span>
          </div>
          <button
            onClick={() => {
              setFile(null);
              setPreview(null);
            }}
            className={`p-1 rounded-full transition-colors ${
              isDark
                ? "text-slate-400 hover:text-red-400 hover:bg-slate-800"
                : "text-slate-500 hover:text-red-600 hover:bg-slate-100"
            }`}
            title="Hapus lampiran"
          >
            ✕
          </button>
        </div>
      )}

      {file && !preview && (
        <div
          className={`flex items-center gap-2 border px-3 py-1.5 rounded-xl text-xs self-start ${
            isDark
              ? "bg-slate-900 border-slate-700/80 text-slate-300"
              : "bg-white border-slate-200 text-slate-700"
          }`}
        >
          <span>📎</span>
          <span className="truncate max-w-[180px] sm:max-w-[250px] font-medium">
            {file.name}
          </span>
          <button
            onClick={() => setFile(null)}
            className="text-red-500 hover:text-red-600 font-bold ml-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* Input bar */}
      <div className="flex items-center gap-2 w-full">
        {/* Attachment Button */}
        <input
          id="file-upload"
          type="file"
          accept="image/*,.pdf,.doc,.docx"
          onChange={handleFileChange}
          className="hidden"
        />
        <label
          htmlFor="file-upload"
          className={`p-2.5 sm:px-3.5 sm:py-2.5 border rounded-xl cursor-pointer transition-colors flex items-center justify-center shadow-sm ${
            isDark
              ? "bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800"
              : "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300"
          }`}
          title="Lampirkan Gambar atau Dokumentasi Film"
        >
          <span className="text-lg">📷</span>
        </label>

        {/* Text Input */}
        <input
          type="text"
          placeholder="Tanya seputar film, series, anime..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          className={`flex-1 rounded-xl px-4 py-2.5 text-sm sm:text-base border focus:outline-none focus:ring-2 focus:ring-rose-500/60 transition-all shadow-inner ${
            isDark
              ? "bg-slate-900/90 text-slate-100 placeholder-slate-500 border-slate-800 focus:border-rose-500"
              : "bg-white text-slate-900 placeholder-slate-400 border-slate-300 focus:border-rose-500"
          }`}
        />

        {/* Send Button */}
        <button
          onClick={handleSend}
          disabled={!input.trim() && !file}
          className="px-4 py-2.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium text-sm sm:text-base rounded-xl transition-all shadow-md shadow-red-900/20 active:scale-95 flex items-center gap-1.5 flex-shrink-0"
        >
          <span className="hidden sm:inline">Kirim</span>
          <span className="text-base sm:text-sm">🚀</span>
        </button>
      </div>
    </div>
  );
}
