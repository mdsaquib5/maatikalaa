'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/store/useAuth';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function SignupPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { setAuth } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post('/user/register', { name, email, password });
            setAuth(res.data.user);
            toast.success('Account created! Welcome to Maatikala.');
            router.push('/');
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', background: 'var(--color-bg-dark)' }}>
            <div className="auth-card" style={{ maxWidth: '400px', width: '100%', background: 'rgba(20,20,20,0.4)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', padding: '40px' }}>
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>Create Account</h1>
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>Join our artisan community today.</p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div className="form-group">
                        <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem', marginBottom: '8px', fontWeight: 600 }}>FULL NAME</label>
                        <input 
                            type="text" 
                            className="auth-input"
                            style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '14px 18px', color: '#fff', outline: 'none' }}
                            placeholder="John Doe"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem', marginBottom: '8px', fontWeight: 600 }}>EMAIL ADDRESS</label>
                        <input 
                            type="email" 
                            className="auth-input"
                            style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '14px 18px', color: '#fff', outline: 'none' }}
                            placeholder="name@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem', marginBottom: '8px', fontWeight: 600 }}>PASSWORD</label>
                        <input 
                            type="password" 
                            className="auth-input"
                            style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '14px 18px', color: '#fff', outline: 'none' }}
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        style={{ background: '#fff', color: '#000', borderRadius: '12px', padding: '14px', fontWeight: 700, border: 'none', cursor: 'pointer', marginTop: '12px', transition: 'all 0.3s ease' }}
                    >
                        {loading ? 'Creating Account...' : 'Get Started'}
                    </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '24px' }}>
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>
                        Already have an account? <Link href="/login" style={{ color: '#fff', fontWeight: 600, textDecoration: 'none' }}>Sign In</Link>
                    </p>
                </div>
            </div>
        </main>
    );
}
