import { z } from 'zod';
export declare const registerDocumentSchema: z.ZodObject<{
    documentType: z.ZodString;
    documentDate: z.ZodString;
    fileName: z.ZodString;
    base64Content: z.ZodString;
}, "strip", z.ZodTypeAny, {
    fileName: string;
    base64Content: string;
    documentType: string;
    documentDate: string;
}, {
    fileName: string;
    base64Content: string;
    documentType: string;
    documentDate: string;
}>;
//# sourceMappingURL=documents.d.ts.map