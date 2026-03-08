import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import { KineticNavigation } from "@/components/ui/sterling-gate-kinetic-navigation";
import { Footer } from "@/components/layout/Footer";
import { ParallaxBackground } from "@/components/effects/ParallaxBackground";
import { CustomCursor } from "@/components/effects/CustomCursor";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://stuycast.org"),
  title: {
    default: "StuyCast - Stuyvesant High School Media Club",
    template: "%s | StuyCast",
  },
  description:
    "StuyCast is Stuyvesant High School's premier media club, producing videos and digital content.",
  keywords: ["StuyCast", "Stuyvesant High School", "media club", "student media", "videos"],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://stuycast.org",
    siteName: "StuyCast",
    title: "StuyCast - Stuyvesant High School Media Club",
    description: "Stuyvesant High School's premier media club",
  },
  twitter: {
    card: "summary_large_image",
    title: "StuyCast",
    description: "Stuyvesant High School's premier media club",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${outfit.variable} font-sans antialiased`}>
        <CustomCursor />
        <ParallaxBackground />
        <div className="relative z-10 flex flex-col min-h-screen">
          <KineticNavigation />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
