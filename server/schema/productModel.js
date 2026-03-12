import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        sellerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "seller",
            required: true
        },

        sellerName: {
            type: String,
            required: true
        },

        productName: {
            type: String,
            required: true
        },

        description: {
            type: String,
            required: true,
            maxlength: 500
        },

        price: {
            type: Number,
            required: true
        },

        sizes: [
            {
                type: String,
                enum: ["S", "M", "L"]
            }
        ],

        stock: {
            type: Number,
            required: true,
            default: 0
        },

        isOutOfStock: {
            type: Boolean,
            default: false
        },

        hotProduct: {
            type: Boolean,
            default: false
        },

        images: [
            {
                url: String,
                public_id: String
            }
        ]
    },
    { timestamps: true }
);

const productModel = mongoose.models.product || mongoose.model("product", productSchema);

export default productModel;