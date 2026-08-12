"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authValidation = void 0;
const zod_1 = require("zod");
const registerSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({ message: "Name is required" }),
        email: zod_1.z.string({ message: "Email is required" }).email("Invalid email address"),
        password: zod_1.z.string({ message: "Password is required" }).min(6, "Password must be at least 6 characters"),
    }),
});
const loginSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string({ message: "Email is required" }).email("Invalid email address"),
        password: zod_1.z.string({ message: "Password is required" }),
    }),
});
exports.authValidation = {
    registerSchema,
    loginSchema,
};
