"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.captureSnapshotSchema = exports.patrimonySnapshotSchema = void 0;
const zod_1 = require("zod");
exports.patrimonySnapshotSchema = zod_1.z.object({
  capturedAt: zod_1.z.string(),
  currency: zod_1.z.string(),
  id: zod_1.z.string(),
  portfolioId: zod_1.z.string(),
  totalValue: zod_1.z.number()
});
exports.captureSnapshotSchema = zod_1.z.object({
    portfolioId: zod_1.z.string(),
});
//# sourceMappingURL=patrimony.js.map