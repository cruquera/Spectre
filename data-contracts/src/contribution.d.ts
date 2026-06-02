import { z } from 'zod';
export declare const investmentBlockSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    assetIds: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    id: string;
    name: string;
    assetIds: string[];
}, {
    id: string;
    name: string;
    assetIds: string[];
}>;
export declare const monthlyBlockScheduleSchema: z.ZodObject<{
    year: z.ZodNumber;
    month: z.ZodNumber;
    blockId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    year: number;
    month: number;
    blockId: string;
}, {
    year: number;
    month: number;
    blockId: string;
}>;
export declare const createInvestmentBlockSchema: z.ZodObject<{
    name: z.ZodString;
    assetIds: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    name: string;
    assetIds: string[];
}, {
    name: string;
    assetIds: string[];
}>;
export declare const setMonthlyBlockSchema: z.ZodObject<{
    year: z.ZodNumber;
    month: z.ZodNumber;
    blockId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    year: number;
    month: number;
    blockId: string;
}, {
    year: number;
    month: number;
    blockId: string;
}>;
export declare const simulateContributionSchema: z.ZodObject<{
    portfolioId: z.ZodString;
    amount: z.ZodNumber;
    currency: z.ZodString;
    year: z.ZodNumber;
    month: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    currency: string;
    portfolioId: string;
    year: number;
    month: number;
    amount: number;
}, {
    currency: string;
    portfolioId: string;
    year: number;
    month: number;
    amount: number;
}>;
export declare const contributionSuggestionSchema: z.ZodObject<{
    assetId: z.ZodString;
    symbol: z.ZodString;
    suggestedAmount: z.ZodNumber;
    rationale: z.ZodString;
}, "strip", z.ZodTypeAny, {
    symbol: string;
    assetId: string;
    suggestedAmount: number;
    rationale: string;
}, {
    symbol: string;
    assetId: string;
    suggestedAmount: number;
    rationale: string;
}>;
export type ContributionSuggestionDto = z.infer<typeof contributionSuggestionSchema>;
//# sourceMappingURL=contribution.d.ts.map