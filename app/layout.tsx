import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Fraud Detection System",
  description: "Real-time network-based fraud analysis dashboard"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
