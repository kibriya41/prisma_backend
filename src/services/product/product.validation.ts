import { z } from "zod";

const createProductSchema = z.object({
  body: z.object({
    title: z.string({ message: "Title is required" }),
    description: z.string().optional(),
    price: z.number({ message: "Price is required" }).positive("Price must be positive"),
    stock: z.number().int().nonnegative().optional(),
    status: z.enum(["ACTIVE", "INACTIVE", "OUT_OF_STOCK"]).optional(),
    categoryId: z.string({ message: "CategoryId is required" }),
  }),
});

const updateProductSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    price: z.number().positive().optional(),
    stock: z.number().int().nonnegative().optional(),
    status: z.enum(["ACTIVE", "INACTIVE", "OUT_OF_STOCK"]).optional(),
    categoryId: z.string().optional(),
  }),
});

export const productValidation = {
  createProductSchema,
  updateProductSchema,
};
