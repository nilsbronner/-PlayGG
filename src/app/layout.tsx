import type { Metadata } from "next";
import localFont from "next/font/local";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

// Auto-hébergée : Press Start 2P dessine mal ses majuscules accentuées
// (le "É" de "RESPONSABILITÉ" ressort comme un "é" minuscule dépareillé,
// vérifié en rendu réel) — Silkscreen a le même esprit arcade/pixel avec
// des accents français correctement dessinés.
const arcade = localFont({
  src: "../fonts/silkscreen-bold.ttf",
  weight: "700",
  variable: "--font-arcade",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
});

const title = "#PlayGG | Pour un esport mixte et responsable";
const description = "Soutenez la charte de manière anonyme ou publique.";

// Tolère une valeur sans schéma (ex. "playgg.fr" au lieu de
// "https://playgg.fr"), qui ferait planter `new URL()` au build.
function resolveSiteUrl(): URL {
  const raw = process.env.NEXT_PUBLIC_SITE_URL || "https://playgg.fr";
  try {
    return new URL(raw);
  } catch {
    try {
      return new URL(`https://${raw}`);
    } catch {
      return new URL("https://playgg.fr");
    }
  }
}

export const metadata: Metadata = {
  metadataBase: resolveSiteUrl(),
  title,
  description,
  openGraph: {
    title,
    description,
    siteName: "#PlayGG",
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${arcade.variable} ${jakarta.variable}`}>
      <body className="bg-cream text-ink font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
