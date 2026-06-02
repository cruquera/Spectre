"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setAssetAllocationSchema = exports.setCategoryAllocationSchema = exports.allocationAnalysisSchema = exports.assetAllocationSchema = exports.categoryAllocationSchema = void 0;
const zod_1 = require("zod");
const assets_js_1 = require("./assets.js");
exports.categoryAllocationSchema = zod_1.z.object({
    category: assets_js_1.assetCategorySchema,
    targetPercent: zod_1.z.number().min(0).max(100),
    realPercent: zod_1.z.number(),
    deviation: zod_1.z.number(),
    needsRebalance: zod_1.z.boolean(),
});
exports.assetAllocationSchema = zod_1.z.object({
    assetId: zod_1.z.string(),
    symbol: zod_1.z.string(),
    targetPercent: zod_1.z.number(),
    realPercent: zod_1.z.number(),
    deviation: zod_1.z.number(),
    message: zod_1.z.string(),
    needsRebalance: zod_1.z.boolean(),
});
exports.allocationAnalysisSchema = zod_1.z.object({
    portfolioId: zod_1.z.string(),
    thresholdPercent: zod_1.z.number(),
    categories: zod_1.z.array(exports.categoryAllocationSchema),
    assets: zod_1.z.array(exports.assetAllocationSchema),
});
exports.setCategoryAllocationSchema = zod_1.z.object({
    portfolioId: zod_1.z.string(),
    category: assets_js_1.assetCategorySchema,
    targetPercent: zod_1.z.number().min(0).max(100),
});
exports.setAssetAllocationSchema = zod_1.z.object({
    portfolioId: zod_1.z.string(),
    assetId: zod_1.z.string(),
    targetPercent: zod_1.z.number().min(0).max(100),
});
//# sourceMappingURL=allocation.js.map