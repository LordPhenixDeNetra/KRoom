"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roomSchema = void 0;
const zod_1 = require("zod");
exports.roomSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    name: zod_1.z.string().min(3),
    participants: zod_1.z.array(zod_1.z.string()),
});
