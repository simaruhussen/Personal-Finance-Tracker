import { z } from 'zod';

export const createUserSchema = z.object({
  username: z.string().min(1)
});

export type CreateUserInput = z.infer<typeof createUserSchema>;