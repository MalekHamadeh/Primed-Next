import type React from "react";
import type { Metadata } from "next";
import { Montserrat, Raleway } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import Footer from "@/components/footer";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["700", "900"],
  variable: "--font-montserrat",
  display: "swap",
});

const raleway = Raleway({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-raleway",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Primed Clinic | Your Body. Your Goals. Your PRIME.",
  description:
    "Access Personalised Treatments and Medical Programmes To Help Optimise The Way You Look, Feel, Perform and Live.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${raleway.variable} ${montserrat.variable} font-sans antialiased`}
      >
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
