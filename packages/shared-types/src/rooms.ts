import { z } from "zod";

export const createRoomSchema = z.object({
  name: z.string().min(3, "Le nom du salon doit faire au moins 3 caractères"),
  description: z.string().optional(),
  isPrivate: z.boolean().default(false),
  password: z.string().optional(),
});

export type CreateRoomRequest = z.infer<typeof createRoomSchema>;

export const roomSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(3),
  slug: z.string(),
  description: z.string().nullable(),
  isPrivate: z.boolean(),
  ownerId: z.string(),
  createdAt: z.date().or(z.string()),
  updatedAt: z.date().or(z.string()),
});

export type RoomResponse = z.infer<typeof roomSchema>;

export const joinRoomSchema = z.object({
  slug: z.string(),
  password: z.string().optional(),
});

export type JoinRoomRequest = z.infer<typeof joinRoomSchema>;

export const roomTokenSchema = z.object({
  token: z.string(),
  serverUrl: z.string(),
});

export type RoomTokenResponse = z.infer<typeof roomTokenSchema>;
