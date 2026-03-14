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
                    <div className="quick-view__price-row mb-24">
                        <span className="text-xl font-800 text-accent">₹{product.price.toLocaleString('en-IN')}</span>
                        {product.discountPrice && (
                            <span className="text-body text-strike text-body-lg font-400">
                                ₹{product.discountPrice.toLocaleString('en-IN')}
                            </span>
                        )}
                    </div>
                    <p className="quick-view__desc text-body line-height-17 mb-32">
                        {product.description}
                    </p>

                    <button className="theme-button w-full" onClick={() => console.log("Added from quick view")}>
                        View Details
                    </button>
                </div>
            </div>
        </div>
    );
};

export default QuickViewPanel;
