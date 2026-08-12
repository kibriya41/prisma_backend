import { z } from "zod";

const registerSchema = z.object({
  body: z.object({
    name: z.string({ message: "Name is required" }),
    email: z.string({ message: "Email is required" }).email("Invalid email address"),
    password: z.string({ message: "Password is required" }).min(6, "Password must be at least 6 characters"),
  }),
});

const loginSchema = z.object({
  body: z.object({
    email: z.string({ message: "Email is required" }).email("Invalid email address"),
    password: z.string({ message: "Password is required" }),
  }),
});

export const authValidation = {
  registerSchema,
  loginSchema,
};
