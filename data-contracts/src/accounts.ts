import { z } from 'zod';

export const INSTITUTIONS = [
  'Banco Inter',
  'Banco Safra',
  'Nubank',
  'Nomad',
  'Banco Inter Global',
] as const;

export const institutionNameSchema = z.enum(INSTITUTIONS);

export const accountSchema = z.object({
  id: z.string(),
  institutionName: institutionNameSchema,
  nickname: z.string(),
  currency: z.string(),
});

export const createAccountSchema = z.object({
  institutionName: institutionNameSchema,
  nickname: z.string().min(1),
  currency: z.string().length(3),
});

export type AccountDto = z.infer<typeof accountSchema>;
export type CreateAccountRequest = z.infer<typeof createAccountSchema>;
