import { z } from "zod";

export const createTransactionSchema = z.object({
  amount: z.number(),
  type: z.enum(["income", "expense"]),
  category: z.string().min(1),
  description: z.string().optional(),
  date: z.string().refine((s) => !Number.isNaN(Date.parse(s)), { message: "Invalid date" }),
  userId: z.number().optional() // for now optional; in auth flow use from token
});

export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;