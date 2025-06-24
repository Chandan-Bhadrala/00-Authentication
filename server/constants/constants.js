// HTTPs cookie options
export const CookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict", // Prevents CSRF in most browsers
};

// constants.js
export const EMAIL_TOKEN_EXPIRY_MS = Date.now() + 30 * 60 * 1000;
