import express from "express"
import { createuser, logingUser } from "../contrallers/userContarallers.js";
// import { createUser,userLogin } from "../contrallers/userContarallers.js";
// import { authMiddleware } from "../middleware/authMiddleware.js";


const userRoutes = express.Router();

userRoutes.post("/register",createuser)
userRoutes.post("/login",logingUser)


// userRoutes.get("/profile", authMiddleware, (req, res) => {
//   res.json({
//     message: "User profile data",
//     user: req.user // from the token payload
//   });
// });

// userRoutes.post("/",createUser)
// userRoutes.get("/",userLogin)

export default userRoutes;