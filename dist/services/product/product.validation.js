"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productValidation = void 0;
const zod_1 = require("zod");
const createProductSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string({ message: "Title is required" }),
        description: zod_1.z.string().optional(),
        price: zod_1.z.number({ message: "Price is required" }).positive("Price must be positive"),
        stock: zod_1.z.number().int().nonnegative().optional(),
        status: zod_1.z.enum(["ACTIVE", "INACTIVE", "OUT_OF_STOCK"]).optional(),
        categoryId: zod_1.z.string({ message: "CategoryId is required" }),
    }),
});
const updateProductSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().optional(),
        description: zod_1.z.string().optional(),
        price: zod_1.z.number().positive().optional(),
        stock: zod_1.z.number().int().nonnegative().optional(),
        status: zod_1.z.enum(["ACTIVE", "INACTIVE", "OUT_OF_STOCK"]).optional(),
        categoryId: zod_1.z.string().optional(),
    }),
});
exports.productValidation = {
    createProductSchema,
    updateProductSchema,
};
