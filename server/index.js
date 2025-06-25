import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express, { urlencoded } from "express";
import helmet from "helmet";
import connectDB from "./db/dbConnect.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import userRouter from "./routes/auth.route.js";
import { globalLimiter } from "./middleware/globalRateLimiter.middleware.js";

// Load environment variables from .env file
dotenv.config({ path: "./.env" });

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 8080;

// -----------Default Middlewares starts here----------- //
app.use(express.json());
app.use(cookieParser());
app.use(
  urlencoded({
    extended: true, // allows rich objects and arrays to be encoded
    inflate: true, // allows compressed bodies to be inflated
    limit: "1mb", // limits the body size
    parameterLimit: 5000, // limits the number of parameters
    type: "application/x-www-form-urlencoded", // accepts only form-urlencoded type
  })
);

app.use(globalLimiter); // Apply to all incoming requests
// Middleware to enable CORS (Cross-Origin Resource Sharing)
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "DELETE", "PUT"], // allowed HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], // allowed headers
  })
);
app.use(helmet());
// -----------Default Middlewares ends here----------- //

// routes configuration
app.use("/api/v1/user", userRouter);

// Health check route
app.get("/api/v1/ping", (req, res) => {
  res.status(200).json({ success: true, message: "Server is healthy ✅" });
});

// after all app.use() routes, using Global Error Handler.
app.use(errorHandler);

// 🛡️ Global handler for uncaught exceptions (should be registered at top).
// Below code gets executed when synchronous code exception is thrown & not get caught by any try-catch block.
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception 💥", err);
  process.exit(1);
});

// Starting Server.
let server;
connectDB()
  .then(() => {
    server = app.listen(PORT, () => {
      console.log(`⚙️  Server is running at port : ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
  });

// 🛡️ Global handler for unhandled promise rejections, means promise got reject & had no catch block to execute the promise rejection, this code will run to safely shutdown the server. This code will get executed when Node.js process throws the unhandledRejection event.
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Promise Rejection 🔥", err);
  server.close(() => {
    process.exit(1);
  });
});
