import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/providers/theme-provider";
import { Toaster } from "sonner";
import { notoSansJP } from "./fonts";

export const metadata: Metadata = {
  metadataBase: new URL(
      process.env.BASE_URL ||
      "https://crimson.wgzhao.me"
  ),
  title: {
    default: "Crimson",
    template: "%s | Crimson",
  },
  description: "HTMLを共有するためのプラットフォーム",
  applicationName: "Crimson",
  keywords: [
    "HTML共有",
    "コード共有",
    "プラットフォーム",
    "HTML sharing",
    "code sharing",
    "Crimson",
  ],
  authors: [{ name: "Crimson Team" }],
  creator: "Crimson Team",
  category: "technology",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "Crimson",
    description: "HTMLを共有するためのプラットフォーム",
    url: "/",
    siteName: "Crimson",
    locale: "ja_JP",
    type: "website",
    // TODO: Create default OG image at /public/og-image.png (1200x630)
    // images: [
    //   {
    //     url: "/og-image.png",
    //     width: 1200,
    //     height: 630,
    //     alt: "Crimson - HTML共有プラットフォーム",
    //   },
    // ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Crimson",
    description: "HTMLを共有するためのプラットフォーム",
    // TODO: Create default OG image at /public/og-image.png (1200x630)
    // images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  formatDetection: {
    telephone: false,
    email: false,
  },
  alternates: {
    canonical: "/",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f6f7" }, // matches oklch(0.96 0.005 25.4)
    { media: "(prefers-color-scheme: dark)", color: "#2b2b30" }, // matches oklch(0.17 0.015 25.4)
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" suppressHydrationWarning className={notoSansJP.variable}>
      <body className="antialiased font-sans">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
