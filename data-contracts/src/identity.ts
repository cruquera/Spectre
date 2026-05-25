import { z } from 'zod';

export const profileSchema = z.object({
  id: z.string(),
  displayName: z.string(),
  slug: z.string(),
  lastLoginAt: z.string().nullable(),
});

export const createProfileRequestSchema = z.object({
  displayName: z.string().min(1).max(100),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  password: z.string().min(4),
});

export const loginRequestSchema = z.object({
  slug: z.string(),
  password: z.string().min(1),
});

export type ProfileDto = z.infer<typeof profileSchema>;
export type CreateProfileRequest = z.infer<typeof createProfileRequestSchema>;
export type LoginRequest = z.infer<typeof loginRequestSchema>;
