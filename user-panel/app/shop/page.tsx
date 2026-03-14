"use client";

import React, { useState } from "react";
import ProductCard from "../components/shop/ProductCard";
import QuickViewPanel from "../components/shop/QuickViewPanel";
import { FiSearch } from "react-icons/fi";
import Link from "next/link";
import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

const ShopPage = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

    const { data, isLoading } = useQuery({
        queryKey: ['products'],
        queryFn: async () => {
            const res = await api.get('/products/all-products');
            return res.data;
        }
    });

    const products = data?.products || [];

    const filteredProducts = products.filter((product: any) =>
        product.productName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <main className="shop-page">
            <div className="container">

                {/* Header & Search */}
                <header className="shop-header">
                    <div className="shop-header__info">
                        <span className="theme-badge mb-24">The Collection</span>
                        <h1 className="theme-title mb-0">Handcrafted Muds Ware.</h1>
                    </div>

                    <div className="shop-search">
                        <FiSearch className="shop-search__icon text-accent" />
                        <input
                            type="text"
                            className="shop-search__input font-inherit"
                            placeholder="Search our pieces..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </header>

                {/* Grid */}
                <div className="product-grid">
                    {isLoading ? (
                        <div className="product-grid__full-width product-grid__loading">
                            Discovering artisan pieces...
                        </div>
                    ) : filteredProducts.length > 0 ? (
                        filteredProducts.map((product: any) => (
                            <ProductCard
                                key={product._id}
                                product={{
                                    id: product._id,
                                    name: product.productName,
                                    description: product.description,
                                    price: product.price,
                                    image: product.images[0]?.url || '/placeholder.png',
                                    sellerId: product.sellerId
                                }}
                                onQuickView={(p) => setSelectedProduct(product)}
                            />
                        ))
                    ) : (
                        <div className="product-grid__full-width product-grid__empty">
                            <p className="text-body">No products found matching &quot;{searchTerm}&quot;</p>
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
                product={selectedProduct ? {
                    id: selectedProduct._id,
                    name: selectedProduct.productName,
                    description: selectedProduct.description,
                    price: selectedProduct.price,
                    image: selectedProduct.images[0]?.url || '/placeholder.png'
                } : null}
                onClose={() => setSelectedProduct(null)}
            />
        </main>
    );
};

export default ShopPage;
