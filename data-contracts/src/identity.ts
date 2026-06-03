import { z } from 'zod';

export const profileSchema = z.object({
  displayName: z.string(),
  id: z.string(),
  lastLoginAt: z.string().nullable(),
  slug: z.string(),
});

export const createProfileRequestSchema = z.object({
  displayName: z.string().min(1).max(100),
  password: z.string().min(4),
  slug: z.string().regex(/^[a-z0-9-]+$/),
});

export const loginRequestSchema = z.object({
  password: z.string().min(1),
  slug: z.string(),
});

export type ProfileDto = z.infer<typeof profileSchema>;
export type CreateProfileRequest = z.infer<typeof createProfileRequestSchema>;
export type LoginRequest = z.infer<typeof loginRequestSchema>;
