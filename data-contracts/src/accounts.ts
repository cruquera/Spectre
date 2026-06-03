import { z } from 'zod';

export const accountSchema = z.object({
  currency: z.string(),
  id: z.string(),
  institutionId: z.string(),
  name: z.string(),
});

export const createAccountSchema = z.object({
  currency: z.string().length(3),
  institutionId: z.string(),
  name: z.string().min(1),
});

export type AccountDto = z.infer<typeof accountSchema>;
