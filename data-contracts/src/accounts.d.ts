import { z } from 'zod';
export declare const accountSchema: z.ZodObject<{
    id: z.ZodString;
    institutionId: z.ZodString;
    name: z.ZodString;
    currency: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    name: string;
    institutionId: string;
    currency: string;
}, {
    id: string;
    name: string;
    institutionId: string;
    currency: string;
}>;
export declare const createAccountSchema: z.ZodObject<{
    institutionId: z.ZodString;
    name: z.ZodString;
    currency: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
    institutionId: string;
    currency: string;
}, {
    name: string;
    institutionId: string;
    currency: string;
}>;
export type AccountDto = z.infer<typeof accountSchema>;
//# sourceMappingURL=accounts.d.ts.map