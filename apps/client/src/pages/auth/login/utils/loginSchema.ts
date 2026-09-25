import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("Enter a valid email"),
  password: z.string().trim().min(1, "Enter a password"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
