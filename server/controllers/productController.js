import Product from "../schema/productModel.js";
import cloudinary from "../configs/cloudinary.js";

export const addProduct = async (req, res) => {

    try {
        // Normalize req.body keys to handle trailing spaces from tools like Postman
        const body = {};
        Object.keys(req.body).forEach(key => {
            body[key.trim()] = req.body[key];
        });

        const { productName, description, price, sizes, stock, hotProduct } = body;

        if (!productName || !description || !price || !stock) {
            return res.status(400).json({
                success: false,
                message: "All required fields missing (productName, description, price, stock)"
            });
        }

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Upload atleast one image"
            });
        }

        const images = [];
        for (let file of req.files) {
            // Server-side check for 2MB limit
            if (file.size > 2 * 1024 * 1024) {
                return res.status(400).json({
                    success: false,
                    message: `Image ${file.originalname} is too large. Max limit is 2MB per image.`
                });
            }

            const result = await new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream(
                    { folder: "products" },
                    (err, result) => {
                        if (err) reject(err)
                        else resolve(result)
                    }
                ).end(file.buffer)
            });
            images.push({
                url: result.secure_url,
                public_id: result.public_id
            });
        }

        const stockCount = Number(stock);
        const product = await Product.create({
            sellerId: req.seller._id,
            sellerName: req.seller.name,
            productName,
            description,
            price: Number(price),
            sizes, // Model handles parsing via setter
            stock: stockCount,
            isOutOfStock: stockCount === 0,
            hotProduct: String(hotProduct).toLowerCase() === 'true',
            images
        });

        return res.status(201).json({
            success: true,
            message: "Product created successfully",
            product
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message
        })

    }
};

export const getProducts = async (req, res) => {

    try {

        const products = await Product.find({ sellerId: req.seller._id })
            .sort({ createdAt: -1 })
            .populate("sellerId", "-password")
            .select("productName price sizes images stock sellerId sellerName isOutOfStock");

        return res.json({
            success: true,
            total: products.length,
            seller: req.seller, // Also sending current seller details separately if needed
            products
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        })

    }

}

export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await Product.findOne({ _id: id, sellerId: req.seller._id });

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found or unauthorized"
            });
        }

        // Delete images from Cloudinary
        for (const image of product.images) {
            if (image.public_id) {
                await cloudinary.uploader.destroy(image.public_id);
            }
        }

        await Product.findByIdAndDelete(id);

        res.json({
            success: true,
            message: "Product and associated images deleted successfully"
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Normalize req.body
        const body = {};
        Object.keys(req.body).forEach(key => {
            body[key.trim()] = req.body[key];
        });

        const { productName, description, price, sizes, stock, hotProduct } = body;

        const product = await Product.findOne({ _id: id, sellerId: req.seller._id });
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found or unauthorized"
            });
        }

        const updateData = {
            productName: productName || product.productName,
            description: description || product.description,
            price: price ? Number(price) : product.price,
            sizes: sizes || product.sizes,
            stock: stock ? Number(stock) : product.stock,
            hotProduct: hotProduct !== undefined ? (String(hotProduct).toLowerCase() === 'true') : product.hotProduct
        };

        if (updateData.stock !== undefined) {
            updateData.isOutOfStock = updateData.stock === 0;
        }

        // Handle Image Updates if new ones are provided
        if (req.files && req.files.length > 0) {
            // Delete old images
            for (const img of product.images) {
                if (img.public_id) await cloudinary.uploader.destroy(img.public_id);
            }

            const newImages = [];
            for (let file of req.files) {
                const result = await new Promise((resolve, reject) => {
                    cloudinary.uploader.upload_stream(
                        { folder: "products" },
                        (err, result) => {
                            if (err) reject(err)
                            else resolve(result)
                        }
                    ).end(file.buffer)
                });
                newImages.push({
                    url: result.secure_url,
                    public_id: result.public_id
                });
            }
            updateData.images = newImages;
        }

        const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { new: true });

        res.json({
            success: true,
            message: "Product updated successfully",
            product: updatedProduct
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

export const updateStock = async (req, res) => {
    try {
        const { id } = req.params;
        const { stock } = req.body;

        const stockCount = Number(stock);

        const product = await Product.findOneAndUpdate(
            { _id: id, sellerId: req.seller._id },
            {
                stock: stockCount,
                isOutOfStock: stockCount === 0
            },
            { returnDocument: 'after' }
        );

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found or unauthorized"
            });
        }

        return res.json({
            success: true,
            message: `Stock updated. Product is now ${product.isOutOfStock ? 'Out of Stock' : 'In Stock'}`,
            product
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

// USER PANEL ENDPOINTS

export const getAllShopProducts = async (req, res) => {
    try {
        const products = await Product.find({})
            .sort({ createdAt: -1 })
            .select("productName price sizes images stock sellerId sellerName isOutOfStock");
        
        return res.json({
            success: true,
            products
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

export const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id).populate("sellerId", "name email phone");
        
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        return res.json({
            success: true,
            product
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}