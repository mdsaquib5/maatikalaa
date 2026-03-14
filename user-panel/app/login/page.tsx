'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/store/useAuth';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { FiArrowRight, FiMail, FiLock } from 'react-icons/fi';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { setAuth } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post('/user/login', { email, password });
            setAuth(res.data.user);
            toast.success('Welcome back!');
            router.push('/');
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="auth-page" style={{ 
            minHeight: '100vh', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            padding: '20px', 
            background: 'var(--color-bg-primary)',
            backgroundImage: 'linear-gradient(rgba(10, 10, 10, 0.8), rgba(10, 10, 10, 0.9)), url("/hero-bg-2.webp")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed'
        }}>
            <div className="auth-container" style={{ maxWidth: '480px', width: '100%', position: 'relative', zIndex: 2 }}>
                
                {/* Logo Area */}
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <Link href="/">
                        <img src="/logo.png" alt="Maatikalaa" style={{ height: '50px', marginBottom: '24px', display: 'inline-block' }} />
                    </Link>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--color-text-heading)', letterSpacing: '-1px' }}>Welcome Back</h1>
                    <p style={{ color: 'var(--color-text-body)', fontSize: '1rem', marginTop: '8px' }}>Sign in to continue your artisan journey.</p>
                </div>

                {/* Glass Card */}
                <div style={{ 
                    background: 'var(--color-glass-bg)', 
                    backdropFilter: 'blur(24px) saturate(150%)', 
                    border: '1px solid var(--color-glass-border)', 
                    borderRadius: '24px', 
                    padding: '48px',
                    boxShadow: '0 24px 64px rgba(0,0,0,0.4)'
                }}>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
                        <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <label style={{ color: 'var(--color-text-heading)', fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.5px' }}>EMAIL ADDRESS</label>
                            <div style={{ position: 'relative' }}>
                                <FiMail style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                                <input 
                                    type="email" 
                                    style={{ 
                                        width: '100%', 
                                        background: 'rgba(255, 255, 255, 0.03)', 
                                        border: '1px solid rgba(255, 255, 255, 0.1)', 
                                        borderRadius: '12px', 
                                        padding: '14px 18px 14px 48px', 
                                        color: '#fff', 
                                        outline: 'none',
                                        transition: 'all 0.3s ease'
                                    }}
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <label style={{ color: 'var(--color-text-heading)', fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.5px' }}>PASSWORD</label>
                            <div style={{ position: 'relative' }}>
                                <FiLock style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                                <input 
                                    type="password" 
                                    style={{ 
                                        width: '100%', 
                                        background: 'rgba(255, 255, 255, 0.03)', 
                                        border: '1px solid rgba(255, 255, 255, 0.1)', 
                                        borderRadius: '12px', 
                                        padding: '14px 18px 14px 48px', 
                                        color: '#fff', 
                                        outline: 'none',
                                        transition: 'all 0.3s ease'
                                    }}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading}
                            style={{ 
                                background: 'transparent', 
                                color: 'var(--color-accent-primary)', 
                                border: '1px solid var(--color-accent-primary)',
                                borderRadius: '12px', 
                                padding: '16px', 
                                fontWeight: 700, 
                                cursor: 'pointer', 
                                marginTop: '10px', 
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '12px',
                                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                            }}
                        >
                            {loading ? 'AUTHENTICATING...' : (
                                <>
                                    SIGN IN <FiArrowRight />
                                </>
                            )}
                        </button>
                    </form>

                    <div style={{ textAlign: 'center', marginTop: '32px', paddingTop: '32px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                        <p style={{ color: 'var(--color-text-body)', fontSize: '0.95rem' }}>
                            New to the studio? <Link href="/signup" style={{ color: 'var(--color-accent-primary)', fontWeight: 600, textDecoration: 'none' }}>Create Account</Link>
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}
