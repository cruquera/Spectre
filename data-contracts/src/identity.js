"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginRequestSchema = exports.createProfileRequestSchema = exports.profileSchema = void 0;
const zod_1 = require("zod");
exports.profileSchema = zod_1.z.object({
  displayName: zod_1.z.string(),
  id: zod_1.z.string(),
  lastLoginAt: zod_1.z.string().nullable(),
  slug: zod_1.z.string()
});
exports.createProfileRequestSchema = zod_1.z.object({
  displayName: zod_1.z.string().min(1).max(100),
  password: zod_1.z.string().min(4),
  slug: zod_1.z.string().regex(/^[a-z0-9-]+$/)
});
exports.loginRequestSchema = zod_1.z.object({
  password: zod_1.z.string().min(1),
  slug: zod_1.z.string()
});
//# sourceMappingURL=identity.js.map