import mongoose from "mongoose";

const sellerSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Seller name is required"],
            trim: true,
            minlength: 2,
            maxlength: 50,
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: 6,
            select: false,
        },
        phone: {
            type: String,
            required: [true, "Phone number is required"],
            unique: true,
        },
        role: {
            type: String,
            default: "seller",
        },
    },
    { timestamps: true }
);

const sellerModel = mongoose.models.seller || mongoose.model("seller", sellerSchema);

export default sellerModel;
