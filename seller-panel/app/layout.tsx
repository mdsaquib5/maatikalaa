import type { Metadata } from "next";
import { montserrat } from "./fonts/font";
import "./globals.css";
import "./responsive.css";
import Providers from "@/components/providers/Providers";

export const metadata: Metadata = {
  title: "Maatikala — Seller Dashboard",
  description: "Manage your Maatikala store — add products, track orders, and grow your handcraft business.",
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
          {children}
        </Providers>
      </body>
    </html>
  );
}
