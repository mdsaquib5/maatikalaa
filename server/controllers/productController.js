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

        await Product.findByIdAndDelete(id);

        res.json({
            success: true,
            message: "Product deleted successfully"
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message
        })

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