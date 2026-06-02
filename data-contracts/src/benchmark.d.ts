import { z } from 'zod';
export declare const benchmarkRequestSchema: z.ZodObject<{
    ticker: z.ZodString;
    period: z.ZodEnum<["1M", "3M", "6M", "1Y", "5Y", "MAX"]>;
    benchmarkType: z.ZodString;
    source: z.ZodOptional<z.ZodEnum<["YAHOO", "BCB", "IBGE"]>>;
}, "strip", z.ZodTypeAny, {
    ticker: string;
    period: "1M" | "3M" | "6M" | "1Y" | "5Y" | "MAX";
    benchmarkType: string;
    source?: "YAHOO" | "BCB" | "IBGE" | undefined;
}, {
    ticker: string;
    period: "1M" | "3M" | "6M" | "1Y" | "5Y" | "MAX";
    benchmarkType: string;
    source?: "YAHOO" | "BCB" | "IBGE" | undefined;
}>;
export declare const benchmarkDataPointSchema: z.ZodObject<{
    date: z.ZodString;
    value: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    value: number;
    date: string;
}, {
    value: number;
    date: string;
}>;
export declare const benchmarkSeriesSchema: z.ZodObject<{
    symbol: z.ZodString;
    source: z.ZodString;
    benchmarkType: z.ZodString;
    dataPoints: z.ZodArray<z.ZodObject<{
        date: z.ZodString;
        value: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        value: number;
        date: string;
    }, {
        value: number;
        date: string;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    symbol: string;
    benchmarkType: string;
    source: string;
    dataPoints: {
        value: number;
        date: string;
    }[];
}, {
    symbol: string;
    benchmarkType: string;
    source: string;
    dataPoints: {
        value: number;
        date: string;
    }[];
}>;
export type BenchmarkRequest = z.infer<typeof benchmarkRequestSchema>;
//# sourceMappingURL=benchmark.d.ts.map