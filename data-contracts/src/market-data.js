"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exchangeRateSchema = exports.createQuoteSchema = exports.quoteSourceSchema = void 0;
const zod_1 = require("zod");
exports.quoteSourceSchema = zod_1.z.enum(['MANUAL', 'IMPORT', 'BENCHMARK']);
exports.createQuoteSchema = zod_1.z.object({
    assetId: zod_1.z.string(),
    price: zod_1.z.number().positive(),
    currency: zod_1.z.string().length(3),
    asOf: zod_1.z.string(),
    source: exports.quoteSourceSchema,
});
exports.exchangeRateSchema = zod_1.z.object({
    fromCurrency: zod_1.z.string().length(3),
    toCurrency: zod_1.z.string().length(3),
    rate: zod_1.z.number().positive(),
    asOf: zod_1.z.string(),
    source: exports.quoteSourceSchema,
});
//# sourceMappingURL=market-data.js.map