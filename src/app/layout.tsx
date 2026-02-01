import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { DemoShell } from "@/components/Demo/DemoShell";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FoodNow Dashboard",
  description: "Stripe Connect demo for a food delivery platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <DemoShell>{children}</DemoShell>
      </body>
    </html>
  );
}
