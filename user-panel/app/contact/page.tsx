import ContactForm from "../components/ui/ContactForm";
import { FiMapPin, FiMail, FiPhone } from "react-icons/fi";

const ContactPage = () => {
    return (
        <main className="contact-page">
            <div className="container">
                <div className="contact-container">

                    {/* Left Side: Info */}
                    <div className="contact-info">
                        <span className="contact-info__tag">Get in Touch</span>
                        <h1 className="contact-info__title">
                            Let&apos;s Craft <br /> Something Together.
                        </h1>
                        <p className="contact-info__desc">
                            Have a custom request or want to visit our studio?
                            We love hearing from fellow ceramic enthusiasts.
                            Drop us a message or reach out through our official channels.
                        </p>

                        <div className="contact-details">
                            <div className="contact-item">
                                <div className="contact-item__icon">
                                    <FiMapPin />
                                </div>
                                <div className="contact-item__content">
                                    <h4>Visit Our Studio</h4>
                                    <p>123 Artisan Lathe, Pottery District,<br />New Delhi, India 110001</p>
                                </div>
                            </div>

                            <div className="contact-item">
                                <div className="contact-item__icon">
                                    <FiMail />
                                </div>
                                <div className="contact-item__content">
                                    <h4>Say Hello</h4>
                                    <p>hello@maatikalaa.in</p>
                                    <p>support@maatikalaa.in</p>
                                </div>
                            </div>

                            <div className="contact-item">
                                <div className="contact-item__icon">
                                    <FiPhone />
                                </div>
                                <div className="contact-item__content">
                                    <h4>Call Us</h4>
                                    <p>+91 999 888 7766</p>
                                    <p>Mon - Sat: 10:00 - 18:00</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Form */}
                    <ContactForm />

                </div>
            </div>
        </main>
    );
};

export default ContactPage;
