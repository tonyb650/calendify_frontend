import { DEFAULT_EARLIEST_TIME, DEFAULT_LATEST_TIME } from "@/constants";
import z from "zod";

export const LoginSchema = z.object({
  email: z.email({message: "Email is required"}),
  password: z.string().min(1, {message: "Password is required"}),
})

// ! Add password strength validation
// TODO here
export const RegisterSchema = z.object({
  name: z.string().min(1, {message: "Name is required"}),
  email: z.email({message: "Email is required"}),
  password: z.string().min(8, {message: "Password must be at least 8 characters"}),
  earliest: z.number().min(0).max(47).default(DEFAULT_EARLIEST_TIME).optional(),
  latest: z.number().min(0).max(47).default(DEFAULT_LATEST_TIME).optional()
})