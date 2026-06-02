"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.benchmarkSeriesSchema = exports.benchmarkDataPointSchema = exports.benchmarkRequestSchema = void 0;
const zod_1 = require("zod");
exports.benchmarkRequestSchema = zod_1.z.object({
    ticker: zod_1.z.string().min(1),
    period: zod_1.z.enum(['1M', '3M', '6M', '1Y', '5Y', 'MAX']),
    benchmarkType: zod_1.z.string(),
    source: zod_1.z.enum(['YAHOO', 'BCB', 'IBGE']).optional(),
});
exports.benchmarkDataPointSchema = zod_1.z.object({
    date: zod_1.z.string(),
    value: zod_1.z.number(),
});
exports.benchmarkSeriesSchema = zod_1.z.object({
    symbol: zod_1.z.string(),
    source: zod_1.z.string(),
    benchmarkType: zod_1.z.string(),
    dataPoints: zod_1.z.array(exports.benchmarkDataPointSchema),
});
//# sourceMappingURL=benchmark.js.map