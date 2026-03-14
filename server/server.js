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

app.use(cors({
    origin: ["http://localhost:3000", "http://localhost:3001"], // your frontend and seller panel URLs
    credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

// Routes
app.get("/", (req, res) => {
    res.send("Server is running on port 4000");
});

// my routes
app.use("/api/user", userRouter);
app.use("/api/seller", sellerRouter);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRouter);
app.use("/api/orders", orderRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port Localhost:${PORT}`));