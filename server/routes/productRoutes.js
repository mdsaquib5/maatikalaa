import express from "express";
import upload from "../middleware/multer.js";

import {
    addProduct,
    getProducts,
    deleteProduct,
    updateStock
} from "../controllers/productController.js";

import { protectSeller } from "../middleware/sellerAuth.js";

const productRouter = express.Router();

productRouter.post(
    "/add-product",
    protectSeller,
    upload.array("images", 5),
    addProduct
);

productRouter.get(
    "/all-products",
    protectSeller,
    getProducts
);

productRouter.delete(
    "/delete-product/:id",
    protectSeller,
    deleteProduct
);

productRouter.put(
    "/update-stock/:id",
    protectSeller,
    updateStock
);

export default productRouter;