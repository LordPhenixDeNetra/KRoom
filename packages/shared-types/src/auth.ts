import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export type LoginRequest = z.infer<typeof loginSchema>;

export const registerSchema = loginSchema.extend({
  username: z.string().min(3).optional(),
});

export type RegisterRequest = z.infer<typeof registerSchema>;
