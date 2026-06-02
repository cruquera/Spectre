import { z } from 'zod';
export declare const assetCategorySchema: z.ZodEnum<["CRYPTO", "FIXED_INCOME", "VARIABLE_INCOME", "REAL_ESTATE"]>;
export declare const assetSchema: z.ZodObject<{
    id: z.ZodString;
    symbol: z.ZodString;
    name: z.ZodString;
    assetType: z.ZodString;
    category: z.ZodEnum<["CRYPTO", "FIXED_INCOME", "VARIABLE_INCOME", "REAL_ESTATE"]>;
    currency: z.ZodString;
}, "strip", z.ZodTypeAny, {
    symbol: string;
    id: string;
    name: string;
    currency: string;
    assetType: string;
    category: "CRYPTO" | "FIXED_INCOME" | "VARIABLE_INCOME" | "REAL_ESTATE";
}, {
    symbol: string;
    id: string;
    name: string;
    currency: string;
    assetType: string;
    category: "CRYPTO" | "FIXED_INCOME" | "VARIABLE_INCOME" | "REAL_ESTATE";
}>;
export declare const createAssetSchema: z.ZodObject<{
    symbol: z.ZodString;
    name: z.ZodString;
    assetType: z.ZodString;
    category: z.ZodEnum<["CRYPTO", "FIXED_INCOME", "VARIABLE_INCOME", "REAL_ESTATE"]>;
    currency: z.ZodString;
}, "strip", z.ZodTypeAny, {
    symbol: string;
    name: string;
    currency: string;
    assetType: string;
    category: "CRYPTO" | "FIXED_INCOME" | "VARIABLE_INCOME" | "REAL_ESTATE";
}, {
    symbol: string;
    name: string;
    currency: string;
    assetType: string;
    category: "CRYPTO" | "FIXED_INCOME" | "VARIABLE_INCOME" | "REAL_ESTATE";
}>;
export type AssetDto = z.infer<typeof assetSchema>;
//# sourceMappingURL=assets.d.ts.map