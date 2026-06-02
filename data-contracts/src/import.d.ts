import { z } from 'zod';
export declare const importQuotesCsvSchema: z.ZodObject<{
    csvContent: z.ZodString;
}, "strip", z.ZodTypeAny, {
    csvContent: string;
}, {
    csvContent: string;
}>;
export declare const importOperationsCsvSchema: z.ZodObject<{
    accountId: z.ZodString;
    csvContent: z.ZodString;
}, "strip", z.ZodTypeAny, {
    accountId: string;
    csvContent: string;
}, {
    accountId: string;
    csvContent: string;
}>;
//# sourceMappingURL=import.d.ts.map