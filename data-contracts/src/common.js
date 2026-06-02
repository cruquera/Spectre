"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.healthcheckResponseSchema = exports.ipcResultSchema = void 0;
const zod_1 = require("zod");
const ipcResultSchema = (dataSchema) => zod_1.z.discriminatedUnion('success', [
    zod_1.z.object({ success: zod_1.z.literal(true), data: dataSchema }),
    zod_1.z.object({
        success: zod_1.z.literal(false),
        error: zod_1.z.object({ code: zod_1.z.string(), message: zod_1.z.string() }),
    }),
]);
exports.ipcResultSchema = ipcResultSchema;
exports.healthcheckResponseSchema = zod_1.z.object({
    status: zod_1.z.literal('ok'),
    version: zod_1.z.string(),
    timestamp: zod_1.z.string(),
});
//# sourceMappingURL=common.js.map