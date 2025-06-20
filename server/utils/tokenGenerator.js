import crypto from "crypto";

/**
 * Generates a cryptographically secure 6-digit OTP.
 * @returns {string} 6-digit OTP (e.g., "024891")
 */
export const generateOTP = (otpDigits = 6) => {
  const buffer = crypto.randomBytes(3); // 3 bytes = 24 bits

  const token = buffer.readUIntBE(0, 3) % 10 ** otpDigits;
  // % 1000000 ensures the number stays within 6 digits.

  return token.toString().padStart(otpDigits, "0");
  // padStart(6, "0") ensures it's always 6 digits (even if token is like 4521 → 004521).
};

/**
 * Generates a cryptographically secure random token (hex string).
 * @param {number} length - Number of bytes. Default is 32 (64 hex chars).
 * @returns {string} Token string
 */
export const generateToken = (length = 32) => {
  return crypto.randomBytes(length).toString("hex");
};

/**
 * Generates a UUID v4 using crypto.
 * @returns {string} UUID v4 string
 */
export const generateUUID = () => {
  const bytes = crypto.randomBytes(16);
  // Per RFC 4122 §4.4
  bytes[6] = (bytes[6] & 0x0f) | 0x40; // Version 4
  bytes[8] = (bytes[8] & 0x3f) | 0x80; // Variant 10

  const hex = bytes.toString("hex");
  return (
    hex.substring(0, 8) +
    "-" +
    hex.substring(8, 12) +
    "-" +
    hex.substring(12, 16) +
    "-" +
    hex.substring(16, 20) +
    "-" +
    hex.substring(20)
  );
};

/**✅ Example Usage
import { generateOTP, generateToken, generateUUID } from "./utils/tokenGenerator.js";

console.log("OTP:", generateOTP());
// e.g., "042183"

console.log("Token:", generateToken(16));
// e.g., "a48fcd1e..."

console.log("UUID:", generateUUID());
// e.g., "65de3310-5f2d-4a21-8f03-23d1591dfe92"
 */
