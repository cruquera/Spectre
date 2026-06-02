import { z } from 'zod';
export declare const brokerageNoteSchema: z.ZodObject<{
    id: z.ZodString;
    hashSha256: z.ZodString;
    relativePath: z.ZodString;
    brokerId: z.ZodString;
    noteDate: z.ZodString;
    parsedStatus: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    hashSha256: string;
    relativePath: string;
    brokerId: string;
    noteDate: string;
    parsedStatus: string;
}, {
    id: string;
    hashSha256: string;
    relativePath: string;
    brokerId: string;
    noteDate: string;
    parsedStatus: string;
}>;
export declare const registerBrokerageNoteSchema: z.ZodObject<{
    brokerId: z.ZodString;
    noteDate: z.ZodString;
    fileName: z.ZodString;
    base64Content: z.ZodString;
}, "strip", z.ZodTypeAny, {
    brokerId: string;
    noteDate: string;
    fileName: string;
    base64Content: string;
}, {
    brokerId: string;
    noteDate: string;
    fileName: string;
    base64Content: string;
}>;
//# sourceMappingURL=brokerage-notes.d.ts.map