import Image from "next/image";
import { FiUsers, FiLayers, FiBriefcase, FiCheckCircle } from "react-icons/fi";
import Link from "next/link";

const OurCraftPage = () => {
    return (
        <main className="craft-page">
            <div className="container">

                {/* Hero Section */}
                <section className="craft-hero">
                    <span className="craft-hero__tag">Grow with Maatikalaa</span>
                    <h1 className="craft-hero__title">Let’s Build a Legacy Together.</h1>
                    <p className="craft-hero__desc">
                        Whether you are an artisan, a visionary entrepreneur, or a strategic business owner,
                        there is a place for you in the Maatikalaa journey. Start your business journey with us today.
                    </p>
                </section>

                {/* Partnership Grid */}
                <div className="partner-grid">
                    {/* Seller Tier */}
                    <div className="partner-card">
                        <div className="partner-card__icon"><FiUsers /></div>
                        <h2 className="partner-card__title">Become a Seller</h2>
                        <p className="partner-card__text">
                            "Aap seller ban sakte ho." Join our platform as an independent artisan.
                            Showcase your unique handcrafted muds ware to a global audience
                            leveraging our established brand and logistics.
                        </p>
                        <Link href="/about" className="partner-card__btn">Join as Artisan</Link>
                    </div>

                    {/* Franchise Tier */}
                    <div className="partner-card">
                        <div className="partner-card__icon"><FiLayers /></div>
                        <h2 className="partner-card__title">Our Franchise</h2>
                        <p className="partner-card__text">
                            "Make with your franchise." Launch a physical Maatikalaa studio in your city.
                            We provide the inventory, the design aesthetic, and the operational blueprint
                            for your success.
                        </p>
                        <Link href="/about" className="partner-card__btn">Request Details</Link>
                    </div>

                    {/* Business Tier */}
                    <div className="partner-card">
                        <div className="partner-card__icon"><FiBriefcase /></div>
                        <h2 className="partner-card__title">Start a Business</h2>
                        <p className="partner-card__text">
                            "Start business with us." For B2B partners, hospitality groups, and
                            corporate gifting. Partner with us for custom production and bulk supply
                            needs.
                        </p>
                        <Link href="/about" className="partner-card__btn">Partner with Us</Link>
                    </div>
                </div>

                {/* Benefits Section */}
                <section className="benefits-section">
                    <div className="container">
                        <div className="benefits-grid">
                            <div className="benefits-content">
                                <span className="craft-hero__tag badge-sm">Why Partner?</span>
                                <h2 className="about-content__title section-title-sm">Crafting Profit with Purpose.</h2>

                                <div className="benefits-list">
                                    <div className="benefit-item">
                                        <div className="benefit-item__check"><FiCheckCircle /></div>
                                        <div>
                                            <h3 className="benefit-item__title">Established Trust</h3>
                                            <p className="benefit-item__text">Leverage the Maatikalaa name and our reputation for uncompromising quality.</p>
                                        </div>
                                    </div>
                                    <div className="benefit-item">
                                        <div className="benefit-item__check"><FiCheckCircle /></div>
                                        <div>
                                            <h3 className="benefit-item__title">Scale your Passion</h3>
                                            <p className="benefit-item__text">From a local workshop to a national brand—we help you scale your operations.</p>
                                        </div>
                                    </div>
                                    <div className="benefit-item">
                                        <div className="benefit-item__check"><FiCheckCircle /></div>
                                        <div>
                                            <h3 className="benefit-item__title">Operational Support</h3>
                                            <p className="benefit-item__text">Marketing, logistics, and design guidance—we are with you at every step.</p>
                                        </div>
                                    </div>
                                </div>

                                <Link href="/about" className="benefits-cta-btn">Know more about us</Link>
                            </div>

                            <div className="benefits-image-column text-end">
                                <Image
                                    src="/hero-bg-2.webp"
                                    alt="Pottery on wheel"
                                    width={400}
                                    height={500}
                                    className="craft-float-img rounded-30 object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
};

export default OurCraftPage;
