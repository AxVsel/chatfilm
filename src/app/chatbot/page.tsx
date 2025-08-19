"use client";

import { useState } from "react";
import ChatInput from "./input/chat";

interface Message {
  id: number;
  text?: string;
  fileUrl?: string;
  type: "user" | "bot";
  fileName?: string;
}

export default function Chatboot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSend = async (data: { text?: string; file?: File }) => {
    let fileUrl: string | undefined;
    if (data.file) {
      fileUrl = URL.createObjectURL(data.file);
    }

    // tampilkan pesan user
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

    if (data.text) {
      try {
        setLoading(true);

        // panggil API Gemini
        const res = await fetch("/api/gemini", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: data.text }),
        });

        const json = await res.json();

        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            text: json.reply,
            type: "bot",
          },
        ]);
      } catch (err) {
        console.error(err);
        setMessages((prev) => [
          ...prev,
          { id: Date.now() + 2, text: "⚠️ Terjadi error.", type: "bot" },
        ]);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="font-sans flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">💬 Chatbot</h1>

      {/* Box Chat */}
      <div className="w-full max-w-lg flex flex-col border rounded-2xl shadow-lg bg-white overflow-hidden">
        {/* Messages */}
        <div className="flex-1 p-4 space-y-4 overflow-y-auto max-h-[500px] scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-2 ${
                msg.type === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {/* Avatar bot */}
              {msg.type === "bot" && (
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-300 text-gray-700 text-sm">
                  🤖
                </div>
              )}

              <div
                className={`px-4 py-2 rounded-2xl max-w-xs break-words shadow-sm ${
                  msg.type === "user"
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-none"
                    : "bg-gray-100 text-gray-800 rounded-bl-none"
                }`}
              >
                {msg.text && <p className="whitespace-pre-line">{msg.text}</p>}

                {msg.fileUrl &&
                  (msg.fileName?.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                    <img
                      src={msg.fileUrl}
                      alt="upload"
                      className="max-h-40 rounded-lg mt-2 border"
                    />
                  ) : (
                    <a
                      href={msg.fileUrl}
                      download={msg.fileName}
                      className="underline text-sm mt-2 block text-blue-600"
                    >
                      📎 {msg.fileName}
                    </a>
                  ))}
              </div>

              {/* Avatar user */}
              {msg.type === "user" && (
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-500 text-white text-sm">
                  👤
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-start gap-2">
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-300 text-gray-700 text-sm">
                🤖
              </div>
              <div className="px-4 py-2 rounded-2xl bg-gray-100 text-gray-500 italic">
                mengetik...
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="border-t p-3 bg-gray-50">
          <ChatInput onSend={handleSend} />
        </div>
      </div>
    </div>
  );
}
