import { z } from 'zod';
export declare const taxReportSchema: z.ZodObject<{
    id: z.ZodString;
    year: z.ZodNumber;
    reportType: z.ZodString;
    createdAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    year: number;
    reportType: string;
    createdAt: string;
}, {
    id: string;
    year: number;
    reportType: string;
    createdAt: string;
}>;
export declare const generateTaxPreviewSchema: z.ZodObject<{
    year: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    year: number;
}, {
    year: number;
}>;
//# sourceMappingURL=tax.d.ts.map