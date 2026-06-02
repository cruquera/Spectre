import { z } from 'zod';
export declare const quoteSourceSchema: z.ZodEnum<["MANUAL", "IMPORT", "BENCHMARK"]>;
export declare const createQuoteSchema: z.ZodObject<{
    assetId: z.ZodString;
    price: z.ZodNumber;
    currency: z.ZodString;
    asOf: z.ZodString;
    source: z.ZodEnum<["MANUAL", "IMPORT", "BENCHMARK"]>;
}, "strip", z.ZodTypeAny, {
    currency: string;
    assetId: string;
    source: "MANUAL" | "IMPORT" | "BENCHMARK";
    price: number;
    asOf: string;
}, {
    currency: string;
    assetId: string;
    source: "MANUAL" | "IMPORT" | "BENCHMARK";
    price: number;
    asOf: string;
}>;
export declare const exchangeRateSchema: z.ZodObject<{
    fromCurrency: z.ZodString;
    toCurrency: z.ZodString;
    rate: z.ZodNumber;
    asOf: z.ZodString;
    source: z.ZodEnum<["MANUAL", "IMPORT", "BENCHMARK"]>;
}, "strip", z.ZodTypeAny, {
    source: "MANUAL" | "IMPORT" | "BENCHMARK";
    asOf: string;
    fromCurrency: string;
    toCurrency: string;
    rate: number;
}, {
    source: "MANUAL" | "IMPORT" | "BENCHMARK";
    asOf: string;
    fromCurrency: string;
    toCurrency: string;
    rate: number;
}>;
//# sourceMappingURL=market-data.d.ts.map