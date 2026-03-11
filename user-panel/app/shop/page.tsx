"use client";

import React, { useState } from "react";
import ProductCard from "../components/shop/ProductCard";
import QuickViewPanel from "../components/shop/QuickViewPanel";
import { FiSearch } from "react-icons/fi";
import Link from "next/link";

const products = [
    {
        id: 1,
        name: "Artisan Earth Vase",
        description: "Handcrafted from deep river clay, this vase features a unique textured finish that brings the soul of the earth into your home.",
        price: 45.00,
        discountPrice: 60.00,
        image: "/hero-bg-2.webp"
    },
    {
        id: 2,
        name: "Minimalist Stone Mug",
        description: "A perfectly weighted mug for slow mornings. Fire-glazed with a matte charcoal finish that feels incredible to hold.",
        price: 28.00,
        discountPrice: 35.00,
        image: "/hero-bg-1.webp"
    },
    {
        id: 3,
        name: "Ancient Tides Bowl",
        description: "Inspired by movement of the sea, this wide bowl features a mesmerizing blue ripple glaze. Perfect for shared meals.",
        price: 55.00,
        image: "/hero-bg-3.webp"
    },
    {
        id: 4,
        name: "Desert Bloom Pitcher",
        description: "Tall and elegant, this pitcher is crafted from sand-rich clay and fired with a subtle terracotta glow.",
        price: 72.00,
        discountPrice: 90.00,
        image: "/hero-bg-2.webp"
    },
    {
        id: 5,
        name: "Lunar Crater Plate",
        description: "Textured like the surface of the moon, this plate is a conversation starter for any dinner table.",
        price: 32.00,
        image: "/hero-bg-1.webp"
    },
    {
        id: 6,
        name: "Rustica Serving Tray",
        description: "A large, sturdy tray built for gatherings. Features raw, unglazed edges for a rustic, tactile experience.",
        price: 85.00,
        discountPrice: 110.00,
        image: "/hero-bg-3.webp"
    }
];

const ShopPage = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <main className="shop-page">
            <div className="container">

                {/* Header & Search */}
                <header className="shop-header">
                    <div className="shop-header__info">
                        <span className="shop-header__tag">The Collection</span>
                        <h1 className="shop-header__title">Handcrafted Muds Ware.</h1>
                    </div>

                    <div className="shop-search">
                        <FiSearch className="shop-search__icon" />
                        <input
                            type="text"
                            className="shop-search__input"
                            placeholder="Search our pieces..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </header>

                {/* Grid */}
                <div className="product-grid">
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map(product => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                onQuickView={(p) => setSelectedProduct(p)}
                            />
                        ))
                    ) : (
                        <div style={{ color: 'white', padding: '40px 0', fontSize: '1.2rem' }}>
                            No products found matching &quot;{searchTerm}&quot;
                        </div>
                    )}
                </div>
            </div>

            {/* Lower CTA */}
            <section className="shop-cta">
                <div className="container">
                    <div className="shop-cta__content">
                        <h2 className="shop-cta__title">Are you an Artisan?</h2>
                        <p className="shop-cta__text">Join our community of creators and showcase your craft to the world.</p>
                        <Link href="/craft" className="shop-cta__btn">Become a Seller</Link>
                    </div>
                </div>
            </section>

            {/* Modal */}
            <QuickViewPanel
                product={selectedProduct}
                onClose={() => setSelectedProduct(null)}
            />
        </main>
    );
};

export default ShopPage;
