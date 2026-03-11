'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useSellerStore, Product } from '../../store/SellerStore';
import { useToast } from '../../components/ui/Toast';
import { MdSearch, MdDeleteOutline, MdImage, MdAddBox } from 'react-icons/md';

function ConfirmDeleteModal({
    product,
    onConfirm,
    onCancel,
}: {
    product: Product;
    onConfirm: () => void;
    onCancel: () => void;
}) {
    return (
        <div className="modal-overlay" onClick={onCancel}>
            <div className="modal" onClick={e => e.stopPropagation()}>
                <div className="modal__header">
                    <h3 className="modal__title">Delete Product</h3>
                    <button className="modal__close" onClick={onCancel}>✕</button>
                </div>
                <p style={{ fontSize: '0.9rem', color: 'var(--color-text-body)', lineHeight: '1.6', marginBottom: '24px' }}>
                    Are you sure you want to delete <span style={{ color: 'var(--color-text-heading)', fontWeight: 600 }}>"{product.name}"</span>?
                    This action cannot be undone.
                </p>
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                    <button className="btn btn--secondary" onClick={onCancel}>Cancel</button>
                    <button className="btn btn--danger" onClick={onConfirm}>Delete</button>
                </div>
            </div>
        </div>
    );
}

export default function ProductsPage() {
    const { isAuthenticated, products, deleteProduct } = useSellerStore();
    const { showToast } = useToast();
    const router = useRouter();
    const [search, setSearch] = useState('');
    const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);

    useEffect(() => {
        if (!isAuthenticated) router.replace('/login');
    }, [isAuthenticated, router]);

    if (!isAuthenticated) return null;

    const filtered = products.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase())
    );

    const handleDelete = () => {
        if (!deleteTarget) return;
        deleteProduct(deleteTarget.id);
        showToast(`"${deleteTarget.name}" deleted.`, 'success');
        setDeleteTarget(null);
    };

    const fmt = (n: number) => `₹${n.toLocaleString('en-IN')}`;

    return (
        <DashboardLayout pageTitle="All Products" pageCrumb="Dashboard • Products">
            {deleteTarget && (
                <ConfirmDeleteModal
                    product={deleteTarget}
                    onConfirm={handleDelete}
                    onCancel={() => setDeleteTarget(null)}
                />
            )}

            <div className="section-header">
                <div className="section-header__left">
                    <h2 className="section-header__title">All Products</h2>
                    <p className="section-header__subtitle">{products.length} listing{products.length !== 1 ? 's' : ''}</p>
                </div>
                <div className="section-header__right" style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <button className="btn btn--primary" onClick={() => router.push('/add-product')}>
                        <MdAddBox size={16} /> Add Product
                    </button>
                </div>
            </div>

            {/* Search */}
            <div className="filter-row">
                <div className="search-bar" style={{ maxWidth: '380px', width: '100%' }}>
                    <span className="search-bar__icon"><MdSearch /></span>
                    <input
                        id="product-search"
                        type="text"
                        className="search-bar__input"
                        placeholder="Search products…"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {filtered.length === 0 ? (
                <div className="card">
                    <div className="empty-state">
                        <div className="empty-state__icon"><MdImage /></div>
                        <p className="empty-state__title">
                            {search ? 'No matching products' : 'No products yet'}
                        </p>
                        <p className="empty-state__text">
                            {search
                                ? 'Try different search terms.'
                                : 'Add your first handcraft product to start selling.'}
                        </p>
                        {!search && (
                            <button className="btn btn--primary" style={{ marginTop: '8px' }} onClick={() => router.push('/add-product')}>
                                <MdAddBox size={16} /> Add Product
                            </button>
                        )}
                    </div>
                </div>
            ) : (
                <div className="products-grid">
                    {filtered.map(product => (
                        <div key={product.id} className="product-card">
                            <div className="product-card__image">
                                {product.images[0] ? (
                                    <img src={product.images[0]} alt={product.name} />
                                ) : (
                                    <div className="product-card__no-img"><MdImage /></div>
                                )}
                            </div>
                            <div className="product-card__body">
                                <p className="product-card__title">{product.name}</p>
                                <p className="product-card__price">{fmt(product.price)}</p>
                                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '14px' }}>
                                    {product.sizes.map(s => (
                                        <span key={s} className="badge badge--neutral" style={{ fontSize: '0.68rem' }}>{s}</span>
                                    ))}
                                </div>
                                <div className="product-card__actions">
                                    <button
                                        id={`delete-product-${product.id}`}
                                        className="btn btn--danger btn--sm"
                                        style={{ flex: 1 }}
                                        onClick={() => setDeleteTarget(product)}
                                    >
                                        <MdDeleteOutline size={15} /> Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </DashboardLayout>
    );
}
