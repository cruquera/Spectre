"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.importOperationsCsvSchema = exports.importQuotesCsvSchema = void 0;
const zod_1 = require("zod");
exports.importQuotesCsvSchema = zod_1.z.object({
    csvContent: zod_1.z.string(),
});
exports.importOperationsCsvSchema = zod_1.z.object({
    accountId: zod_1.z.string(),
    csvContent: zod_1.z.string(),
});
//# sourceMappingURL=import.js.map