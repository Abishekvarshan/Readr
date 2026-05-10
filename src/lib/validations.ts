import { z } from "zod";

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
});

export const signupSchema = loginSchema.extend({
  fullName: z.string().min(2),
});

export const bookSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3),
  author: z.string().min(2),
  description: z.string().min(20),
  category: z.string().min(2),
  condition: z.enum(["new", "like_new", "good", "fair", "acceptable"]),
  language: z.string().default("English"),
  price: z.coerce.number().positive(),
  stock: z.coerce.number().int().min(0),
  imageUrl: z.string().optional().default(""),
  sellerName: z.string().min(2),
  featured: z.coerce.boolean().optional().default(false),
  isbn: z.string().optional().default(""),
  publishedYear: z.coerce.number().int().optional(),
});

export const cartSchema = z.object({
  bookId: z.string().min(1),
  quantity: z.coerce.number().int().min(1).max(10),
});

export const checkoutSchema = z.object({
  customerName: z.string().min(2),
  customerEmail: z.email(),
  customerPhone: z.string().min(9),
  customerAddress: z.string().min(10),
});