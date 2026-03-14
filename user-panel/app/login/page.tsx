'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
    MdEmail, MdLock, MdVisibility, MdVisibilityOff, 
    MdOutlinePerson, MdError, MdArrowForward 
} from 'react-icons/md';
import { useAuth } from '@/store/useAuth';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { setAuth } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        if (!email || !password) {
            setError('Please fill in all fields.');
            return;
        }

        setLoading(true);
        try {
            const res = await api.post('/user/login', { email, password });
            setAuth(res.data.user);
            toast.success('Welcome back!');
            router.push('/');
        } catch (err: any) {
            const msg = err.response?.data?.message || 'Login failed';
            setError(msg);
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            {/* Background orbs */}
            <div className="auth-page__bg">
                <div className="auth-page__bg-orb auth-page__bg-orb--1" />
                <div className="auth-page__bg-orb auth-page__bg-orb--2" />
            </div>

            <div className="auth-card">
                {/* Logo */}
                <div className="auth-logo">
                    <span className="auth-logo__text">Maatikala</span>
                    <span className="auth-logo__dot" />
                </div>

                {/* Badge */}
                <div className="mb-24">
                    <span className="auth-badge">
                        <MdOutlinePerson size={12} />
                        Member Login
                    </span>
                </div>

                <h1 className="auth-title">Welcome back</h1>
                <p className="auth-subtitle">Sign in to explore handcrafted elegance.</p>

                {error && (
                    <div className="auth-error mb-24">
                        <MdError />
                        {error}
                    </div>
                )}

                <form className="auth-form" onSubmit={handleSubmit}>
                    {/* Email */}
                    <div className="auth-form__group">
                        <label className="auth-form__label" htmlFor="login-email">Email Address</label>
                        <div className="auth-form__input-wrap">
                            <span className="auth-form__input-icon"><MdEmail /></span>
                            <input
                                id="login-email"
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

                    {/* Password */}
                    <div className="auth-form__group">
                        <label className="auth-form__label" htmlFor="login-password">Password</label>
                        <div className="auth-form__input-wrap">
                            <span className="auth-form__input-icon"><MdLock /></span>
                            <input
                                id="login-password"
                                type={showPass ? 'text' : 'password'}
                                autoComplete="current-password"
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
                                aria-label={showPass ? 'Hide password' : 'Show password'}
                            >
                                {showPass ? <MdVisibilityOff /> : <MdVisibility />}
                            </button>
                        </div>
                    </div>

                    <button
                        id="login-submit"
                        type="submit"
                        className="auth-submit-btn"
                        disabled={loading}
                    >
                        {loading ? <span className="spinner" /> : (
                            <>Sign In <MdArrowForward /></>
                        )}
                    </button>
                </form>

                <div className="auth-divider mt-32">
                    <span className="px-12">or</span>
                </div>

                <p className="auth-redirect">
                    Don&apos;t have an account?{' '}
                    <Link href="/signup">Create account</Link>
                </p>
            </div>
        </div>
    );
}
