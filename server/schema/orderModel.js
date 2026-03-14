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
            name: String,
            price: Number,
            qty: Number
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

    razorpayOrderId: String,
    razorpayPaymentId: String

}, { timestamps: true })

const orderModel = mongoose.models.order || mongoose.model("order", orderSchema);

export default orderModel;