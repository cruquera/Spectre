"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTaxPreviewSchema = exports.taxReportSchema = void 0;
const zod_1 = require("zod");
exports.taxReportSchema = zod_1.z.object({
  createdAt: zod_1.z.string(),
  id: zod_1.z.string(),
  reportType: zod_1.z.string(),
  year: zod_1.z.number().int()
});
exports.generateTaxPreviewSchema = zod_1.z.object({
    year: zod_1.z.number().int(),
});
//# sourceMappingURL=tax.js.map