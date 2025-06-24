import rateLimit from "express-rate-limit";

// 1. Signup-specific limiter
export const signupLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5,
  message: "Too many signup attempts, please try again after a minute.",
});

// 2. Login-specific limiter
export const loginLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: "Too many login attempts, please wait and try again.",
});

// 3a. OTP-specific limiter (Limits specific Ip address only)
export const otpResendLimiter = rateLimit({
  windowMs: 2 * 60 * 1000, // 2 minutes
  max: 1, // Limit each IP to 1 request per windowMs
  message: {
    statusCode: 429,
    message: "Please wait 2 minutes before requesting a new OTP.",
  },
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false,
});

/**
🧠 Why This Works Well
express-rate-limit stores request counts in memory by default — no Redis needed.

keyGenerator ensures rate limiting per unique userId.

Graceful fallback to req.ip if token is invalid (optional but safe).

Clean and fast for apps with <10k active users.
 */

// 3b. OTP-specific limiter (Limits specific userId, if not available. Then, Ip address as a fallback option.)
export const userBasedOtpLimiter = rateLimit({
  windowMs: 2 * 60 * 1000, // 2 minutes
  max: 1, // Only 1 request per 2 minutes per user
  message: {
    statusCode: 429,
    message: "Too many OTP requests. Please wait 2 minutes.",
  },
  keyGenerator: (req, res) => {
    // Use userId from verified token, fallback to IP (in case of failure)
    return req.userId || req.ip;
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/** 
🧠 Why This Works
It ties request frequency to the email address directly.

Helps throttle abuse even for unauthenticated users (like sign-up flow).

Requires no token decoding.
 */
// 3c. OTP-specific limiter (Limits specific email, if not available. Then, Ip address as a fallback option.)
export const emailBasedOtpLimiter = rateLimit({
  windowMs: 2 * 60 * 1000, // 2 minutes
  max: 1, // 1 request per 2 mins per email
  message: {
    statusCode: 429,
    message:
      "Too many OTP requests. Please wait 2 minutes before trying again.",
  },
  keyGenerator: (req, res) => {
    // Return the email from the request body or fallback to IP
    return req.body.email?.toLowerCase() || req.ip;
  },
  standardHeaders: true,
  legacyHeaders: false,
});
