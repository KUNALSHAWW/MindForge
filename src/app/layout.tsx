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
          colorPrimary: "hsl(234, 89%, 54%)",
          colorBackground: "hsl(0, 0%, 100%)",
          borderRadius: "0.5rem",
        },
        elements: {
          formButtonPrimary:
            "bg-[hsl(234,89%,54%)] hover:bg-[hsl(234,89%,48%)] text-white shadow-sm",
          card: "shadow-md border border-[hsl(220,13%,91%)]",
          headerTitle: "font-semibold",
          headerSubtitle: "text-[hsl(220,9%,46%)]",
        },
      }}
    >
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} antialiased`}
          suppressHydrationWarning
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
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
