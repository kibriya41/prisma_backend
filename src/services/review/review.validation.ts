import { z } from "zod";

const createReviewSchema = z.object({
  body: z.object({
    rating: z
      .number({ message: "Rating is required" })
      .min(1, "Rating must be at least 1")
      .max(5, "Rating cannot exceed 5"),
    comment: z.string().optional(),
    productId: z.string({ message: "ProductId is required" }),
  }),
});

export const reviewValidation = {
  createReviewSchema,
};
