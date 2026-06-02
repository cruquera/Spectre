"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contributionSuggestionSchema = exports.simulateContributionSchema = exports.setMonthlyBlockSchema = exports.createInvestmentBlockSchema = exports.monthlyBlockScheduleSchema = exports.investmentBlockSchema = void 0;
const zod_1 = require("zod");
exports.investmentBlockSchema = zod_1.z.object({
    id: zod_1.z.string(),
    name: zod_1.z.string(),
    assetIds: zod_1.z.array(zod_1.z.string()),
});
exports.monthlyBlockScheduleSchema = zod_1.z.object({
    year: zod_1.z.number().int(),
    month: zod_1.z.number().int().min(1).max(12),
    blockId: zod_1.z.string(),
});
exports.createInvestmentBlockSchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    assetIds: zod_1.z.array(zod_1.z.string()).min(1),
});
exports.setMonthlyBlockSchema = zod_1.z.object({
    year: zod_1.z.number().int(),
    month: zod_1.z.number().int().min(1).max(12),
    blockId: zod_1.z.string(),
});
exports.simulateContributionSchema = zod_1.z.object({
    portfolioId: zod_1.z.string(),
    amount: zod_1.z.number().positive(),
    currency: zod_1.z.string().length(3),
    year: zod_1.z.number().int(),
    month: zod_1.z.number().int().min(1).max(12),
});
exports.contributionSuggestionSchema = zod_1.z.object({
    assetId: zod_1.z.string(),
    symbol: zod_1.z.string(),
    suggestedAmount: zod_1.z.number(),
    rationale: zod_1.z.string(),
});
//# sourceMappingURL=contribution.js.map