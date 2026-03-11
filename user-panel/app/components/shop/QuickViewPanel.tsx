"use client";

import React from "react";
import Image from "next/image";
import { IoClose } from "react-icons/io5";

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    discountPrice?: number;
    image: string;
}

interface QuickViewPanelProps {
    product: Product | null;
    onClose: () => void;
}

const QuickViewPanel: React.FC<QuickViewPanelProps> = ({ product, onClose }) => {
    if (!product) return null;

    return (
        <div className={`quick-view ${product ? "quick-view--active" : ""}`}>
            <div className="quick-view__overlay" onClick={onClose}></div>
            <div className="quick-view__modal">
                <button className="quick-view__close" onClick={onClose} aria-label="Close">
                    <IoClose size={24} />
                </button>

                <div className="quick-view__img-side">
                    <img
                        src={product.image}
                        alt={product.name}
                        className="quick-view__img"
                    />
                </div>

                <div className="quick-view__info-side">
                    <span className="quick-view__tag">Featured Piece</span>
                    <h2 className="quick-view__title">{product.name}</h2>
                    <div className="quick-view__price-row">
                        <span>${product.price.toFixed(2)}</span>
                        {product.discountPrice && (
                            <span style={{ textDecoration: 'line-through', color: '#999', fontSize: '1.2rem', fontWeight: 400 }}>
                                ${product.discountPrice.toFixed(2)}
                            </span>
                        )}
                    </div>
                    <p className="quick-view__desc">
                        {product.description}
                    </p>

                    <button className="quick-view__btn" onClick={() => console.log("Added from quick view")}>
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    );
};

export default QuickViewPanel;
