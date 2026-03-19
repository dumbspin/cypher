import type { Metadata } from "next";
import { Playfair_Display, Roboto_Mono } from "next/font/google";
import "./globals.css";
import ParticleBackground from "@/components/landing/ParticleBackground";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-playfair",
});

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  variable: "--font-roboto-mono",
});

export const metadata: Metadata = {
  title: "Cypher | Stop Phishing Threats",
  description: "Uttarakhand's first community-powered phishing detection platform. Sentinel Grid - One click can cost everything.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${playfair.variable} ${robotoMono.variable} font-mono bg-bg text-text antialiased grid-bg`}>
        <ParticleBackground />
        <div className="relative z-10">
          {children}
        </div>
      </body>
    </html>
  );
}
