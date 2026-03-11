'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

/* ─────────────────────────────────────────────────────────────────────────── */
/*  TYPES                                                                       */
/* ─────────────────────────────────────────────────────────────────────────── */

export interface Seller {
    id: string;
    name: string;
    email: string;
    avatar?: string;
}

export interface Product {
    id: string;
    sellerId: string;
    name: string;
    description: string;
    price: number;
    sizes: string[];
    images: string[];
    createdAt: string;
}

export type OrderStatus = 'placed' | 'packing' | 'shipped' | 'out_for_delivery' | 'delivered';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface Order {
    id: string;
    sellerId: string;
    productId: string;
    productName: string;
    productImage?: string;
    totalItems: number;
    size: string;
    quantity: number;
    customer: {
        name: string;
        address: string;
        phone: string;
    };
    payment: {
        method: string;
        amount: number;
        status: PaymentStatus;
    };
    orderDate: string;
    status: OrderStatus;
}

interface SellerStore {
    /* Auth */
    seller: Seller | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    signup: (name: string, email: string, password: string) => Promise<boolean>;
    logout: () => void;
    /* Products */
    products: Product[];
    addProduct: (product: Omit<Product, 'id' | 'sellerId' | 'createdAt'>) => void;
    deleteProduct: (id: string) => void;
    /* Orders */
    orders: Order[];
    updateOrderStatus: (id: string, status: OrderStatus) => void;
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  MOCK DATA                                                                   */
/* ─────────────────────────────────────────────────────────────────────────── */
const MOCK_SELLER: Seller = {
    id: 'SLR-001',
    name: 'Arjun Mehra',
    email: 'arjun@maatikala.in',
    avatar: '',
};

const MOCK_PRODUCTS: Product[] = [
    {
        id: 'PRD-001',
        sellerId: 'SLR-001',
        name: 'Earthen Tandoor Mug',
        description: 'Hand-thrown chai mug from red Rajasthani clay.',
        price: 349,
        sizes: ['S', 'M', 'L'],
        images: [],
        createdAt: '2026-02-10T08:00:00Z',
    },
    {
        id: 'PRD-002',
        sellerId: 'SLR-001',
        name: 'Kulhad Set of 6',
        description: 'Traditional kulhad set, perfect for serving tea.',
        price: 599,
        sizes: ['S', 'M'],
        images: [],
        createdAt: '2026-02-18T10:00:00Z',
    },
    {
        id: 'PRD-003',
        sellerId: 'SLR-001',
        name: 'Terracotta Planter',
        description: 'Decorative terracotta planter with hand-painted motifs.',
        price: 799,
        sizes: ['M', 'L', 'XL'],
        images: [],
        createdAt: '2026-03-01T12:00:00Z',
    },
    {
        id: 'PRD-004',
        sellerId: 'SLR-001',
        name: 'Clay Water Pot',
        description: 'Authentic mitti ka matka keeps water naturally cool.',
        price: 450,
        sizes: ['M', 'L', 'XL', 'XXL'],
        images: [],
        createdAt: '2026-03-05T14:00:00Z',
    },
];

const MOCK_ORDERS: Order[] = [
    {
        id: '#ORD-2600',
        sellerId: 'SLR-001',
        productId: 'PRD-001',
        productName: 'Earthen Tandoor Mug',
        productImage: '',
        totalItems: 2,
        size: 'M',
        quantity: 2,
        customer: { name: 'Priya Sharma', address: '12, Green Park, New Delhi - 110016', phone: '+91 98765 43210' },
        payment: { method: 'UPI', amount: 698, status: 'paid' },
        orderDate: '2026-03-08T09:15:00Z',
        status: 'placed',
    },
    {
        id: '#ORD-2599',
        sellerId: 'SLR-001',
        productId: 'PRD-002',
        productName: 'Kulhad Set of 6',
        productImage: '',
        totalItems: 1,
        size: 'S',
        quantity: 1,
        customer: { name: 'Ravi Kumar', address: '45, MG Road, Jaipur - 302001', phone: '+91 87654 32109' },
        payment: { method: 'COD', amount: 599, status: 'pending' },
        orderDate: '2026-03-07T15:30:00Z',
        status: 'packing',
    },
    {
        id: '#ORD-2598',
        sellerId: 'SLR-001',
        productId: 'PRD-003',
        productName: 'Terracotta Planter',
        productImage: '',
        totalItems: 3,
        size: 'L',
        quantity: 3,
        customer: { name: 'Meera Patel', address: '7, Satellite Road, Ahmedabad - 380015', phone: '+91 76543 21098' },
        payment: { method: 'Card', amount: 2397, status: 'paid' },
        orderDate: '2026-03-06T11:00:00Z',
        status: 'shipped',
    },
    {
        id: '#ORD-2597',
        sellerId: 'SLR-001',
        productId: 'PRD-004',
        productName: 'Clay Water Pot',
        productImage: '',
        totalItems: 1,
        size: 'XL',
        quantity: 1,
        customer: { name: 'Anjali Singh', address: '23, Civil Lines, Pune - 411001', phone: '+91 65432 10987' },
        payment: { method: 'UPI', amount: 450, status: 'paid' },
        orderDate: '2026-03-05T08:45:00Z',
        status: 'out_for_delivery',
    },
    {
        id: '#ORD-2596',
        sellerId: 'SLR-001',
        productId: 'PRD-001',
        productName: 'Earthen Tandoor Mug',
        productImage: '',
        totalItems: 4,
        size: 'L',
        quantity: 4,
        customer: { name: 'Suresh Yadav', address: '88, Anna Nagar, Chennai - 600040', phone: '+91 54321 09876' },
        payment: { method: 'Card', amount: 1396, status: 'paid' },
        orderDate: '2026-03-03T16:20:00Z',
        status: 'delivered',
    },
];

/* ─────────────────────────────────────────────────────────────────────────── */
/*  CONTEXT                                                                     */
/* ─────────────────────────────────────────────────────────────────────────── */

const SellerContext = createContext<SellerStore | null>(null);

let orderCounter = 2601;

export function SellerProvider({ children }: { children: ReactNode }) {
    // NOTE: isAuthenticated defaults to true for development/preview.
    // Replace with `false` and remove seed data when real auth is wired up.
    const [seller, setSeller] = useState<Seller | null>(MOCK_SELLER);
    const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
    const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
    const [isAuthenticated, setIsAuthenticated] = useState(true);

    /* Hydrate from sessionStorage (preserves real login state later) */
    useEffect(() => {
        try {
            const stored = sessionStorage.getItem('seller_auth');
            if (stored) {
                const parsed = JSON.parse(stored) as Seller;
                setSeller(parsed);
                setIsAuthenticated(true);
                setProducts(MOCK_PRODUCTS);
                setOrders(MOCK_ORDERS);
            }
        } catch {
            // ignore
        }
    }, []);

    const login = async (email: string, password: string): Promise<boolean> => {
        await new Promise(r => setTimeout(r, 800));
        if (email && password.length >= 6) {
            const authed = { ...MOCK_SELLER, email };
            setSeller(authed);
            setIsAuthenticated(true);
            setProducts(MOCK_PRODUCTS);
            setOrders(MOCK_ORDERS);
            sessionStorage.setItem('seller_auth', JSON.stringify(authed));
            return true;
        }
        return false;
    };

    const signup = async (name: string, email: string, password: string): Promise<boolean> => {
        await new Promise(r => setTimeout(r, 900));
        if (name && email && password.length >= 6) {
            const newSeller: Seller = {
                id: `SLR-${Date.now()}`,
                name,
                email,
            };
            setSeller(newSeller);
            setIsAuthenticated(true);
            setProducts([]);
            setOrders([]);
            sessionStorage.setItem('seller_auth', JSON.stringify(newSeller));
            return true;
        }
        return false;
    };

    const logout = () => {
        setSeller(null);
        setIsAuthenticated(false);
        setProducts([]);
        setOrders([]);
        sessionStorage.removeItem('seller_auth');
    };

    const addProduct = (data: Omit<Product, 'id' | 'sellerId' | 'createdAt'>) => {
        const product: Product = {
            ...data,
            id: `PRD-${Date.now()}`,
            sellerId: seller?.id ?? 'unknown',
            createdAt: new Date().toISOString(),
        };
        setProducts(prev => [product, ...prev]);
    };

    const deleteProduct = (id: string) => {
        setProducts(prev => prev.filter(p => p.id !== id));
    };

    const updateOrderStatus = (id: string, status: OrderStatus) => {
        setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    };

    return (
        <SellerContext.Provider
            value={{
                seller, isAuthenticated,
                login, signup, logout,
                products, addProduct, deleteProduct,
                orders, updateOrderStatus,
            }}
        >
            {children}
        </SellerContext.Provider>
    );
}

export function useSellerStore() {
    const ctx = useContext(SellerContext);
    if (!ctx) throw new Error('useSellerStore must be used within SellerProvider');
    return ctx;
}

/* Helper to generate new order ID */
export function generateOrderId() {
    return `#ORD-${orderCounter++}`;
}
