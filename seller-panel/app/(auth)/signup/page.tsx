'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    MdEmail, MdLock, MdPerson, MdVisibility, MdVisibilityOff,
    MdStorefront, MdError, MdArrowForward
} from 'react-icons/md';
import { useSellerAuth } from '@/store/useSellerAuth';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function SignupPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { setAuth } = useSellerAuth();
    const router = useRouter();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        if (!name || !email || !phone || !password || !confirm) {
            setError('Please fill in all fields.');
            return;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }
        if (password !== confirm) {
            setError('Passwords do not match.');
            return;
        }
        
        setLoading(true);
        try {
            const response = await api.post('/seller/signup', { name, email, password, phone });
            
            if (response.data.success) {
                setAuth(response.data.seller);
                toast.success('Account created successfully!');
                router.replace('/overview');
            } else {
                setError(response.data.message || 'Signup failed');
                toast.error(response.data.message || 'Signup failed');
            }
        } catch (err: any) {
            const msg = err.response?.data?.message || 'Something went wrong';
            setError(msg);
            toast.error(msg);
            console.error('Signup error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-page__bg">
                <div className="auth-page__bg-orb auth-page__bg-orb--1" />
                <div className="auth-page__bg-orb auth-page__bg-orb--2" />
            </div>

            <div className="auth-card" style={{ maxWidth: '500px' }}>
                <div className="auth-logo">
                    <span className="auth-logo__text">Maatikala</span>
                    <span className="auth-logo__dot" />
                </div>

                <div style={{ marginBottom: '12px' }}>
                    <span className="auth-badge">
                        <MdStorefront size={12} />
                        Become a Seller
                    </span>
                </div>

                <h1 className="auth-title">Create account</h1>
                <p className="auth-subtitle">Join Maatikala and start selling your handcraft products.</p>

                {error && (
                    <div className="auth-error" style={{ marginBottom: '16px' }}>
                        <MdError />
                        {error}
                    </div>
                )}

                <form className="auth-form" onSubmit={handleSubmit}>
                    {/* Name */}
                    <div className="auth-form__group">
                        <label className="auth-form__label" htmlFor="signup-name">Full Name</label>
                        <div className="auth-form__input-wrap">
                            <span className="auth-form__input-icon"><MdPerson /></span>
                            <input
                                id="signup-name"
                                type="text"
                                autoComplete="name"
                                className="auth-form__input"
                                placeholder="Arjun Mehra"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div className="auth-form__group">
                        <label className="auth-form__label" htmlFor="signup-email">Email Address</label>
                        <div className="auth-form__input-wrap">
                            <span className="auth-form__input-icon"><MdEmail /></span>
                            <input
                                id="signup-email"
                                type="email"
                                autoComplete="email"
                                className="auth-form__input"
                                placeholder="you@example.com"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    {/* Phone */}
                    <div className="auth-form__group">
                        <label className="auth-form__label" htmlFor="signup-phone">Phone Number</label>
                        <div className="auth-form__input-wrap">
                            <span className="auth-form__input-icon"><MdArrowForward /></span>
                            <input
                                id="signup-phone"
                                type="tel"
                                autoComplete="tel"
                                className="auth-form__input"
                                placeholder="+91 98765 43210"
                                value={phone}
                                onChange={e => setPhone(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div className="auth-form__group">
                        <label className="auth-form__label" htmlFor="signup-password">Password</label>
                        <div className="auth-form__input-wrap">
                            <span className="auth-form__input-icon"><MdLock /></span>
                            <input
                                id="signup-password"
                                type={showPass ? 'text' : 'password'}
                                autoComplete="new-password"
                                className="auth-form__input"
                                placeholder="Min. 6 characters"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                className="auth-form__eye-toggle"
                                onClick={() => setShowPass(s => !s)}
                                tabIndex={-1}
                            >
                                {showPass ? <MdVisibilityOff /> : <MdVisibility />}
                            </button>
                        </div>
                    </div>

                    {/* Confirm Password */}
                    <div className="auth-form__group">
                        <label className="auth-form__label" htmlFor="signup-confirm">Confirm Password</label>
                        <div className="auth-form__input-wrap">
                            <span className="auth-form__input-icon"><MdLock /></span>
                            <input
                                id="signup-confirm"
                                type={showConfirm ? 'text' : 'password'}
                                autoComplete="new-password"
                                className="auth-form__input"
                                placeholder="Repeat password"
                                value={confirm}
                                onChange={e => setConfirm(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                className="auth-form__eye-toggle"
                                onClick={() => setShowConfirm(s => !s)}
                                tabIndex={-1}
                            >
                                {showConfirm ? <MdVisibilityOff /> : <MdVisibility />}
                            </button>
                        </div>
                    </div>

                    <button
                        id="signup-submit"
                        type="submit"
                        className="auth-submit-btn"
                        disabled={loading}
                    >
                        {loading ? <span className="spinner" /> : (
                            <>Create Account <MdArrowForward /></>
                        )}
                    </button>
                </form>

                <div className="auth-divider" style={{ marginTop: '24px', marginBottom: '16px' }}>
                    <span>or</span>
                </div>

                <p className="auth-redirect">
                    Already have an account?{' '}
                    <Link href="/login">Sign in</Link>
                </p>
            </div>
        </div>
    );
}
