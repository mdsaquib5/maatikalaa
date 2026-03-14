import sellerModel from "../schema/sellerModel.js";
import bcrypt from "bcrypt";
import validator from "validator";
import generateToken from "../utils/generateToken.js";

export const sellerSignup = async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;

        if (!name || !email || !password || !phone) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        // Email convention check (A1 constraint)
        if (!email.endsWith("@maatikalaa.com")) {
            return res.status(400).json({
                success: false,
                message: "Signup restricted: Only @maatikalaa.com emails allowed for sellers"
            });
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: "Invalid email format" });
        }

        const existingSeller = await sellerModel.findOne({ email });
        if (existingSeller) {
            return res.status(400).json({ success: false, message: "Seller already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const seller = await sellerModel.create({
            name,
            email,
            password: hashedPassword,
            phone,
        });

        const token = generateToken(seller._id);

        const isProduction = process.env.NODE_ENV === "production";
        res.cookie("sellerToken", token, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "none" : "lax",
            path: "/",
        });

        seller.password = undefined;

        return res.status(201).json({
            success: true,
            message: "Seller registered successfully",
            token,
            seller
        });
    } catch (error) {
        console.log("Seller Signup Error:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const sellerLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Email and password required" });
        }

        // Login check as well
        if (!email.endsWith("@maatikalaa.com")) {
            return res.status(403).json({
                success: false,
                message: "Access denied: Sellers must use @maatikalaa.com email"
            });
        }

        const seller = await sellerModel.findOne({ email }).select("+password");

        if (!seller || !(await bcrypt.compare(password, seller.password))) {
            return res.status(400).json({ success: false, message: "Invalid email or password" });
        }

        const token = generateToken(seller._id);

        const isProduction = process.env.NODE_ENV === "production";
        res.cookie("sellerToken", token, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "none" : "lax",
            path: "/",
        });


        seller.password = undefined;

        return res.status(200).json({
            success: true,
            message: "Seller login successful",
            token,
            seller
        });
    } catch (error) {
        console.log("Seller Login Error:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const sellerLogout = (req, res) => {
    try {
        const isProduction = process.env.NODE_ENV === "production";
        res.cookie("sellerToken", "", {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "none" : "lax",
            path: "/",
            expires: new Date(0),
        });


        return res.status(200).json({ success: true, message: "Seller logged out successfully" });
    } catch (error) {
        console.log("Seller Logout Error:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const getSellerData = async (req, res) => {
    try {
        return res.status(200).json({
            success: true,
            seller: req.seller,
        });
    } catch (error) {
        console.log("Get Seller Data Error:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};
