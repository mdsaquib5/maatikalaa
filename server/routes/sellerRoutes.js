import express from "express";
import {
    sellerSignup,
    sellerLogin,
    sellerLogout,
    getSellerData
} from "../controllers/sellerController.js";
import { protectSeller } from "../middleware/sellerAuth.js";

const sellerRouter = express.Router();

sellerRouter.post("/signup", sellerSignup);
sellerRouter.post("/login", sellerLogin);
sellerRouter.post("/logout", sellerLogout);
sellerRouter.get("/get-seller", protectSeller, getSellerData);

export default sellerRouter;
