import rateLimit from "express-rate-limit";

// Signup-specific limiter
export const signupLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5,
  message: "Too many signup attempts, please try again after a minute.",
});

// Login-specific limiter
export const loginLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: "Too many login attempts, please wait and try again.",
});
