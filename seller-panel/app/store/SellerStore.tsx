'use client';

import React, { createContext, useContext, ReactNode } from 'react';

// This file is kept for type definitions and potential legacy context
// Real auth is now in useSellerAuth.ts
// Real data is handled by Tanstack Query

export interface Seller {
    _id: string;
    name: string;
    email: string;
}

export interface Product {
    _id: string;
    sellerId: string;
    productName: string;
    description: string;
    price: number;
    sizes: string[];
    stock: number;
    images: { url: string; public_id: string }[];
    isOutOfStock: boolean;
    hotProduct: boolean;
    createdAt: string;
}

export type OrderStatus = 'PENDING' | 'PAID' | 'FAILED';

export interface Order {
    _id: string;
    userId: {
        _id: string;
        name: string;
        email: string;
    };
    items: {
        productId: Product;
        quantity: number;
        size: string;
        price: number;
    }[];
    totalAmount: number;
    sellerTotalAmount: number;
    paymentMethod: string;
    paymentStatus: string;
    orderStatus: string;
    shippingAddress?: string;
    phone?: string;
    createdAt: string;
}

export function SellerProvider({ children }: { children: ReactNode }) {
    return (
        <>
            {children}
        </>
    );
}

export function useSellerStore() {
    // This is a placeholder. Transitioning to useSellerAuth and Tanstack Query.
    return {};
}
