import type React from "react";
import type { Metadata } from "next";
import { Montserrat, Raleway } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import Header from "@/components/header";
import Footer from "@/components/footer";
import ValuePropBar from "@/components/value-prop-bar";
import Script from "next/script";

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

const proximaNova = localFont({
  src: [
    {
      path: "../public/fonts/woff2/Mark Simonson  Proxima Nova Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/Mark Simonson  Proxima Nova Thin.otf",
      weight: "100",
      style: "normal",
    },
    {
      path: "../public/fonts/Mark Simonson  Proxima Nova Thin Italic.otf",
      weight: "100",
      style: "italic",
    },
    {
      path: "../public/fonts/Mark Simonson  Proxima Nova Light.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../public/fonts/Mark Simonson  Proxima Nova Light Italic.otf",
      weight: "300",
      style: "italic",
    },
    {
      path: "../public/fonts/Mark Simonson  Proxima Nova Regular Italic.otf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../public/fonts/Mark Simonson  Proxima Nova Semibold.otf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../public/fonts/Mark Simonson  Proxima Nova Semibold Italic.otf",
      weight: "600",
      style: "italic",
    },
    {
      path: "../public/fonts/Mark Simonson  Proxima Nova Bold.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/fonts/Mark Simonson  Proxima Nova Bold Italic.otf",
      weight: "700",
      style: "italic",
    },
    {
      path: "../public/fonts/Mark Simonson  Proxima Nova Extrabold.otf",
      weight: "800",
      style: "normal",
    },
    {
      path: "../public/fonts/Mark Simonson  Proxima Nova Extrabold Italic.otf",
      weight: "800",
      style: "italic",
    },
    {
      path: "../public/fonts/Mark Simonson  Proxima Nova Black.otf",
      weight: "900",
      style: "normal",
    },
    {
      path: "../public/fonts/Mark Simonson  Proxima Nova Black Italic.otf",
      weight: "900",
      style: "italic",
    },
  ],
  variable: "--font-proxima",
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
        className={`${proximaNova.className} ${proximaNova.variable} ${raleway.variable} ${montserrat.variable} font-sans antialiased`}
      >
        <ValuePropBar />
        <Header />
        {children}
        <Footer />

        <Script
          id="livechat-config"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
        window.__lc = window.__lc || {};
        window.__lc.license = 19074458;
        window.__lc.integration_name = "manual_restart_trial";
        window.__lc.product_name = "livechat";
      `,
          }}
        />
        <Script
          id="livechat-loader"
          src="https://cdn.livechatinc.com/tracking.js"
          strategy="afterInteractive"
        />

        {/* HubSpot */}
        <Script
          id="hubspot-loader"
          src="//js-eu1.hs-scripts.com/146828732.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
