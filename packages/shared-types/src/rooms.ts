import { z } from "zod";

export const roomSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(3),
  participants: z.array(z.string()),
});

export type Room = z.infer<typeof roomSchema>;
