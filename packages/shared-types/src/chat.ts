import { z } from "zod";

export const messageSchema = z.object({
  id: z.string().uuid().optional(),
  content: z.string().min(1, "Message cannot be empty"),
  userId: z.string(),
  username: z.string().optional(),
  roomId: z.string(),
  createdAt: z.date().or(z.string()).optional(),
});

export type ChatMessage = z.infer<typeof messageSchema>;

export const sendChatSchema = z.object({
  content: z.string().min(1),
  roomId: z.string(),
});

export type SendChatMessage = z.infer<typeof sendChatSchema>;
