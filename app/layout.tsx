import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {Providers} from '@/app/providers'

const inter =   Inter({subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Buckeye Shopping",
  description: "The best shopping site for OSU students and faculties.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-white text-gray-900`}>
        <Providers>
       {/* flex flex-col min-h-screen: a layout technique ensures foot
       er is always at bottom even if there are a little page content */}
      <div className = "flex flex-col min-h-screen">
        {/* Navbar that every page has */}
        <Navbar />
        {/* Main content area, every page.tsx will go here */}
        <main className="flex-grow">{children}</main>
        {/* Footer that every page has */}
        <Footer />
      </div>
      </Providers>
        </body>
      
    </html>
  );
}
