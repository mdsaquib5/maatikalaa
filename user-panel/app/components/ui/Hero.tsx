"use client";

import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import { GiAmphora as GiPottery } from "react-icons/gi";
import Link from "next/link";

// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-fade";

const Hero = () => {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        // Trigger entrance animations after a short delay
        const timer = setTimeout(() => setIsLoaded(true), 100);
        return () => clearTimeout(timer);
    }, []);

    const slides = [
        { id: 1, image: "/hero-bg-1.webp" },
        { id: 2, image: "/hero-bg-2.webp" },
        { id: 3, image: "/hero-bg-3.webp" },
    ];


    return (
        <section className={`hero ${isLoaded ? "hero--loaded" : ""}`}>
            <div className="hero__bg-slider">
                <Swiper
                    modules={[Autoplay, EffectFade]}
                    effect="fade"
                    fadeEffect={{ crossFade: true }}
                    autoplay={{
                        delay: 5000,
                        disableOnInteraction: false,
                    }}
                    loop={true}
                    speed={2000}
                    className="hero__swiper"
                >
                    {slides.map((slide) => (
                        <SwiperSlide key={slide.id}>
                            <div
                                className="hero__bg-image"
                                style={{ backgroundImage: `url(${slide.image})` }}
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
                <div className="hero__bg-overlay"></div>
            </div>

            <div className="hero__content container">
                <div className="hero__brand-chip">
                    <span className="hero__brand-icon">
                        <GiPottery />
                    </span>
                    <span>Maatikalaa.</span>
                </div>

                <h1 className="hero__title">
                    Timeless Craft, <br /> Born from the Earth.
                </h1>

                <p className="hero__text">
                    Discover Maatikalaa, where traditional pottery meets modern aesthetics.
                    Each piece is handcrafted with raw passion, preserving the soul of
                    ancient clay while fitting perfectly into your contemporary lifestyle.
                    Our collections represent a journey through texture, fire, and form,
                    bringing the warmth of handcrafted muds ware into your home.
                </p>

                <Link
                    href="/shop"
                    className="hero__scroll-btn"
                    aria-label="View Shop"
                >
                    <div className="hero__mouse">
                        <div className="hero__mouse-wheel"></div>
                    </div>
                    <span className="hero__scroll-text">Explore Shop</span>
                </Link>
            </div>
        </section>
    );
};

export default Hero;