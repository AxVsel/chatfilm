export type ThemeMode = "dark" | "light";

export interface Message {
  id: number;
  text?: string;
  fileUrl?: string;
  type: "user" | "bot";
  fileName?: string;
}

export interface SendData {
  text?: string;
  file?: File;
}

export interface ChatInputProps {
  onSend: (data: SendData) => void;
  theme: ThemeMode;
}

export interface ApiChatRequestBody {
  text?: string;
  image?: string;
  mimeType?: string;
}

export interface ApiChatResponseBody {
  reply?: string;
  history?: any[];
  error?: boolean;
  message?: string;
  details?: any;
}
