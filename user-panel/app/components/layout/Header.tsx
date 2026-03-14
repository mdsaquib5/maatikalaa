"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/store/useAuth";
import { useCart } from "@/store/useCart";
import toast from "react-hot-toast";
import { FiShoppingCart, FiUser } from "react-icons/fi";

const navLinks = [
    { label: "Home", href: "/" },
    { label: "Shop", href: "/shop" },
    { label: "Craft", href: "/craft" },
    { label: "About", href: "/about" },
];

const Header = () => {
    const pathname = usePathname();
    const { user, isAuthenticated, clearAuth } = useAuth();
    const { items } = useCart();
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [clickedLink, setClickedLink] = useState<string | null>(null);
    const [bounceClass, setBounceClass] = useState("");
    const lastScrollY = useRef(0);
    const bounceTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        const onScroll = () => {
            const y = window.scrollY;
            setScrolled(y > 40);
            const dir = y > lastScrollY.current ? "down" : "up";
            lastScrollY.current = y;
            if (bounceTimeout.current) clearTimeout(bounceTimeout.current);
            setBounceClass(`header-bounce-${dir}`);
            bounceTimeout.current = setTimeout(() => setBounceClass(""), 550);
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        document.body.style.overflow = menuOpen ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [menuOpen]);

    const handleNavClick = (href: string) => {
        setClickedLink(href);
        setMenuOpen(false);
        setTimeout(() => setClickedLink(null), 600);
    };

    const handleLogout = () => {
        clearAuth();
        toast.success("Logged out successfully");
        setMenuOpen(false);
    };

    return (
        <header className={`header ${scrolled ? "header--scrolled" : ""} ${bounceClass}`}>
            <div className="header__inner container">

                {/* ── Logo ── */}
                <Link href="/" className="header__logo" onClick={() => setMenuOpen(false)}>
                    <img
                        src="/logo.png"
                        alt="Maatikalaa Logo"
                        className="header__logo-img"
                    />
                </Link>

                {/* ── Desktop Nav ── */}
                <nav className="header__nav" aria-label="Main navigation">
                    <ul className="header__nav-list">
                        {navLinks.map(({ label, href }) => (
                            <li key={href} className="header__nav-item">
                                <Link
                                    href={href}
                                    className={[
                                        "header__nav-link",
                                        pathname === href ? "header__nav-link--active" : "",
                                        clickedLink === href ? "header__nav-link--clicked" : "",
                                    ].join(" ")}
                                    onClick={() => handleNavClick(href)}
                                >
                                    <span className="header__nav-link-text">{label}</span>
                                    <span className="header__nav-link-underline" aria-hidden="true" />
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className="header__actions">
                    <Link href="/cart" className="header__nav-link header__cart-icon-wrap">
                        <FiShoppingCart size={20} />
                        {items.length > 0 && (
                            <span className="header__cart-badge">
                                {items.length}
                            </span>
                        )}
                    </Link>

                    <div className="header__auth-desktop">
                        {isAuthenticated ? (
                            <div className="header__user-actions">
                                <Link href="/orders" className="header__nav-link" title="My Orders">
                                    <FiUser size={20} />
                                </Link>
                                <button onClick={handleLogout} className="header__nav-link header__logout-btn">
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <Link href="/login" className="header__nav-link">Login</Link>
                        )}
                    </div>

                    {/* ── Hamburger (mobile) ── */}
                    <button
                        className={`header__hamburger ${menuOpen ? "header__hamburger--open" : ""}`}
                        onClick={() => setMenuOpen(prev => !prev)}
                        aria-label="Toggle menu"
                        aria-expanded={menuOpen}
                    >
                        <span /><span /><span />
                    </button>
                </div>
            </div>

            {/* ── Mobile Drawer ── */}
            <div className={`header__drawer ${menuOpen ? "header__drawer--open" : ""}`} aria-hidden={!menuOpen}>
                <nav aria-label="Mobile navigation">
                    <ul className="header__drawer-list">
                        {navLinks.map(({ label, href }, i) => (
                            <li key={href} className="header__drawer-item" style={{ animationDelay: `${i * 0.07}s` }}>
                                <Link href={href} className={`header__drawer-link ${pathname === href ? "header__drawer-link--active" : ""}`} onClick={() => handleNavClick(href)}>
                                    <span className="header__drawer-num">0{i + 1}</span>
                                    {label}
                                </Link>
                            </li>
                        ))}
                        <li className="header__drawer-item" style={{ animationDelay: `${navLinks.length * 0.07}s` }}>
                            <Link href="/cart" className="header__drawer-link" onClick={() => handleNavClick('/cart')}>
                                <span className="header__drawer-num">0{navLinks.length + 1}</span>
                                Cart ({items.length})
                            </Link>
                        </li>
                        <li className="header__drawer-item" style={{ animationDelay: `${(navLinks.length + 1) * 0.07}s` }}>
                            {isAuthenticated ? (
                                <div className="header__drawer-actions">
                                    <Link href="/orders" className="header__drawer-link" onClick={() => handleNavClick('/orders')}>
                                        <span className="header__drawer-num">0{navLinks.length + 2}</span>
                                        My Orders
                                    </Link>
                                    <button onClick={handleLogout} className="header__drawer-link header__logout-btn text-left w-full">
                                        <span className="header__drawer-num">0{navLinks.length + 3}</span>
                                        Logout
                                    </button>
                                </div>
                            ) : (
                                <Link href="/login" className={`header__drawer-link`} onClick={() => handleNavClick("/login")}>
                                    <span className="header__drawer-num">0{navLinks.length + 2}</span>
                                    Login
                                </Link>
                            )}
                        </li>
                    </ul>
                </nav>
            </div>

            {/* ── Mobile overlay ── */}
            {menuOpen && (
                <div className="header__overlay" onClick={() => setMenuOpen(false)} aria-hidden="true" />
            )}
        </header>
    );
};

export default Header;