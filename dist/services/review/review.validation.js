"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewValidation = void 0;
const zod_1 = require("zod");
const createReviewSchema = zod_1.z.object({
    body: zod_1.z.object({
        rating: zod_1.z
            .number({ message: "Rating is required" })
            .min(1, "Rating must be at least 1")
            .max(5, "Rating cannot exceed 5"),
        comment: zod_1.z.string().optional(),
        productId: zod_1.z.string({ message: "ProductId is required" }),
    }),
});
exports.reviewValidation = {
    createReviewSchema,
};
