import { z } from 'zod';
export declare const profileSchema: z.ZodObject<{
    id: z.ZodString;
    displayName: z.ZodString;
    slug: z.ZodString;
    lastLoginAt: z.ZodNullable<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    id: string;
    displayName: string;
    slug: string;
    lastLoginAt: string | null;
}, {
    id: string;
    displayName: string;
    slug: string;
    lastLoginAt: string | null;
}>;
export declare const createProfileRequestSchema: z.ZodObject<{
    displayName: z.ZodString;
    slug: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    displayName: string;
    slug: string;
    password: string;
}, {
    displayName: string;
    slug: string;
    password: string;
}>;
export declare const loginRequestSchema: z.ZodObject<{
    slug: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    slug: string;
    password: string;
}, {
    slug: string;
    password: string;
}>;
export type ProfileDto = z.infer<typeof profileSchema>;
export type CreateProfileRequest = z.infer<typeof createProfileRequestSchema>;
export type LoginRequest = z.infer<typeof loginRequestSchema>;
//# sourceMappingURL=identity.d.ts.map