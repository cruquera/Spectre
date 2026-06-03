"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setAssetAllocationSchema = exports.setCategoryAllocationSchema = exports.allocationAnalysisSchema = exports.assetAllocationSchema = exports.categoryAllocationSchema = void 0;
const zod_1 = require("zod");
const assets_js_1 = require("./assets.js");
exports.categoryAllocationSchema = zod_1.z.object({
  category: assets_js_1.assetCategorySchema,
  deviation: zod_1.z.number(),
  needsRebalance: zod_1.z.boolean(),
  realPercent: zod_1.z.number(),
  targetPercent: zod_1.z.number().min(0).max(100)
});
exports.assetAllocationSchema = zod_1.z.object({
  assetId: zod_1.z.string(),
  deviation: zod_1.z.number(),
  message: zod_1.z.string(),
  needsRebalance: zod_1.z.boolean(),
  realPercent: zod_1.z.number(),
  symbol: zod_1.z.string(),
  targetPercent: zod_1.z.number()
});
exports.allocationAnalysisSchema = zod_1.z.object({
  assets: zod_1.z.array(exports.assetAllocationSchema),
  categories: zod_1.z.array(exports.categoryAllocationSchema),
  portfolioId: zod_1.z.string(),
  thresholdPercent: zod_1.z.number()
});
exports.setCategoryAllocationSchema = zod_1.z.object({
  category: assets_js_1.assetCategorySchema,
  portfolioId: zod_1.z.string(),
  targetPercent: zod_1.z.number().min(0).max(100)
});
exports.setAssetAllocationSchema = zod_1.z.object({
  assetId: zod_1.z.string(),
  portfolioId: zod_1.z.string(),
  targetPercent: zod_1.z.number().min(0).max(100)
});
//# sourceMappingURL=allocation.js.map