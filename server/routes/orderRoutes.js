import express from "express"
import { createOrder, verifyPayment } from "../controllers/orderController.js"
import { protect } from "../middleware/userAuth.js"

const orderRouter = express.Router()

orderRouter.post("/create", protect, createOrder)

orderRouter.post("/verify-payment", protect, verifyPayment)

export default orderRouter;