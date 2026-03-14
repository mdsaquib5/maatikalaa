import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import mongoConnection from "./configs/mongo.js";
// my routes
import userRouter from "./routes/userRoutes.js";
import sellerRouter from "./routes/sellerRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRouter from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

const app = express();
mongoConnection();

const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "https://maatikalaa-user.vercel.app",
    "https://maatikalaa-seller.vercel.app"
];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

// Routes
app.get("/", (req, res) => {
    res.send("Maatikalaa Server is running...");
});

// my routes
app.use("/api/user", userRouter);
app.use("/api/seller", sellerRouter);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRouter);
app.use("/api/orders", orderRoutes);

const PORT = process.env.PORT || 4000;

// Only listen if not running as a serverless function
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => console.log(`Server running on port Localhost:${PORT}`));
}

export default app;