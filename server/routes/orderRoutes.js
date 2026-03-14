import express from "express"
import { createOrder, verifyPayment, getUserOrders, getSellerOrders } from "../controllers/orderController.js"
import { protect } from "../middleware/userAuth.js"
import { protectSeller } from "../middleware/sellerAuth.js"

const orderRouter = express.Router()

orderRouter.post("/create", protect, createOrder)

orderRouter.post("/verify-payment", protect, verifyPayment)

orderRouter.get("/user-orders", protect, getUserOrders)

orderRouter.get("/seller-orders", protectSeller, getSellerOrders)

export default orderRouter;