"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.benchmarkSeriesSchema = exports.benchmarkDataPointSchema = exports.benchmarkRequestSchema = void 0;
const zod_1 = require("zod");
exports.benchmarkRequestSchema = zod_1.z.object({
  benchmarkType: zod_1.z.string(),
  period: zod_1.z.enum(['1M', '3M', '6M', '1Y', '5Y', 'MAX']),
  source: zod_1.z.enum(['YAHOO', 'BCB', 'IBGE']).optional(),
  ticker: zod_1.z.string().min(1)
});
exports.benchmarkDataPointSchema = zod_1.z.object({
    date: zod_1.z.string(),
    value: zod_1.z.number(),
});
exports.benchmarkSeriesSchema = zod_1.z.object({
  benchmarkType: zod_1.z.string(),
  dataPoints: zod_1.z.array(exports.benchmarkDataPointSchema),
  source: zod_1.z.string(),
  symbol: zod_1.z.string()
});
//# sourceMappingURL=benchmark.js.map