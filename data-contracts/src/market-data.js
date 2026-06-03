"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exchangeRateSchema = exports.createQuoteSchema = exports.quoteSourceSchema = void 0;
const zod_1 = require("zod");
exports.quoteSourceSchema = zod_1.z.enum(['MANUAL', 'IMPORT', 'BENCHMARK']);
exports.createQuoteSchema = zod_1.z.object({
  asOf: zod_1.z.string(),
  assetId: zod_1.z.string(),
  currency: zod_1.z.string().length(3),
  price: zod_1.z.number().positive(),
  source: exports.quoteSourceSchema
});
exports.exchangeRateSchema = zod_1.z.object({
  asOf: zod_1.z.string(),
  fromCurrency: zod_1.z.string().length(3),
  rate: zod_1.z.number().positive(),
  source: exports.quoteSourceSchema,
  toCurrency: zod_1.z.string().length(3)
});
//# sourceMappingURL=market-data.js.map