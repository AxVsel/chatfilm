"use client";

import { useEffect, useRef, useState } from "react";
import ChatInput from "./input/chat";

interface Message {
  id: number;
  text?: string;
  fileUrl?: string;
  type: "user" | "bot";
  fileName?: string;
}

export default function Chatfilm() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const handleSend = async (data: { text?: string; file?: File }) => {
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

    try {
      setLoading(true);

      const res = await fetch("/api", {
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

      // tampilkan balasan bot
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, text: json.reply, type: "bot" },
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
  };

  // auto scroll ke bawah saat ada pesan baru
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="font-sans flex flex-col w-svh h-dvh bg-[#DDDAD0] shadow-2xl">
        {/* Header */}
        <div className="p-4 bg-red-500 shadow-md border-b">
          <h1 className="text-2xl font-bold text-white">💬 ChatFilm</h1>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-150">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-end gap-2 ${
                  msg.type === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {msg.type === "bot" && (
                  <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-300 text-gray-700 text-sm">
                    🤖
                  </div>
                )}

                {/* Bubble Chat */}
                <div
                  className={`px-4 py-2 rounded-2xl max-w-md break-words shadow-sm transition-all duration-200 ${
                    msg.type === "user"
                      ? "bg-gradient-to-r from-red-500 to-red-600 text-white rounded-br-none"
                      : "bg-gray-100 text-gray-800 rounded-bl-none"
                  }`}
                >
                  {/* Text */}
                  {msg.text &&
                    (msg.type === "bot" ? (
                      <div className="space-y-2">
                        {msg.text.split("\n").map((line, i) => {
                          // Bullet list
                          if (line.trim().startsWith("*")) {
                            return (
                              <li key={i} className="ml-4 list-disc">
                                {line
                                  .replace(/^\*+\s*/, "")
                                  .replace(/\*\*(.*?)\*\*/g, "$1")}
                              </li>
                            );
                          }

                          // Bold parsing
                          const parts = line.split(/(\*\*.*?\*\*)/g);
                          return (
                            <p key={i}>
                              {parts.map((part, j) =>
                                part.startsWith("**") && part.endsWith("**") ? (
                                  <strong key={j}>
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
                      <p className="whitespace-pre-line">{msg.text}</p>
                    ))}

                  {/* File (gambar atau dokumen) */}
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
                        className="underline text-sm mt-2 block text-red-600"
                      >
                        📎 {msg.fileName}
                      </a>
                    ))}
                </div>

                {msg.type === "user" && (
                  <div className="w-8 h-8 flex items-center justify-center rounded-full bg-red-500 text-white text-sm">
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
                <div className="px-4 py-2 rounded-2xl bg-gray-100 text-gray-500 italic animate-pulse">
                  mengetik...
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Chat */}
          <div className="border-t p-3 bg-gray-100">
            <ChatInput onSend={handleSend} />
          </div>
        </div>
      </div>
    </div>
  );
}
