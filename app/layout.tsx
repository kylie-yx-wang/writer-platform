import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Writer Craft Platform",
  description: "A platform for writers to improve their craft.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans bg-writer-white text-writer-black min-h-screen`}>
        
        <Navbar/>
        
        {/* 'children' is where individual pages render */}
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </body>
    </html>
  );
}