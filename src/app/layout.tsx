import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Koocaa - Asset Management",
  description: "Manage your organization assets efficiently",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-gray-900">
        {children}
      </body>
    </html>
  );
}
