"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contributionSuggestionSchema = exports.simulateContributionSchema = exports.setMonthlyBlockSchema = exports.createInvestmentBlockSchema = exports.monthlyBlockScheduleSchema = exports.investmentBlockSchema = void 0;
const zod_1 = require("zod");
exports.investmentBlockSchema = zod_1.z.object({
  assetIds: zod_1.z.array(zod_1.z.string()),
  id: zod_1.z.string(),
  name: zod_1.z.string()
});
exports.monthlyBlockScheduleSchema = zod_1.z.object({
  blockId: zod_1.z.string(),
  month: zod_1.z.number().int().min(1).max(12),
  year: zod_1.z.number().int()
});
exports.createInvestmentBlockSchema = zod_1.z.object({
  assetIds: zod_1.z.array(zod_1.z.string()).min(1),
  name: zod_1.z.string().min(1)
});
exports.setMonthlyBlockSchema = zod_1.z.object({
  blockId: zod_1.z.string(),
  month: zod_1.z.number().int().min(1).max(12),
  year: zod_1.z.number().int()
});
exports.simulateContributionSchema = zod_1.z.object({
  amount: zod_1.z.number().positive(),
  currency: zod_1.z.string().length(3),
  month: zod_1.z.number().int().min(1).max(12),
  portfolioId: zod_1.z.string(),
  year: zod_1.z.number().int()
});
exports.contributionSuggestionSchema = zod_1.z.object({
  assetId: zod_1.z.string(),
  rationale: zod_1.z.string(),
  suggestedAmount: zod_1.z.number(),
  symbol: zod_1.z.string()
});
//# sourceMappingURL=contribution.js.map