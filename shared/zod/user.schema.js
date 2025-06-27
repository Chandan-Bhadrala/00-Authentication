import z from "zod";

export const userSchema = z
  .object({
    fullName: z.string().min(3, "Full name is required").required(),
    username: z
      .string()
      .min(6, "Username must be at least 6 characters")
      .required(),
    email: z.string().email().required(),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .required(),
    confirmPassword: z.string().required(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"], // This specifies where the error message will appear
  });
