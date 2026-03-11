import Link from "next/link";

const NotFoundPage = () => {
    return (
        <main>
            <h1>404 — Page Not Found</h1>
            <p>The page you are looking for does not exist.</p>
            <Link href="/">Go back home</Link>
        </main>
    );
};

export default NotFoundPage;
