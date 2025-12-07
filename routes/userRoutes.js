import express from "express"
import { createuser, getUser, googleLogin, logingUser } from "../contrallers/userContarallers.js";


const userRoutes = express.Router();

userRoutes.post("/register",createuser)
userRoutes.post("/login",logingUser)
userRoutes.get("/", getUser);
userRoutes.post("/google-login", googleLogin);

export default userRoutes;