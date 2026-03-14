"use client";

import React from "react";
import { FiShoppingCart } from "react-icons/fi";
import Link from "next/link";
import { useCart } from "@/store/useCart";
import toast from "react-hot-toast";

interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    sellerId: string;
}

interface ProductCardProps {
    product: Product;
    onQuickView?: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView }) => {
    const { addToCart } = useCart();

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart({
            ...product,
            quantity: 1
        });
        toast.success(`${product.name} added to cart`);
    };

    return (
        <div className="product-card">
            <Link href={`/product/${product.id}`} className="product-card__link">
                <div className="product-card__image-wrapper">
                    <img
                        src={product.image}
                        alt={product.name}
                        className="product-card__image"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                </div>
            </Link>

            <button
                className="product-card__cart-btn"
                onClick={handleAddToCart}
                aria-label="Add to cart"
            >
                <FiShoppingCart />
            </button>

            <div className="product-card__content">
                <Link href={`/product/${product.id}`}>
                    <h3 className="product-card__title" style={{ transition: 'color 0.3s' }}>{product.name}</h3>
                </Link>
                <div className="product-card__price-row">
                    <span className="product-card__price">₹{product.price.toLocaleString('en-IN')}</span>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
