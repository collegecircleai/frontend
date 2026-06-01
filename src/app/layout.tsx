import "./globals.css";
import "katex/dist/katex.min.css";
import type { Metadata } from "next";
import {
  DM_Sans,
  Playfair_Display,
  DM_Mono,
  Noto_Sans_Devanagari,
} from "next/font/google";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["300", "400", "500"],
  display: "swap",
});

const notoDevanagari = Noto_Sans_Devanagari({
  subsets: ["devanagari"],
  variable: "--font-hindi",
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "CC>AI College Circle AI",
  description:
    "Learning, Redefined. AI-powered personalised education platform built for students, by students.",
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
};

import SmoothScroll from "@/components/effects/SmoothScroll";
import ComponentErrorBoundary from "@/components/effects/ErrorBoundary";
import SplashScreen from "@/components/effects/SplashScreen";
import { AuthProvider } from "@/context/AuthContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${playfair.variable} ${dmMono.variable} ${notoDevanagari.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme') || 'light';
                  document.documentElement.setAttribute('data-theme', theme);
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className={dmSans.className}>
        <AuthProvider>
          <SplashScreen />
          <div className="noise-overlay" />
          <ComponentErrorBoundary>
            <SmoothScroll>{children}</SmoothScroll>
          </ComponentErrorBoundary>
        </AuthProvider>
      </body>
    </html>
  );
}
