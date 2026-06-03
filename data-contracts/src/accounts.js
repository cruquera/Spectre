"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAccountSchema = exports.accountSchema = void 0;
const zod_1 = require("zod");
exports.accountSchema = zod_1.z.object({
  currency: zod_1.z.string(),
  id: zod_1.z.string(),
  institutionId: zod_1.z.string(),
  name: zod_1.z.string()
});
exports.createAccountSchema = zod_1.z.object({
  currency: zod_1.z.string().length(3),
  institutionId: zod_1.z.string(),
  name: zod_1.z.string().min(1)
});
//# sourceMappingURL=accounts.js.map