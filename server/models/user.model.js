import mongoose from "mongoose";
import bcryptjs from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    username: {
      type: String,
      min: [6, "Username must be at least 6 characters"],
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },

    avatarURL: {
      type: String,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    emailVerifyToken: {
      type: String,
    },
    emailVerifyTokenExpiry: {
      type: Date,
    },
    role: {
      enum: ["super admin", "admin", "user"],
      default: "user",
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  // Hash the password before saving
  if (this.isModified("password")) {
    this.password = await bcryptjs.hash(this.password, 10);
  }
  next(); // Pass control to the next middleware or save operation
});

export const User = mongoose.model("User", userSchema);
