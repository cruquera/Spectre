"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerDocumentSchema = void 0;
const zod_1 = require("zod");
exports.registerDocumentSchema = zod_1.z.object({
  base64Content: zod_1.z.string(),
  documentDate: zod_1.z.string(),
  documentType: zod_1.z.string(),
  fileName: zod_1.z.string()
});
//# sourceMappingURL=documents.js.map