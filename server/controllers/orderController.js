import Order from "../schema/orderModel.js"
import razorpay from "../configs/razorpay.js"
import crypto from "crypto"

export const createOrder = async (req, res) => {

    try {

        const { items, totalAmount, paymentMethod } = req.body

        const order = await Order.create({

            userId: req.user._id,
            items,
            totalAmount,
            paymentMethod

        })

        if (paymentMethod === "COD") {

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

        order.paymentStatus = "PAID"
        order.razorpayPaymentId = razorpay_payment_id

        await order.save()

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