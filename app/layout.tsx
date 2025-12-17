import type { Metadata } from "next";
import { Noto_Sans_JP, Dela_Gothic_One } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/providers/theme-provider";

const notoJp = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-noto-jp",
  display: "swap",
});

const delaGothic = Dela_Gothic_One({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-dela-gothic",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Crimson",
  description: "HTMLスニペットを共有するためのプラットフォーム",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={notoJp.variable} suppressHydrationWarning>
      <body className={`${notoJp.variable} ${delaGothic.variable} antialiased`}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
