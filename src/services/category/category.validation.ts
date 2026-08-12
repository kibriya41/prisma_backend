import { z } from "zod";

const createCategorySchema = z.object({
  body: z.object({
    name: z.string({ message: "Name is required" }),
    slug: z.string().optional(),
  }),
});

const updateCategorySchema = z.object({
  body: z.object({
    name: z.string().optional(),
    slug: z.string().optional(),
  }),
});

export const categoryValidation = {
  createCategorySchema,
  updateCategorySchema,
};
