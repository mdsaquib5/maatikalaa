import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    items: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "product"
            },
            price: Number,
            quantity: Number,
            size: String
        }
    ],
    totalAmount: Number,
    paymentMethod: {
        type: String,
        enum: ["RAZORPAY", "COD"]
    },
    paymentStatus: {
        type: String,
        enum: ["PENDING", "PAID", "FAILED"],
        default: "PENDING"
    },
    orderStatus: {
        type: String,
        enum: ["PENDING", "PACKING", "SHIPPED", "DELIVERED", "CANCELLED"],
        default: "PENDING"
    },
    razorpayOrderId: String,
    razorpayPaymentId: String,
    shippingAddress: String,
    phone: String
}, { timestamps: true });

const orderModel = mongoose.models.order || mongoose.model("order", orderSchema);

export default orderModel;