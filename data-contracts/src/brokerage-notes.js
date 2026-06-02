"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerBrokerageNoteSchema = exports.brokerageNoteSchema = void 0;
const zod_1 = require("zod");
exports.brokerageNoteSchema = zod_1.z.object({
    id: zod_1.z.string(),
    hashSha256: zod_1.z.string(),
    relativePath: zod_1.z.string(),
    brokerId: zod_1.z.string(),
    noteDate: zod_1.z.string(),
    parsedStatus: zod_1.z.string(),
});
exports.registerBrokerageNoteSchema = zod_1.z.object({
    brokerId: zod_1.z.string(),
    noteDate: zod_1.z.string(),
    fileName: zod_1.z.string(),
    base64Content: zod_1.z.string(),
});
//# sourceMappingURL=brokerage-notes.js.map