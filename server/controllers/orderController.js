import Order from "../schema/orderModel.js"
import Cart from "../schema/cartModel.js"
import Product from "../schema/productModel.js"
import razorpay from "../configs/razorpay.js"
import crypto from "crypto"

export const createOrder = async (req, res) => {

    try {

        const { items, totalAmount, paymentMethod, shippingAddress, phone } = req.body

        const order = await Order.create({
            userId: req.user._id,
            items,
            totalAmount,
            paymentMethod,
            shippingAddress,
            phone
        })

        if (paymentMethod === "COD") {

            await Cart.findOneAndUpdate({ userId: req.user._id }, { items: [] })

            return res.json({
                success: true,
                message: "Order placed with COD",
                order
            })

        }

        const razorpayOrder = await razorpay.orders.create({

            amount: totalAmount * 100,
            currency: "INR",
            receipt: order._id.toString()

        })

        order.razorpayOrderId = razorpayOrder.id
        await order.save()

        return res.json({

            success: true,
            order,
            razorpayOrder

        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message
        })

    }

}

export const getSellerOrders = async (req, res) => {

    try {

        const sellerId = req.seller._id;

        // Find all products belonging to this seller
        const products = await Product.find({ sellerId }).select("_id");
        const productIds = products.map(p => p._id);

        // Find orders containing any of these products
        const orders = await Order.find({ "items.productId": { $in: productIds } })
            .populate("userId", "name email")
            .populate("items.productId")
            .sort({ createdAt: -1 });

        // Filter items in each order to only show what belongs to this seller
        const sellerOrders = orders.map(order => {
            const orderObj = order.toObject();
            const sellerItems = orderObj.items.filter(item =>
                item.productId && item.productId.sellerId.toString() === sellerId.toString()
            );

            const sellerTotalAmount = sellerItems.reduce((sum, item) => sum + (item.price * (item.quantity || 0)), 0);

            return {
                ...orderObj,
                items: sellerItems,
                sellerTotalAmount: sellerTotalAmount || 0
            };
        });

        res.json({
            success: true,
            orders: sellerOrders
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }

}

export const getUserOrders = async (req, res) => {

    try {

        const userId = req.user._id

        const orders = await Order.find({ userId }).populate("items.productId").sort({ createdAt: -1 })

        res.json({

            success: true,
            orders

        })

    } catch (error) {

        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message
        })

    }

}

export const verifyPayment = async (req, res) => {

    try {

        const {

            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature

        } = req.body


        const body = razorpay_order_id + "|" + razorpay_payment_id

        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_SECRET)
            .update(body)
            .digest("hex")


        if (expectedSignature !== razorpay_signature) {

            return res.status(400).json({

                success: false,
                message: "Payment verification failed"

            })

        }


        const order = await Order.findOne({
            razorpayOrderId: razorpay_order_id
        })

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            })
        }

        order.paymentStatus = "PAID"
        order.razorpayPaymentId = razorpay_payment_id

        await order.save()

        await Cart.findOneAndUpdate({ userId: req.user._id }, { items: [] })

        res.json({

            success: true,
            message: "Payment verified",
            order

        })


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message
        })

    }

}

export const updateOrderStatus = async (req, res) => {

    try {

        const { orderId, status } = req.body;

        const order = await Order.findById(orderId).populate("items.productId");

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        // Verify that this seller actually has products in this order
        const hasSellerProduct = order.items.some(item => 
            item.productId && item.productId.sellerId.toString() === req.seller._id.toString()
        );

        if (!hasSellerProduct) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized to update this order"
            });
        }

        order.orderStatus = status;
        await order.save();

        res.json({
            success: true,
            message: "Order status updated",
            order
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }

}