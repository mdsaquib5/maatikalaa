import mongoose from "mongoose";
import Cart from "../schema/cartModel.js";
import Product from "../schema/productModel.js";

// Get user cart
export const getCart = async (req, res) => {
    try {
        const userId = req.user._id;
        let cart = await Cart.findOne({ userId });

        if (!cart) {
            cart = { items: [], version: 1 };
        }

        res.json({
            success: true,
            cart
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Add item to cart or increase quantity
export const addItem = async (req, res) => {
    try {
        const userId = req.user._id;
        const { productId, price } = req.body;

        if (!productId) {
            return res.status(400).json({ success: false, message: "ProductID is required" });
        }

        // Fetch product to get seller details
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        const sellerName = product.sellerName;

        let cart = await Cart.findOne({ userId });

        if (!cart) {
            cart = new Cart({
                userId,
                items: [{ productId, qty: 1, price, sellerName }],
                version: 1
            });
        } else {
            const itemIndex = cart.items.findIndex(i => i.productId.toString() === productId);

            if (itemIndex > -1) {
                cart.items[itemIndex].qty += 1;
            } else {
                cart.items.push({ 
                    productId: new mongoose.Types.ObjectId(productId), 
                    qty: 1, 
                    price,
                    sellerName
                });
            }
            cart.version += 1;
        }

        const savedCart = await cart.save();

        res.json({
            success: true,
            message: "Item added to cart",
            cart: savedCart
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Decrease item quantity
export const decreaseItem = async (req, res) => {
    try {
        const userId = req.user._id;
        const { productId } = req.body;

        let cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({ success: false, message: "Cart not found" });
        }

        const itemIndex = cart.items.findIndex(i => i.productId.toString() === productId);

        if (itemIndex > -1) {
            if (cart.items[itemIndex].qty > 1) {
                cart.items[itemIndex].qty -= 1;
            } else {
                // If quantity is 1, remove the item
                cart.items.splice(itemIndex, 1);
            }
            cart.version += 1;
            await cart.save();
            
            res.json({
                success: true,
                message: "Quantity decreased",
                cart
            });
        } else {
            res.status(404).json({
                success: false,
                message: "Item not found in cart"
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Remove item from cart completely
export const removeItem = async (req, res) => {
    try {
        const userId = req.user._id;
        const { productId } = req.body;

        let cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({ success: false, message: "Cart not found" });
        }

        const itemIndex = cart.items.findIndex(i => i.productId.toString() === productId);

        if (itemIndex > -1) {
            cart.items.splice(itemIndex, 1);
            cart.version += 1;
            await cart.save();

            res.json({
                success: true,
                message: "Item removed from cart",
                cart
            });
        } else {
            res.status(404).json({
                success: false,
                message: "Item not found in cart"
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};