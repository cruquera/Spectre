import { z } from 'zod';
export declare const transactionTypeSchema: z.ZodEnum<["BUY", "SELL", "DIVIDEND", "INTEREST", "TRANSFER_IN", "TRANSFER_OUT"]>;
export declare const portfolioSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    baseCurrency: z.ZodString;
    strategyId: z.ZodNullable<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    id: string;
    name: string;
    baseCurrency: string;
    strategyId: string | null;
}, {
    id: string;
    name: string;
    baseCurrency: string;
    strategyId: string | null;
}>;
export declare const createPortfolioSchema: z.ZodObject<{
    name: z.ZodString;
    baseCurrency: z.ZodDefault<z.ZodString>;
    accountIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    name: string;
    baseCurrency: string;
    accountIds?: string[] | undefined;
}, {
    name: string;
    baseCurrency?: string | undefined;
    accountIds?: string[] | undefined;
}>;
export declare const createTransactionSchema: z.ZodObject<{
    accountId: z.ZodString;
    assetId: z.ZodString;
    type: z.ZodEnum<["BUY", "SELL", "DIVIDEND", "INTEREST", "TRANSFER_IN", "TRANSFER_OUT"]>;
    quantity: z.ZodNumber;
    unitPrice: z.ZodNumber;
    fees: z.ZodDefault<z.ZodNumber>;
    taxes: z.ZodDefault<z.ZodNumber>;
    tradeDate: z.ZodString;
    currency: z.ZodString;
    fxRate: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    type: "BUY" | "SELL" | "DIVIDEND" | "INTEREST" | "TRANSFER_IN" | "TRANSFER_OUT";
    currency: string;
    accountId: string;
    assetId: string;
    quantity: number;
    unitPrice: number;
    fees: number;
    taxes: number;
    tradeDate: string;
    fxRate?: number | undefined;
}, {
    type: "BUY" | "SELL" | "DIVIDEND" | "INTEREST" | "TRANSFER_IN" | "TRANSFER_OUT";
    currency: string;
    accountId: string;
    assetId: string;
    quantity: number;
    unitPrice: number;
    tradeDate: string;
    fees?: number | undefined;
    taxes?: number | undefined;
    fxRate?: number | undefined;
}>;
export declare const positionSchema: z.ZodObject<{
    id: z.ZodString;
    accountId: z.ZodString;
    assetId: z.ZodString;
    quantity: z.ZodNumber;
    averageCost: z.ZodNumber;
    costCurrency: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    accountId: string;
    assetId: string;
    quantity: number;
    averageCost: number;
    costCurrency: string;
}, {
    id: string;
    accountId: string;
    assetId: string;
    quantity: number;
    averageCost: number;
    costCurrency: string;
}>;
export type PortfolioDto = z.infer<typeof portfolioSchema>;
//# sourceMappingURL=portfolio.d.ts.map