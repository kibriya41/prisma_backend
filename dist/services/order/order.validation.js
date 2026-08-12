"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderValidation = void 0;
const zod_1 = require("zod");
const orderItemSchema = zod_1.z.object({
    productId: zod_1.z.string({ message: "ProductId is required" }),
    quantity: zod_1.z
        .number({ message: "Quantity is required" })
        .int()
        .positive("Quantity must be positive"),
});
const createOrderSchema = zod_1.z.object({
    body: zod_1.z.object({
        items: zod_1.z
            .array(orderItemSchema, { message: "Items array is required" })
            .min(1, "Order must contain at least one item"),
    }),
});
const updateOrderStatusSchema = zod_1.z.object({
    body: zod_1.z.object({
        status: zod_1.z.enum(["PENDING", "PROCESSING", "COMPLETED", "CANCELLED"], {
            message: "Status is required",
        }),
    }),
});
exports.orderValidation = {
    createOrderSchema,
    updateOrderStatusSchema,
};
