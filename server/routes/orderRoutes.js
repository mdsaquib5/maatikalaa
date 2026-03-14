import express from "express"
import { createOrder, getSellerOrders, getUserOrders, verifyPayment, updateOrderStatus } from "../controllers/orderController.js"
import { protect } from "../middleware/userAuth.js"
import { protectSeller } from "../middleware/sellerAuth.js"

const ordersRouter = express.Router()

ordersRouter.post("/create-order", protect, createOrder)

ordersRouter.post("/verify-payment", protect, verifyPayment)

ordersRouter.get("/user-orders", protect, getUserOrders)

ordersRouter.get("/seller-orders", protectSeller, getSellerOrders)

ordersRouter.put("/update-status", protectSeller, updateOrderStatus)

export default ordersRouter;