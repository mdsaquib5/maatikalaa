import type { Metadata } from "next";
import { montserrat } from "./fonts/font";
import "./globals.css";
import "./responsive.css";
import Header from "./components/layout/Header";
import Providers from "./components/providers/Providers";

export const metadata: Metadata = {
  title: "Maatikalaa — Handcrafted Muds Ware",
  description: "Discover the art of handcrafted muds ware. Maatikalaa brings you premium, earthy, artisan pottery and ceramic products.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={montserrat.variable}>
        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}
