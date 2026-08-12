import { z } from "zod";

const orderItemSchema = z.object({
  productId: z.string({ message: "ProductId is required" }),
  quantity: z
    .number({ message: "Quantity is required" })
    .int()
    .positive("Quantity must be positive"),
});

const createOrderSchema = z.object({
  body: z.object({
    items: z
      .array(orderItemSchema, { message: "Items array is required" })
      .min(1, "Order must contain at least one item"),
  }),
});

const updateOrderStatusSchema = z.object({
  body: z.object({
    status: z.enum(["PENDING", "PROCESSING", "COMPLETED", "CANCELLED"], {
      message: "Status is required",
    }),
  }),
});

export const orderValidation = {
  createOrderSchema,
  updateOrderStatusSchema,
};
