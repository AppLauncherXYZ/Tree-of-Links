import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
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
  title: "Tree of Links - Customizable Linktree Template",
  description: "🎨 Free customizable Linktree template! Create a beautiful profile page with multiple link types, themes, and social integration. Perfect for creators, businesses, and personal branding.",
  keywords: ["linktree", "template", "links", "profile", "bio", "social media", "creator", "mobile", "responsive", "customizable"],
  viewport: "width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes",
  openGraph: {
    title: "🎨 Customizable Linktree Template - Tree of Links",
    description: "Create your own personalized linktree with multiple themes, link types, and social integration.",
    type: "website",
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
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased min-h-screen bg-background text-foreground`}
      >
        <div className="min-h-screen">
          {children}
        </div>
        <Toaster />
      </body>
    </html>
  );
}
