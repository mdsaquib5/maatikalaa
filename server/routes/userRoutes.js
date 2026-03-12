import express from "express";
import { signup, login, logout, getUserData } from "../controllers/userController.js";
import { protect } from "../middleware/userAuth.js";

const userRouter = express.Router();

userRouter.post("/signup", signup);
userRouter.post("/login", login);
userRouter.post("/logout", logout);
userRouter.get("/get-user", protect, getUserData);

export default userRouter;