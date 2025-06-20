import { v2 as cloudinary } from "cloudinary";
import fs from "fs/promises";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config({ path: "./.env" });

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Call this function from any file with the file local path to upload the file to cloudinary.

/**
 * Uploads a local file to Cloudinary and deletes it locally afterward.
 * @param {string} localFilePath - Path to the file stored temporarily on server.
 * @returns {object|null} Cloudinary upload result or null on failure.
 */

export const uploadToCloudinary = async function (localFilePath) {
  try {
    // Upload an image
    const uploadResult = await cloudinary.uploader.upload(localFilePath, {
      folder: "avatars",
      transformation: [{ width: 300, height: 300, crop: "fill" }],
    });

    // Sometimes, fs node module may fail to delete/unlink the file due permission or no file availability reason or due to any other reason. Thus, it is better to wrap fs unlink in its own try catch block to safe-guard the code.
    try {
      // After successful upload to cloudinary delete the file from the server.
      await fs.unlink(localFilePath); // Safe & async
    } catch (err) {
      console.log("⚠️ Failed to delete local file:", err);
    }
    return uploadResult;
  } catch (error) {
    console.log(error, "Failed to upload file to cloudinary");

    // Even after failing to upload to cloudinary delete the file from the server.
    try {
      await fs.unlink(localFilePath);
    } catch (err) {
      console.log("⚠️ Failed to delete local file:", err);
    }
    return null;
  }
};

// fs unlinkSync will block the server-thread till the unlinkSync happens. Thus import fs from fs/promise. And use fs unlink now with await. This will free up the server-thread/event-loop for other tasks. And will return the promise later. However, further current context code execution will not happen due to await keyword.
