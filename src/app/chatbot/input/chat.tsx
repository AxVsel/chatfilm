"use client";

import { useState } from "react";

interface ChatInputProps {
  onSend: (data: { text?: string; file?: File }) => void;
}

export default function ChatInput({ onSend }: ChatInputProps) {
  const [input, setInput] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleSend = () => {
    if (!input.trim() && !file) return;

    onSend({ text: input, file: file ?? undefined });
    setInput(""); // reset text
    setFile(null); // reset file
    setPreview(null); // reset preview
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    setFile(selectedFile);

    // preview kalau image
    if (selectedFile.type.startsWith("image/")) {
      setPreview(URL.createObjectURL(selectedFile));
    } else {
      setPreview(null);
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      {/* Input bar */}
      <div className="flex gap-2 w-full items-center">
        <input
          type="text"
          placeholder="Tulis pesan..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
        />

        {/* Upload file */}
        <input
          id="file-upload"
          type="file"
          onChange={handleFileChange}
          className="hidden"
        />
        <label
          htmlFor="file-upload"
          className="px-3 py-2 bg-gray-200 rounded-lg cursor-pointer hover:bg-gray-300"
        >
          📎
        </label>

        <button
          onClick={handleSend}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Kirim
        </button>
      </div>

      {/* Preview file (kalau ada) */}
      {preview && (
        <div className="ml-1">
          <img
            src={preview}
            alt="preview"
            className="max-h-32 rounded-lg border"
          />
        </div>
      )}
      {file && !preview && (
        <p className="text-sm text-gray-600 ml-1">📎 {file.name}</p>
      )}
    </div>
  );
}
