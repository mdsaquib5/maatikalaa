import React from "react";
import Image from "next/image";
import Link from "next/link";

const AboutPage = () => {
    return (
        <main className="about-page">

            {/* Hero Section */}
            <section className="about-hero">
                <div className="container">
                    <h1 className="about-hero__title">Our Story</h1>
                </div>
            </section>

            {/* Philosophy Section */}
            <section className="about-section">
                <div className="container">
                    <div className="about-grid">
                        <div className="about-image-wrapper">
                            <Image
                                src="/hero-bg-2.webp"
                                alt="Raw clay on the wheel"
                                fill
                                className="about-image"
                            />
                        </div>
                        <div className="about-content">
                            <span className="about-content__tag">Our Philosophy</span>
                            <h2 className="about-content__title">Born from the Earth, Shaped by the Soul.</h2>
                            <p className="about-content__text">
                                Maatikalaa was founded on a simple belief: that the objects we surround ourselves with
                                should tell a story. In a world of mass production, we return to the basics—raw earth,
                                water, fire, and human touch.
                            </p>
                            <p className="about-content__text">
                                Each piece that leaves our studio is unique. We embrace the imperfections of the clay,
                                the unpredictable dance of the kiln, and the individual spirit of the artisan. Our work
                                is not just about pottery; it’s about slow living and the preservation of heritage.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Process Section */}
            <section className="process-section">
                <div className="container">
                    <div className="text-center mb-60">
                        <span className="about-content__tag">The Craft</span>
                        <h2 className="about-content__title">Our Quiet Process</h2>
                    </div>

                    <div className="process-grid">
                        <div className="process-card">
                            <span className="process-card__number">01</span>
                            <h3 className="process-card__title">Sourcing Earth</h3>
                            <p className="process-card__text">
                                We source the finest natural clays, rich in mineral character, ensuring
                                a foundation that is both durable and beautiful.
                            </p>
                        </div>

                        <div className="process-card">
                            <span className="process-card__number">02</span>
                            <h3 className="process-card__title">The Wheel</h3>
                            <p className="process-card__text">
                                Every curve is shaped by hand on a rhythmic wheel, capturing the energy
                                and focus of the craftsman in that precise moment.
                            </p>
                        </div>

                        <div className="process-card">
                            <span className="process-card__number">03</span>
                            <h3 className="process-card__title">The Kiln</h3>
                            <p className="process-card__text">
                                Fired at high temperatures, the clay transforms into stone. Our glazes
                                are proprietary recipes, inspired by natural landscapes.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Founder Quote */}
            <section className="about-section">
                <div className="container">
                    <div className="founder-section">
                        <blockquote className="founder-quote">
                            "Pottery is the art of making something eternal out of something as humble as mud.
                            It reminds us that beauty doesn't need to be loud to be powerful."
                        </blockquote>
                        <span className="founder-name">The Lead Artisan</span>
                        <span className="founder-role">Maatikalaa Studio</span>
                    </div>
                </div>
            </section>
            {/* About CTA */}
            <section className="about-cta">
                <div className="container">
                    <div className="about-cta__content">
                        <h2 className="about-cta__title">Start Your Journey</h2>
                        <p className="about-cta__text">Have questions or want to visit our studio? We'd love to hear from you.</p>
                        <Link href="/contact" className="about-cta__btn">Contact Us</Link>
                    </div>
                </div>
            </section>

        </main>
    );
};

export default AboutPage;
