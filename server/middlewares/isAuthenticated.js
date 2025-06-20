// import jwt from "jsonwebtoken";
// import { sendError } from "../utils/sendError.js";

// const isAuthenticated = async (req, res, next) => {
//   try {
//     const token = req.cookies.token;
//     if (!token) {
//       return sendError(res, {
//         statusCode: 401,
//         message: "User not authorized",
//       });
//     }
//     const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

//     if (!decodedToken || !decodedToken.userId) {
//       return sendError(res, {
//         statusCode: 401,
//         message: "User not authorized, Please login again.",
//       });
//     }
//     req.id = decodedToken.userId;
//     next();
//   } catch (error) {
//     sendError(res, { statusCode: 500, message: "Failed to authenticate." });
//     console.error(error);
//   }
// };

// export default isAuthenticated;
