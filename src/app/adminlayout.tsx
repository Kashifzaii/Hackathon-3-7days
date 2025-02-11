import React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";
import { CartProvider } from "./context/CardContext"; // Fixed Typo
import { WishlistProvider } from "./context/WishlistContext"; // Fixed Import Path

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Best Furniture Store | Shop Online",
  description: "Discover high-quality furniture for your home and office. Shop now!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <React.StrictMode>
          <CartProvider>
            <WishlistProvider>
              <Navbar />
              <main>{children}</main>
              <Footer />
            </WishlistProvider>
          </CartProvider>
        </React.StrictMode>
      </body>
    </html>
  );
}
