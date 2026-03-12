import jwt from "jsonwebtoken";
import SellerModel from "../schema/sellerModel.js";

export const protectSeller = async (req, res, next) => {
    try {
        const token = req.cookies.sellerToken;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Not authorized, seller token missing",
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const seller = await SellerModel.findById(decoded.id);

        if (!seller) {
            return res.status(401).json({
                success: false,
                message: "Seller not found or access denied",
            });
        }

        // Specifically check the email convention in middleware too for added safety
        if (!seller.email.endsWith("@maatikalaa.com")) {
            return res.status(401).json({
                success: false,
                message: "Invalid seller domain access restricted"
            });
        }

        req.seller = seller;

        next();

    } catch (error) {
        console.log("Seller Auth Error:", error.message);
        return res.status(401).json({
            success: false,
            message: "Invalid or expired seller session, please login again",
        });
    }
};
