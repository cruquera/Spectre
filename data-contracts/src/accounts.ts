import { z } from 'zod';

export const INSTITUTIONS = [
  'Banco Inter',
  'Banco Inter Global',
  'Banco Safra',
  'Nomad',
  'Nubank',
] as const;

export const institutionNameSchema = z.enum(INSTITUTIONS);

export const accountSchema = z.object({
  currency: z.string(),
  id: z.string(),
  institutionName: institutionNameSchema,
  nickname: z.string(),
});

export const createAccountSchema = z.object({
  currency: z.string().length(3),
  institutionName: institutionNameSchema,
  nickname: z.string().min(1),
});

export type AccountDto = z.infer<typeof accountSchema>;
export type CreateAccountRequest = z.infer<typeof createAccountSchema>;
