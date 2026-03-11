"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
    { label: "Home", href: "/" },
    { label: "Shop", href: "/shop" },
    { label: "Craft", href: "/craft" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
];

const Header = () => {
    const pathname = usePathname();
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [clickedLink, setClickedLink] = useState<string | null>(null);
    const [bounceClass, setBounceClass] = useState("");
    const lastScrollY = useRef(0);
    const bounceTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

    /* ── Scroll handler ─────────────────────────── */
    useEffect(() => {
        const onScroll = () => {
            const y = window.scrollY;

            /* scrolled state — activates glass bg */
            setScrolled(y > 40);

            /* bounce effect on direction change */
            const dir = y > lastScrollY.current ? "down" : "up";
            lastScrollY.current = y;

            if (bounceTimeout.current) clearTimeout(bounceTimeout.current);
            setBounceClass(`header-bounce-${dir}`);
            bounceTimeout.current = setTimeout(() => setBounceClass(""), 550);
        };

        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    /* ── Lock body when mobile menu is open ─────── */
    useEffect(() => {
        document.body.style.overflow = menuOpen ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [menuOpen]);

    /* ── Click ripple ───────────────────────────── */
    const handleNavClick = (href: string) => {
        setClickedLink(href);
        setMenuOpen(false);
        setTimeout(() => setClickedLink(null), 600);
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

            {/* ── Mobile Drawer ── */}
            <div className={`header__drawer ${menuOpen ? "header__drawer--open" : ""}`} aria-hidden={!menuOpen}>
                <nav aria-label="Mobile navigation">
                    <ul className="header__drawer-list">
                        {navLinks.map(({ label, href }, i) => (
                            <li
                                key={href}
                                className="header__drawer-item"
                                style={{ animationDelay: `${i * 0.07}s` }}
                            >
                                <Link
                                    href={href}
                                    className={`header__drawer-link ${pathname === href ? "header__drawer-link--active" : ""}`}
                                    onClick={() => handleNavClick(href)}
                                >
                                    <span className="header__drawer-num">0{i + 1}</span>
                                    {label}
                                </Link>
                            </li>
                        ))}
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