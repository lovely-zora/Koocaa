import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// 1. Load the Inter font for that clean, Google-style look
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Koocaa | Enterprise Asset Management",
  description: "Premium asset tracking for modern organizations",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/* 2. Every page content is injected inside this body */}
      <body className={`${inter.className} min-h-screen bg-slate-50 text-slate-900 antialiased`}>
        {children}
      </body>
    </html>
  );
}