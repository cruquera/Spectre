import { z } from 'zod';

export const institutionTypeSchema = z.enum(['BANK', 'BROKER']);

export const institutionSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: institutionTypeSchema,
});

export const createInstitutionSchema = z.object({
  name: z.string().min(1),
  type: institutionTypeSchema,
});

export type InstitutionDto = z.infer<typeof institutionSchema>;
