import localFont from "next/font/local";

export const montserrat = localFont({
    src: [
        {
            path: "./montserrat/montserrat-300.woff2",
            weight: "300",
            style: "normal",
        },
        {
            path: "./montserrat/montserrat-regular.woff2",
            weight: "400",
            style: "normal",
        },
        {
            path: "./montserrat/montserrat-500.woff2",
            weight: "500",
            style: "normal",
        },
        {
            path: "./montserrat/montserrat-600.woff2",
            weight: "600",
            style: "normal",
        },
        {
            path: "./montserrat/montserrat-700.woff2",
            weight: "700",
            style: "normal",
        },
        {
            path: "./montserrat/montserrat-800.woff2",
            weight: "800",
            style: "normal",
        },
        {
            path: "./montserrat/montserrat-900.woff2",
            weight: "900",
            style: "normal",
        },
    ],
    display: "swap",
    variable: "--font-montserrat",
});