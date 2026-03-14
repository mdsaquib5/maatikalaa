'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
    MdEmail, MdLock, MdVisibility, MdVisibilityOff, 
    MdOutlinePerson, MdError, MdArrowForward, MdPersonOutline
} from 'react-icons/md';
import { useAuth } from '@/store/useAuth';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function SignupPage() {
    const [name, setName] = useState('');
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
        if (!name || !email || !password) {
            setError('Please fill in all fields.');
            return;
        }

        setLoading(true);
        try {
            // Corrected endpoint to match server routes
            const res = await api.post('/user/signup', { name, email, password });
            setAuth(res.data.user);
            toast.success('Account created! Welcome to Maatikala.');
            router.push('/');
        } catch (err: any) {
            const msg = err.response?.data?.message || 'Registration failed';
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
                        Join Maatikala
                    </span>
                </div>

                <h1 className="auth-title">Create Account</h1>
                <p className="auth-subtitle">Join our community of art and craft lovers.</p>

                {error && (
                    <div className="auth-error mb-24">
                        <MdError />
                        {error}
                    </div>
                )}

                <form className="auth-form" onSubmit={handleSubmit}>
                    {/* Name */}
                    <div className="auth-form__group">
                        <label className="auth-form__label" htmlFor="signup-name">Full Name</label>
                        <div className="auth-form__input-wrap">
                            <span className="auth-form__input-icon"><MdPersonOutline /></span>
                            <input
                                id="signup-name"
                                type="text"
                                className="auth-form__input"
                                placeholder="John Doe"
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
                                aria-label={showPass ? 'Hide password' : 'Show password'}
                            >
                                {showPass ? <MdVisibilityOff /> : <MdVisibility />}
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
                            <>Get Started <MdArrowForward /></>
                        )}
                    </button>
                </form>

                <div className="auth-divider mt-32">
                    <span className="px-12">or</span>
                </div>

                <p className="auth-redirect">
                    Already have an account?{' '}
                    <Link href="/login">Sign In</Link>
                </p>
            </div>
        </div>
    );
}
