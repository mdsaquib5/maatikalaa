import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
        required: true
    },
    qty: {
        type: Number,
        default: 1
    },
    price: Number,
    sellerName: String
});

const cartSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            unique: true
        },

        items: [cartItemSchema],

        version: {
            type: Number,
            default: 1
        }
    },
    { timestamps: true }
);

export default mongoose.model("Cart", cartSchema);