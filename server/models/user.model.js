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
      minlength: [6, "Username must be at least 6 characters"],
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
      required: true,
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
      expires: 0, // This will delete the whole document once date stored in the emailVerifyTokenExpiry is gt Date.now(). This way DB is not filled with the stale data of unverified user's documents.
      default: () => Date.now() + 0.5 * 60 * 60 * 1000, // Set default to 30 minutes from now. From the moment this user doc is created.
    },
    forgotPasswordVerifyToken: {
      type: String,
    },
    forgotPasswordTokenExpiry: {
      type: Date,
      default: () => Date.now() + 0.5 * 60 * 60 * 1000, // Set default to 30 minutes from now. From the moment this user doc is created.
    },
    // This marks when user can request another token resend.
    tokenResendCoolDownExpiry: {
      type: Date,
      default: null,
    },
    role: {
      type: String,
      enum: ["super admin", "admin", "user"],
      default: "user",
    },
    refreshToken: {
      type: String,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform(doc, ret) {
        delete ret.password;
        delete ret.refreshToken;
        delete ret.emailVerifyToken;
        delete ret.emailVerifyTokenExpiry;
        delete ret.forgotPasswordVerifyToken;
        delete ret.forgotPasswordTokenExpiry;
        delete ret.tokenResendCoolDownExpiry;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Hash user password & forgotPasswordVerifyToken. Pre-save event. Only if, password is modified/updated.
userSchema.pre("save", async function (next) {
  // Hash the password & forgotPasswordVerifyToken pre/before saving
  if (this.isModified("password")) {
    this.password = await bcryptjs.hash(this.password, 10);
  }

  // Hash emailVerifyTokenExpiry if modified
  if (
    this.isModified("emailVerifyToken") &&
    this.emailVerifyToken // This will check & stop code execution for token set to undefined.
  ) {
    this.emailVerifyToken = await bcryptjs.hash(this.emailVerifyToken, 10);
  }

  // Hash forgotPasswordVerifyToken if modified
  if (
    this.isModified("forgotPasswordVerifyToken") &&
    this.forgotPasswordVerifyToken // This will check & stop code execution for token set to undefined.
  ) {
    this.forgotPasswordVerifyToken = await bcryptjs.hash(
      this.forgotPasswordVerifyToken,
      10
    );
  }
  next(); // Pass control to the next middleware or save operation
});

// Creating a method on the user object for comparing user sent password with hashed password saved in the DB for the user.

// Example usage
// const isPasswordMatch = await user.isTokenMatch (password, "password");
// const isOTPMatch = await user.isTokenMatch (otp, "emailVerifyToken");
// const isForgotOTPMatch = await user.isTokenMatch (otp, "forgotPasswordVerifyToken");

userSchema.methods.isTokenMatch = async function (inputValue, tokenName) {
  const hashedValue = this[tokenName];
  if (!hashedValue) return false;

  return await bcryptjs.compare(inputValue, hashedValue);
};

/** 
 * If I've to use below way, then I've to create separate function for each bcrypt comparison.
// Compare plain password with the hashed password saved in DB
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcryptjs.compare(password, this.password);
};
*/

// This set method on "toJSON" event will remove/delete fields from the user object.

// doc: - full Mongoose document (with all methods).
// The original Mongoose document — it includes Mongoose instance methods, schema logic, virtual, etc.

// This will create user initials out of user Fullname.
userSchema.virtual("initials").get(function () {
  return this.fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
});

/** Below code is now added as an option in the userSchema above
 * 
// ret: - plain JavaScript object (to be sent in JSON). 
// The returned plain object — this is the one that gets converted to JSON and sent via res.json()
userSchema.set("toJSON", {
  transform: function (doc, ret) {
    delete ret.password;
    delete ret.refreshToken;
    delete ret.emailVerifyToken;
    delete ret.forgotPasswordVerifyToken;
    delete ret.__v;
    return ret;
  },
});
 */
export const User = mongoose.model("User", userSchema);
