import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: {
    template: "%s | Luis Miguel García Marín",
    default: "Luis Miguel García Marín",
  },
  description:
    "Smart Portfolio Website with custom AI chatbot created by Luis Miguel García Marín.",
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
        <div className="min-h-screen flex flex-col">
        <ThemeProvider attribute="class">
          <Navbar />
          <main className="flex-grow mx-auto max-w-3xl px-3 py-10">{children}</main>
          <Footer />
        </ThemeProvider>
        </div>
      </body>
    </html>
  );
}
