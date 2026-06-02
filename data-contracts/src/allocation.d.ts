import { z } from 'zod';
export declare const categoryAllocationSchema: z.ZodObject<{
    category: z.ZodEnum<["CRYPTO", "FIXED_INCOME", "VARIABLE_INCOME", "REAL_ESTATE"]>;
    targetPercent: z.ZodNumber;
    realPercent: z.ZodNumber;
    deviation: z.ZodNumber;
    needsRebalance: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    category: "CRYPTO" | "FIXED_INCOME" | "VARIABLE_INCOME" | "REAL_ESTATE";
    targetPercent: number;
    realPercent: number;
    deviation: number;
    needsRebalance: boolean;
}, {
    category: "CRYPTO" | "FIXED_INCOME" | "VARIABLE_INCOME" | "REAL_ESTATE";
    targetPercent: number;
    realPercent: number;
    deviation: number;
    needsRebalance: boolean;
}>;
export declare const assetAllocationSchema: z.ZodObject<{
    assetId: z.ZodString;
    symbol: z.ZodString;
    targetPercent: z.ZodNumber;
    realPercent: z.ZodNumber;
    deviation: z.ZodNumber;
    message: z.ZodString;
    needsRebalance: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    symbol: string;
    message: string;
    assetId: string;
    targetPercent: number;
    realPercent: number;
    deviation: number;
    needsRebalance: boolean;
}, {
    symbol: string;
    message: string;
    assetId: string;
    targetPercent: number;
    realPercent: number;
    deviation: number;
    needsRebalance: boolean;
}>;
export declare const allocationAnalysisSchema: z.ZodObject<{
    portfolioId: z.ZodString;
    thresholdPercent: z.ZodNumber;
    categories: z.ZodArray<z.ZodObject<{
        category: z.ZodEnum<["CRYPTO", "FIXED_INCOME", "VARIABLE_INCOME", "REAL_ESTATE"]>;
        targetPercent: z.ZodNumber;
        realPercent: z.ZodNumber;
        deviation: z.ZodNumber;
        needsRebalance: z.ZodBoolean;
    }, "strip", z.ZodTypeAny, {
        category: "CRYPTO" | "FIXED_INCOME" | "VARIABLE_INCOME" | "REAL_ESTATE";
        targetPercent: number;
        realPercent: number;
        deviation: number;
        needsRebalance: boolean;
    }, {
        category: "CRYPTO" | "FIXED_INCOME" | "VARIABLE_INCOME" | "REAL_ESTATE";
        targetPercent: number;
        realPercent: number;
        deviation: number;
        needsRebalance: boolean;
    }>, "many">;
    assets: z.ZodArray<z.ZodObject<{
        assetId: z.ZodString;
        symbol: z.ZodString;
        targetPercent: z.ZodNumber;
        realPercent: z.ZodNumber;
        deviation: z.ZodNumber;
        message: z.ZodString;
        needsRebalance: z.ZodBoolean;
    }, "strip", z.ZodTypeAny, {
        symbol: string;
        message: string;
        assetId: string;
        targetPercent: number;
        realPercent: number;
        deviation: number;
        needsRebalance: boolean;
    }, {
        symbol: string;
        message: string;
        assetId: string;
        targetPercent: number;
        realPercent: number;
        deviation: number;
        needsRebalance: boolean;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    portfolioId: string;
    thresholdPercent: number;
    categories: {
        category: "CRYPTO" | "FIXED_INCOME" | "VARIABLE_INCOME" | "REAL_ESTATE";
        targetPercent: number;
        realPercent: number;
        deviation: number;
        needsRebalance: boolean;
    }[];
    assets: {
        symbol: string;
        message: string;
        assetId: string;
        targetPercent: number;
        realPercent: number;
        deviation: number;
        needsRebalance: boolean;
    }[];
}, {
    portfolioId: string;
    thresholdPercent: number;
    categories: {
        category: "CRYPTO" | "FIXED_INCOME" | "VARIABLE_INCOME" | "REAL_ESTATE";
        targetPercent: number;
        realPercent: number;
        deviation: number;
        needsRebalance: boolean;
    }[];
    assets: {
        symbol: string;
        message: string;
        assetId: string;
        targetPercent: number;
        realPercent: number;
        deviation: number;
        needsRebalance: boolean;
    }[];
}>;
export declare const setCategoryAllocationSchema: z.ZodObject<{
    portfolioId: z.ZodString;
    category: z.ZodEnum<["CRYPTO", "FIXED_INCOME", "VARIABLE_INCOME", "REAL_ESTATE"]>;
    targetPercent: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    category: "CRYPTO" | "FIXED_INCOME" | "VARIABLE_INCOME" | "REAL_ESTATE";
    targetPercent: number;
    portfolioId: string;
}, {
    category: "CRYPTO" | "FIXED_INCOME" | "VARIABLE_INCOME" | "REAL_ESTATE";
    targetPercent: number;
    portfolioId: string;
}>;
export declare const setAssetAllocationSchema: z.ZodObject<{
    portfolioId: z.ZodString;
    assetId: z.ZodString;
    targetPercent: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    assetId: string;
    targetPercent: number;
    portfolioId: string;
}, {
    assetId: string;
    targetPercent: number;
    portfolioId: string;
}>;
export type AllocationAnalysisDto = z.infer<typeof allocationAnalysisSchema>;
//# sourceMappingURL=allocation.d.ts.map