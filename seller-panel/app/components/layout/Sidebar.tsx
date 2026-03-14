'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    MdDashboard, MdAddBox, MdInventory, MdShoppingBag,
    MdChevronLeft, MdChevronRight, MdLogout, MdStorefront
} from 'react-icons/md';
import { useSellerAuth } from '@/store/useSellerAuth';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import toast from 'react-hot-toast';

interface SidebarProps {
    collapsed: boolean;
    mobileOpen: boolean;
    onCollapse: () => void;
    onMobileClose: () => void;
}

const NAV_ITEMS = [
    {
        label: 'MANAGEMENT',
        items: [
            { href: '/overview', icon: MdDashboard, text: 'Overview' },
            { href: '/add-product', icon: MdAddBox, text: 'Add Product' },
            { href: '/products', icon: MdInventory, text: 'All Products' },
            { href: '/orders', icon: MdShoppingBag, text: 'All Orders' },
        ],
    },
];

export default function Sidebar({ collapsed, mobileOpen, onCollapse, onMobileClose }: SidebarProps) {
    const pathname = usePathname();
    const router = useRouter();
    const { seller, clearAuth } = useSellerAuth();

    const handleLogout = async () => {
        try {
            await api.post('/seller/logout');
            clearAuth();
            toast.success('Logged out successfully');
            router.push('/login');
        } catch (err) {
            clearAuth();
            router.push('/login');
        }
    };

    const initials = seller?.name
        ? seller.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
        : 'S';

    const sidebarClass = [
        'sidebar',
        collapsed ? 'sidebar--collapsed' : '',
        mobileOpen ? 'sidebar--mobile-open' : '',
    ].filter(Boolean).join(' ');

    return (
        <>
            {/* Mobile backdrop */}
            {mobileOpen && (
                <div className="sidebar-overlay sidebar-overlay--visible" onClick={onMobileClose} />
            )}

            <aside className={sidebarClass}>
                {/* Header */}
                <div className="sidebar__header">
                    <div className="sidebar__logo">
                        <div className="sidebar__logo-icon">
                            <MdStorefront />
                        </div>
                        <span className="sidebar__logo-text">Maatikala</span>
                    </div>
                    <button
                        className="sidebar__collapse-btn"
                        onClick={onCollapse}
                        title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                    >
                        {collapsed ? <MdChevronRight /> : <MdChevronLeft />}
                    </button>
                </div>

                {/* Navigation */}
                <nav className="sidebar__nav">
                    {NAV_ITEMS.map(section => (
                        <div key={section.label} className="sidebar__nav-section">
                            <span className="sidebar__nav-section-label">{section.label}</span>
                            {section.items.map(item => {
                                const Icon = item.icon;
                                const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                                return (
                                    <Link key={item.href} href={item.href} onClick={onMobileClose}>
                                        <button
                                            className={`sidebar__nav-link ${isActive ? 'sidebar__nav-link--active' : ''}`}
                                            title={item.text}
                                        >
                                            <span className="sidebar__nav-icon"><Icon /></span>
                                            <span className="sidebar__nav-text">{item.text}</span>
                                            <span className="sidebar__tooltip">{item.text}</span>
                                        </button>
                                    </Link>
                                );
                            })}
                        </div>
                    ))}
                </nav>

                {/* Footer — Seller details */}
                <div className="sidebar__footer">
                    <div className="sidebar__seller">
                        <div className="sidebar__seller-avatar">
                            {initials}
                        </div>
                        <div className="sidebar__seller-info">
                            <p className="sidebar__seller-name">{seller?.name ?? 'Seller'}</p>
                            <p className="sidebar__seller-role">Seller Project</p>
                        </div>
                    </div>
                    <button
                        className="sidebar__nav-link"
                        style={{ marginTop: '8px', color: 'var(--color-error)', width: '100%' }}
                        onClick={handleLogout}
                        title="Logout"
                    >
                        <span className="sidebar__nav-icon"><MdLogout /></span>
                        <span className="sidebar__nav-text">Logout</span>
                        <span className="sidebar__tooltip">Logout</span>
                    </button>
                </div>
            </aside>
        </>
    );
}
