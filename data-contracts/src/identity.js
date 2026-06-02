"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginRequestSchema = exports.createProfileRequestSchema = exports.profileSchema = void 0;
const zod_1 = require("zod");
exports.profileSchema = zod_1.z.object({
    id: zod_1.z.string(),
    displayName: zod_1.z.string(),
    slug: zod_1.z.string(),
    lastLoginAt: zod_1.z.string().nullable(),
});
exports.createProfileRequestSchema = zod_1.z.object({
    displayName: zod_1.z.string().min(1).max(100),
    slug: zod_1.z.string().regex(/^[a-z0-9-]+$/),
    password: zod_1.z.string().min(4),
});
exports.loginRequestSchema = zod_1.z.object({
    slug: zod_1.z.string(),
    password: zod_1.z.string().min(1),
});
//# sourceMappingURL=identity.js.map