"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createInstitutionSchema = exports.institutionSchema = exports.institutionTypeSchema = void 0;
const zod_1 = require("zod");
exports.institutionTypeSchema = zod_1.z.enum(['BANK', 'BROKER']);
exports.institutionSchema = zod_1.z.object({
    id: zod_1.z.string(),
    name: zod_1.z.string(),
    type: exports.institutionTypeSchema,
});
exports.createInstitutionSchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    type: exports.institutionTypeSchema,
});
//# sourceMappingURL=institutions.js.map