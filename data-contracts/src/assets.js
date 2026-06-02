"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAssetSchema = exports.assetSchema = exports.assetCategorySchema = void 0;
const zod_1 = require("zod");
exports.assetCategorySchema = zod_1.z.enum([
    'CRYPTO',
    'FIXED_INCOME',
    'VARIABLE_INCOME',
    'REAL_ESTATE',
]);
exports.assetSchema = zod_1.z.object({
    id: zod_1.z.string(),
    symbol: zod_1.z.string(),
    name: zod_1.z.string(),
    assetType: zod_1.z.string(),
    category: exports.assetCategorySchema,
    currency: zod_1.z.string(),
});
exports.createAssetSchema = zod_1.z.object({
    symbol: zod_1.z.string().min(1),
    name: zod_1.z.string().min(1),
    assetType: zod_1.z.string().min(1),
    category: exports.assetCategorySchema,
    currency: zod_1.z.string().length(3),
});
//# sourceMappingURL=assets.js.map