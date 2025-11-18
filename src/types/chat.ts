export interface ChatSummary {
  chatId: string;
  participants: string[]; // uids
  lastMessage?: string;
  updatedAt?: string; // ISO
  unread?: Record<string, number>;
}

export interface ChatMessage {
  messageId: string;
  senderId: string;
  text?: string;
  type?: "text" | "image" | "system";
  createdAt: string; // ISO
  readBy?: string[];
}
