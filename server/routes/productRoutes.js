import express from "express";
import upload from "../middleware/multer.js";

import {
    addProduct,
    getProducts,
    deleteProduct,
    updateProduct,
    updateStock,
    getAllShopProducts,
    getProductById
} from "../controllers/productController.js";

import { protectSeller } from "../middleware/sellerAuth.js";

const productRouter = express.Router();

// PUBLIC ROUTES (USER PANEL)
productRouter.get("/all-products", getAllShopProducts);
productRouter.get("/get-product/:id", getProductById);

// PROTECTED ROUTES (SELLER PANEL)
productRouter.post(
    "/add-product",
    protectSeller,
    upload.array("images", 5),
    addProduct
);

productRouter.get(
    "/seller-products",
    protectSeller,
    getProducts
);

productRouter.delete(
    "/delete-product/:id",
    protectSeller,
    deleteProduct
);

productRouter.put(
    "/update-product/:id",
    protectSeller,
    upload.array("images", 5),
    updateProduct
);

productRouter.put(
    "/update-stock/:id",
    protectSeller,
    updateStock
);

export default productRouter;