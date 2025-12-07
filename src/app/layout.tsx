import type { Metadata, Viewport } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: {
    default: "MindForge - Forge Your Knowledge",
    template: "%s | MindForge",
  },
  description:
    "Forge your knowledge with voice-powered learning companions. An intelligent learning platform featuring personalized tutors, RAG-enhanced knowledge retrieval, and immersive voice interactions.",
  keywords: [
    "learning platform",
    "voice learning",
    "AI tutor",
    "education",
    "personalized learning",
    "knowledge retrieval",
  ],
  authors: [{ name: "Kunal Shaw" }],
  creator: "Kunal Shaw",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://mindforge.vercel.app",
    siteName: "MindForge",
    title: "MindForge - Forge Your Knowledge",
    description:
      "Forge your knowledge with voice-powered learning companions.",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "MindForge - Voice-powered learning platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MindForge - Forge Your Knowledge",
    description:
      "Forge your knowledge with voice-powered learning companions.",
    images: ["/images/og-image.png"],
    creator: "@kunalshaw",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8f9fa" },
    { media: "(prefers-color-scheme: dark)", color: "#0f1419" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "hsl(250, 100%, 65%)",
          colorBackground: "hsl(220, 20%, 98%)",
          borderRadius: "0.75rem",
        },
        elements: {
          formButtonPrimary:
            "bg-primary hover:bg-primary-hover text-white shadow-lg",
          card: "shadow-xl border border-border",
          headerTitle: "font-display font-bold",
          headerSubtitle: "text-muted-foreground",
        },
      }}
    >
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} antialiased`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange={false}
          >
            <QueryProvider>
              {children}
              <Toaster position="bottom-right" richColors closeButton />
            </QueryProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
