"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.positionSchema = exports.createTransactionSchema = exports.createPortfolioSchema = exports.portfolioSchema = exports.transactionTypeSchema = void 0;
const zod_1 = require("zod");
exports.transactionTypeSchema = zod_1.z.enum([
    'BUY',
    'SELL',
    'DIVIDEND',
    'INTEREST',
    'TRANSFER_IN',
    'TRANSFER_OUT',
]);
exports.portfolioSchema = zod_1.z.object({
  baseCurrency: zod_1.z.string(),
  id: zod_1.z.string(),
  name: zod_1.z.string(),
  strategyId: zod_1.z.string().nullable()
});
exports.createPortfolioSchema = zod_1.z.object({
  accountIds: zod_1.z.array(zod_1.z.string()).optional(),
  baseCurrency: zod_1.z.string().length(3).default('BRL'),
  name: zod_1.z.string().min(1)
});
exports.createTransactionSchema = zod_1.z.object({
  accountId: zod_1.z.string(),
  assetId: zod_1.z.string(),
  currency: zod_1.z.string().length(3),
  fees: zod_1.z.number().nonnegative().default(0),
  fxRate: zod_1.z.number().positive().optional(),
  quantity: zod_1.z.number().positive(),
  taxes: zod_1.z.number().nonnegative().default(0),
  tradeDate: zod_1.z.string(),
  type: exports.transactionTypeSchema,
  unitPrice: zod_1.z.number().nonnegative()
});
exports.positionSchema = zod_1.z.object({
  accountId: zod_1.z.string(),
  assetId: zod_1.z.string(),
  averageCost: zod_1.z.number(),
  costCurrency: zod_1.z.string(),
  id: zod_1.z.string(),
  quantity: zod_1.z.number()
});
//# sourceMappingURL=portfolio.js.map