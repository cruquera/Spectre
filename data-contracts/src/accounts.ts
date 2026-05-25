import { z } from 'zod';

export const accountSchema = z.object({
  id: z.string(),
  institutionId: z.string(),
  name: z.string(),
  currency: z.string(),
});

export const createAccountSchema = z.object({
  institutionId: z.string(),
  name: z.string().min(1),
  currency: z.string().length(3),
});

export type AccountDto = z.infer<typeof accountSchema>;
