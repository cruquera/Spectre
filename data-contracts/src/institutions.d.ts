import { z } from 'zod';
export declare const institutionTypeSchema: z.ZodEnum<["BANK", "BROKER"]>;
export declare const institutionSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    type: z.ZodEnum<["BANK", "BROKER"]>;
}, "strip", z.ZodTypeAny, {
    type: "BANK" | "BROKER";
    id: string;
    name: string;
}, {
    type: "BANK" | "BROKER";
    id: string;
    name: string;
}>;
export declare const createInstitutionSchema: z.ZodObject<{
    name: z.ZodString;
    type: z.ZodEnum<["BANK", "BROKER"]>;
}, "strip", z.ZodTypeAny, {
    type: "BANK" | "BROKER";
    name: string;
}, {
    type: "BANK" | "BROKER";
    name: string;
}>;
export type InstitutionDto = z.infer<typeof institutionSchema>;
//# sourceMappingURL=institutions.d.ts.map