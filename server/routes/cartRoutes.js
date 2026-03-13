import express from "express";
import { getCart, addItem, decreaseItem, removeItem } from "../controllers/cartController.js";
import { protect } from "../middleware/userAuth.js";

const cartRouter = express.Router();

cartRouter.get("/", protect, getCart);
cartRouter.post("/add", protect, addItem);
cartRouter.post("/decrease", protect, decreaseItem);
cartRouter.post("/remove", protect, removeItem);

export default cartRouter;