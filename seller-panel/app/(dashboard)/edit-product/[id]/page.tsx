'use client';

import { useState, useRef, FormEvent, DragEvent, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import { useSellerAuth } from '@/store/useSellerAuth';
import api from '@/lib/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { MdCloudUpload, MdClose, MdSave, MdImage, MdArrowBack } from 'react-icons/md';

const SIZES = ['S', 'M', 'L', 'XL', 'XXL', 'FREE SIZE'] as const;

export default function EditProductPage() {
    const { isAuthenticated } = useSellerAuth();
    const router = useRouter();
    const { id } = useParams();
    const queryClient = useQueryClient();

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('');
    const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [existingImages, setExistingImages] = useState<{ url: string; public_id: string }[]>([]);
    const [hotProduct, setHotProduct] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Fetch product data
    const { data: productData, isLoading: isProductLoading } = useQuery({
        queryKey: ['product', id],
        queryFn: async () => {
            const res = await api.get(`/products/get-product/${id}`);
            return res.data.product;
        },
        enabled: !!id
    });

    useEffect(() => {
        if (productData) {
            setName(productData.productName);
            setDescription(productData.description);
            setPrice(productData.price.toString());
            setStock(productData.stock.toString());
            setSelectedSizes(productData.sizes || []);
            setHotProduct(productData.hotProduct || false);
            setExistingImages(productData.images || []);
        }
    }, [productData]);

    const mutation = useMutation({
        mutationFn: async (formData: FormData) => {
            const res = await api.put(`/products/update-product/${id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return res.data;
        },
        onSuccess: () => {
            toast.success('Product updated successfully!');
            queryClient.invalidateQueries({ queryKey: ['seller-products'] });
            queryClient.invalidateQueries({ queryKey: ['product', id] });
            router.push('/products');
        },
        onError: (err: any) => {
            const msg = err.response?.data?.message || 'Failed to update product';
            toast.error(msg);
            console.error('Update product error:', err);
        }
    });

    const toggleSize = (s: string) => {
        setSelectedSizes(prev =>
            prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]
        );
    };

    const processFiles = (files: FileList | null) => {
        if (!files) return;
        const remaining = 4 - imageFiles.length;
        if (remaining <= 0) {
            toast.error('Max 4 images allowed.');
            return;
        }
        
        const toProcess = Array.from(files).slice(0, remaining);
        toProcess.forEach(file => {
            if (!file.type.startsWith('image/')) return;
            if (file.size > 2 * 1024 * 1024) {
                toast.error(`${file.name} is larger than 2MB.`);
                return;
            }
            
            setImageFiles(prev => [...prev, file]);
            
            const reader = new FileReader();
            reader.onload = e => {
                setImagePreviews(prev => [...prev, e.target?.result as string]);
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

    const removeNewImage = (idx: number) => {
        setImageFiles(prev => prev.filter((_, i) => i !== idx));
        setImagePreviews(prev => prev.filter((_, i) => i !== idx));
    };

    const validate = () => {
        const errs: Record<string, string> = {};
        if (!name.trim()) errs.name = 'Product name is required.';
        if (!description.trim()) errs.description = 'Description is required.';
        if (!price || isNaN(Number(price)) || Number(price) <= 0) errs.price = 'Enter a valid price.';
        if (!stock || isNaN(Number(stock)) || Number(stock) < 0) errs.stock = 'Enter a valid stock number.';
        if (selectedSizes.length === 0) errs.sizes = 'Select at least one size.';
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        
        const formData = new FormData();
        formData.append('productName', name.trim());
        formData.append('description', description.trim());
        formData.append('price', price);
        formData.append('stock', stock);
        formData.append('hotProduct', String(hotProduct));
        
        selectedSizes.forEach(size => {
            formData.append('sizes', size);
        });
        
        imageFiles.forEach(file => {
            formData.append('images', file);
        });
        
        mutation.mutate(formData);
    };

    if (!isAuthenticated) return null;
    if (isProductLoading) return <DashboardLayout pageTitle="Edit Product" pageCrumb="...">Loading...</DashboardLayout>;

    const loading = mutation.isPending;

    return (
        <DashboardLayout pageTitle="Edit Product" pageCrumb={`Dashboard • Products • Edit`}>
            <div className="section-header">
                <div className="section-header__left">
                    <h2 className="section-header__title">Edit Product</h2>
                    <p className="section-header__subtitle">Modify the details of your handcraft product.</p>
                </div>
                <button className="btn btn--secondary btn--sm" onClick={() => router.back()}>
                    <MdArrowBack /> Back to Products
                </button>
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
                                <div className="form-group">
                                    <label className="form-label">Product Name *</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={name}
                                        onChange={e => setName(e.target.value)}
                                        maxLength={120}
                                    />
                                    {errors.name && <span className="form-error">{errors.name}</span>}
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Description *</label>
                                    <textarea
                                        className="form-textarea"
                                        value={description}
                                        onChange={e => setDescription(e.target.value)}
                                        rows={4}
                                        maxLength={500}
                                    />
                                    <span className="form-helper">{description.length}/500</span>
                                    {errors.description && <span className="form-error">{errors.description}</span>}
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                    <div className="form-group">
                                        <label className="form-label">Price (₹) *</label>
                                        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                                            <span style={{ position: 'absolute', left: '14px', color: 'var(--color-accent-primary)', fontWeight: 700 }}>₹</span>
                                            <input
                                                type="number"
                                                className="form-input"
                                                value={price}
                                                onChange={e => setPrice(e.target.value)}
                                                style={{ paddingLeft: '32px' }}
                                            />
                                        </div>
                                        {errors.price && <span className="form-error">{errors.price}</span>}
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Stock *</label>
                                        <input
                                            type="number"
                                            className="form-input"
                                            value={stock}
                                            onChange={e => setStock(e.target.value)}
                                        />
                                        {errors.stock && <span className="form-error">{errors.stock}</span>}
                                    </div>
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
                                        <label key={s}>
                                            <span
                                                className={`size-option-label ${selectedSizes.includes(s) ? 'size-option-label--selected' : ''}`}
                                                onClick={() => toggleSize(s)}
                                            >
                                                {s}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                                {errors.sizes && <span className="form-error">{errors.sizes}</span>}
                            </div>
                        </div>

                        {/* Options Card */}
                        <div className="card">
                            <div className="card__header">
                                <h3 className="card__title">Promotion Options</h3>
                            </div>
                            <div className="card__body">
                                <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                                    <input
                                        type="checkbox"
                                        checked={hotProduct}
                                        onChange={e => setHotProduct(e.target.checked)}
                                        style={{ width: '18px', height: '18px', accentColor: 'var(--color-accent-primary)' }}
                                    />
                                    <div>
                                        <p style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-text-heading)' }}>Mark as Featured</p>
                                        <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Hot products appear in special sections on the homepage.</p>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Right Column — Images */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div className="card">
                            <div className="card__header">
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                    <h3 className="card__title">Replace Images</h3>
                                    <p style={{ fontSize: '0.68rem', color: 'var(--color-error)', fontWeight: 600 }}>* Leave empty to keep existing images</p>
                                </div>
                            </div>
                            <div className="card__body">
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
                                    <p className="upload-area__subtitle">Max 4 images (Less than 2MB each)</p>
                                </div>

                                {/* New Image Previews */}
                                {imagePreviews.length > 0 && (
                                    <div style={{ marginTop: '16px' }}>
                                        <p style={{ fontSize: '0.75rem', fontWeight: 700, marginBottom: '8px', color: 'var(--color-accent-primary)' }}>New Images to Upload:</p>
                                        <div className="upload-previews" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
                                            {imagePreviews.map((src, idx) => (
                                                <div key={idx} className="upload-preview">
                                                    <img src={src} alt={`New ${idx + 1}`} />
                                                    <button type="button" className="upload-preview__remove" onClick={() => removeNewImage(idx)}><MdClose /></button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Existing Images */}
                                {existingImages.length > 0 && imagePreviews.length === 0 && (
                                    <div style={{ marginTop: '16px' }}>
                                        <p style={{ fontSize: '0.75rem', fontWeight: 700, marginBottom: '8px' }}>Current Images:</p>
                                        <div className="upload-previews" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
                                            {existingImages.map((img, idx) => (
                                                <div key={idx} className="upload-preview" style={{ opacity: 0.7 }}>
                                                    <img src={img.url} alt={`Existing ${idx + 1}`} />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn btn--primary btn--lg"
                            disabled={loading}
                            style={{ width: '100%' }}
                        >
                            {loading ? 'Updating...' : <><MdSave size={18} /> Save Changes</>}
                        </button>
                    </div>
                </div>
            </form>
        </DashboardLayout>
    );
}
