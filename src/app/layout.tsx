import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "McD Order Controller",
  description: "Order delicious food from Mom's kitchen",
  openGraph: {
    images: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fpngimg.com%2Fimage%2F33909&psig=AOvVaw2ZXM6pu_nFFjr9QL9Oy8d8&ust=1762632980413000&source=images&cd=vfe&opi=89978449&ved=0CBIQjRxqFwoTCLC3n9jt4JADFQAAAAAdAAAAABAE",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
