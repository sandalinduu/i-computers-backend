// import jwt from "jsonwebtoken";

// export function authMiddleware(req, res, next) {
//   // Get token from header
//   const authHeader = req.headers["authorization"];
//   // Token should come like: "Bearer <token>"
//   const token = authHeader && authHeader.split(" ")[1];
// // 
//   if (!token) {
//     return res.status(401).json({ message: "No token provided" });
//   }

//   try {
//     // Verify token
//     const decoded = jwt.verify(token, "secritekey#22"); // same secret key you used when signing
//     req.user = decoded; // attach decoded payload to request
//     next();
//   } catch (err) {
//     return res.status(403).json({ message: "Invalid or expired token" });
//   }
// }
