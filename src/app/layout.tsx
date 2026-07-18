import type { Metadata } from "next";
import { Noto_Sans } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const notoSans = Noto_Sans({
  variable: "--font-noto-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "KuberaNow",
  description:
    "Independent business and financial journalism, market tracking tools and breaking news.",
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${notoSans.variable} h-full antialiased`}>
      <body className="bg-background-color text-foreground flex min-h-screen flex-col font-sans">
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
