import { z } from 'zod';
export declare const patrimonySnapshotSchema: z.ZodObject<{
    id: z.ZodString;
    portfolioId: z.ZodString;
    totalValue: z.ZodNumber;
    currency: z.ZodString;
    capturedAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    currency: string;
    portfolioId: string;
    totalValue: number;
    capturedAt: string;
}, {
    id: string;
    currency: string;
    portfolioId: string;
    totalValue: number;
    capturedAt: string;
}>;
export declare const captureSnapshotSchema: z.ZodObject<{
    portfolioId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    portfolioId: string;
}, {
    portfolioId: string;
}>;
//# sourceMappingURL=patrimony.d.ts.map