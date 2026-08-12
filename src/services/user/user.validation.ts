import { z } from "zod";

const updateUserSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    role: z.enum(["ADMIN", "USER"]).optional(),
  }),
});

export const userValidation = {
  updateUserSchema,
};
