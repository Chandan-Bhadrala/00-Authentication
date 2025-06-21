import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(process.env.MONGODB_URI);

    const indexes = await mongoose.connection.db.collection("users").indexes();
    const hasTTLIndex = indexes.some(
      (idx) => idx.key.emailVerifyTokenExpiry && idx.expireAfterSeconds === 0
    );

    if (!hasTTLIndex) {
      await mongoose.connection.db
        .collection("users")
        .createIndex({ emailVerifyTokenExpiry: 1 }, { expireAfterSeconds: 0 });
    }
    console.log(
      `\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log("MONGODB connection error", error);
    process.exit(1);
  }
};

export default connectDB;
