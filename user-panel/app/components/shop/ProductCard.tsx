"use client";

import React from "react";
import Image from "next/image";
import { FiShoppingCart } from "react-icons/fi";

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    discountPrice?: number;
    image: string;
}

interface ProductCardProps {
    product: Product;
    onQuickView: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView }) => {
    return (
        <div className="product-card" onClick={() => onQuickView(product)}>
            <button
                className="product-card__cart-btn"
                onClick={(e) => {
                    e.stopPropagation();
                    console.log("Added to cart:", product.name);
                }}
                aria-label="Add to cart"
            >
                <FiShoppingCart />
            </button>

            <div className="product-card__content">
                <h3 className="product-card__title">{product.name}</h3>
                <div className="product-card__price-row">
                    <span className="product-card__price">${product.price.toFixed(2)}</span>
                    {product.discountPrice && (
                        <span className="product-card__price--old">
                            ${product.discountPrice.toFixed(2)}
                        </span>
                    )}
                </div>
            </div>

            <div className="product-card__image-wrapper">
                <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="product-card__image"
                />
            </div>
        </div>
    );
};

export default ProductCard;
