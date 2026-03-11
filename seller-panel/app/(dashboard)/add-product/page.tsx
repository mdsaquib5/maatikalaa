'use client';

import { useState, useRef, useEffect, FormEvent, DragEvent } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useSellerStore } from '../../store/SellerStore';
import { useToast } from '../../components/ui/Toast';
import { MdCloudUpload, MdClose, MdAddBox, MdImage } from 'react-icons/md';

const SIZES = ['S', 'M', 'L', 'XL', 'XXL'] as const;

export default function AddProductPage() {
    const { isAuthenticated, addProduct } = useSellerStore();
    const { showToast } = useToast();
    const router = useRouter();

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
    const [images, setImages] = useState<string[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!isAuthenticated) router.replace('/login');
    }, [isAuthenticated, router]);

    const toggleSize = (s: string) => {
        setSelectedSizes(prev =>
            prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]
        );
    };

    const processFiles = (files: FileList | null) => {
        if (!files) return;
        const remaining = 4 - images.length;
        if (remaining <= 0) {
            showToast('Max 4 images allowed.', 'warning');
            return;
        }
        const toProcess = Array.from(files).slice(0, remaining);
        toProcess.forEach(file => {
            if (!file.type.startsWith('image/')) return;
            const reader = new FileReader();
            reader.onload = e => {
                setImages(prev => prev.length < 4 ? [...prev, e.target?.result as string] : prev);
            };
            reader.readAsDataURL(file);
        });
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        processFiles(e.dataTransfer.files);
    };

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const removeImage = (idx: number) => {
        setImages(prev => prev.filter((_, i) => i !== idx));
    };

    const validate = () => {
        const errs: Record<string, string> = {};
        if (!name.trim()) errs.name = 'Product name is required.';
        if (!description.trim()) errs.description = 'Description is required.';
        if (!price || isNaN(Number(price)) || Number(price) <= 0) errs.price = 'Enter a valid price.';
        if (selectedSizes.length === 0) errs.sizes = 'Select at least one size.';
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);
        await new Promise(r => setTimeout(r, 700));
        addProduct({
            name: name.trim(),
            description: description.trim(),
            price: Number(price),
            sizes: selectedSizes,
            images,
        });
        setLoading(false);
        showToast('Product added successfully!', 'success');
        router.push('/products');
    };

    if (!isAuthenticated) return null;

    return (
        <DashboardLayout pageTitle="Add Product" pageCrumb="Dashboard • Add Product">
            <div className="section-header">
                <div className="section-header__left">
                    <h2 className="section-header__title">Add New Product</h2>
                    <p className="section-header__subtitle">Fill in the details to list a new handcraft product.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '24px', alignItems: 'flex-start' }}>

                    {/* Left Column */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                        {/* Product Info Card */}
                        <div className="card">
                            <div className="card__header">
                                <h3 className="card__title">Product Information</h3>
                            </div>
                            <div className="card__body">
                                {/* Name */}
                                <div className="form-group">
                                    <label className="form-label" htmlFor="prod-name">Product Name *</label>
                                    <input
                                        id="prod-name"
                                        type="text"
                                        className="form-input"
                                        placeholder="e.g. Earthen Tandoor Mug"
                                        value={name}
                                        onChange={e => setName(e.target.value)}
                                        maxLength={120}
                                    />
                                    {errors.name && <span className="form-error">{errors.name}</span>}
                                </div>

                                {/* Description */}
                                <div className="form-group">
                                    <label className="form-label" htmlFor="prod-desc">Description *</label>
                                    <textarea
                                        id="prod-desc"
                                        className="form-textarea"
                                        placeholder="Describe your product — materials, craftsmanship, usage..."
                                        value={description}
                                        onChange={e => setDescription(e.target.value)}
                                        rows={4}
                                        maxLength={500}
                                    />
                                    <span className="form-helper">{description.length}/500</span>
                                    {errors.description && <span className="form-error">{errors.description}</span>}
                                </div>

                                {/* Price */}
                                <div className="form-group" style={{ marginBottom: 0 }}>
                                    <label className="form-label" htmlFor="prod-price">Price (₹) *</label>
                                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                                        <span style={{ position: 'absolute', left: '14px', color: 'var(--color-accent-primary)', fontWeight: 700, fontSize: '1rem' }}>₹</span>
                                        <input
                                            id="prod-price"
                                            type="number"
                                            className="form-input"
                                            placeholder="0"
                                            value={price}
                                            onChange={e => setPrice(e.target.value)}
                                            min={1}
                                            step={1}
                                            style={{ paddingLeft: '32px' }}
                                        />
                                    </div>
                                    {errors.price && <span className="form-error">{errors.price}</span>}
                                </div>
                            </div>
                        </div>

                        {/* Sizes Card */}
                        <div className="card">
                            <div className="card__header">
                                <h3 className="card__title">Available Sizes *</h3>
                            </div>
                            <div className="card__body">
                                <div className="size-selector">
                                    {SIZES.map(s => (
                                        <label key={s} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <input
                                                type="checkbox"
                                                className="size-option"
                                                id={`size-${s}`}
                                                checked={selectedSizes.includes(s)}
                                                onChange={() => toggleSize(s)}
                                            />
                                            <span
                                                className={`size-option-label ${selectedSizes.includes(s) ? 'size-option-label--selected' : ''}`}
                                                onClick={() => toggleSize(s)}
                                                style={selectedSizes.includes(s) ? {
                                                    background: 'rgba(249,211,173,0.12)',
                                                    borderColor: 'var(--color-accent-primary)',
                                                    color: 'var(--color-accent-primary)',
                                                    cursor: 'pointer',
                                                } : { cursor: 'pointer' }}
                                            >
                                                {s}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                                {errors.sizes && <span className="form-error" style={{ marginTop: '8px', display: 'block' }}>{errors.sizes}</span>}
                            </div>
                        </div>
                    </div>

                    {/* Right Column — Images */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div className="card">
                            <div className="card__header">
                                <h3 className="card__title">Product Images</h3>
                                <span className="badge badge--neutral">{images.length}/4</span>
                            </div>
                            <div className="card__body">
                                {images.length < 4 && (
                                    <div
                                        className={`upload-area ${isDragging ? 'upload-area--dragging' : ''}`}
                                        onClick={() => fileInputRef.current?.click()}
                                        onDrop={handleDrop}
                                        onDragOver={handleDragOver}
                                        onDragLeave={() => setIsDragging(false)}
                                    >
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            className="upload-area__input"
                                            onChange={e => processFiles(e.target.files)}
                                        />
                                        <div className="upload-area__icon"><MdCloudUpload /></div>
                                        <p className="upload-area__title">Drop images here or click to browse</p>
                                        <p className="upload-area__subtitle">PNG, JPG, WEBP — Max 4 images</p>
                                    </div>
                                )}

                                {images.length > 0 && (
                                    <div className="upload-previews" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
                                        {images.map((src, idx) => (
                                            <div key={idx} className="upload-preview">
                                                <img src={src} alt={`Preview ${idx + 1}`} />
                                                <button
                                                    type="button"
                                                    className="upload-preview__remove"
                                                    onClick={() => removeImage(idx)}
                                                    style={{ opacity: 1 }}
                                                >
                                                    <MdClose />
                                                </button>
                                            </div>
                                        ))}
                                        {/* Empty slots */}
                                        {images.length < 4 && Array.from({ length: 4 - images.length }).map((_, i) => (
                                            <div key={`empty-${i}`} className="upload-preview" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', opacity: 0.3 }} onClick={() => fileInputRef.current?.click()}>
                                                <MdImage size={24} style={{ color: 'var(--color-text-muted)' }} />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Submit */}
                        <button
                            id="add-product-submit"
                            type="submit"
                            className="btn btn--primary btn--lg"
                            disabled={loading}
                            style={{ width: '100%' }}
                        >
                            {loading ? (
                                <><span className="spinner" style={{ borderColor: 'rgba(10,10,10,0.3)', borderTopColor: '#0a0a0a' }} /> Publishing…</>
                            ) : (
                                <><MdAddBox size={18} /> Publish Product</>
                            )}
                        </button>
                        <button
                            type="button"
                            className="btn btn--secondary"
                            style={{ width: '100%' }}
                            onClick={() => router.back()}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </form>
        </DashboardLayout>
    );
}
