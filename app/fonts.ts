import localFont from "next/font/local";

// Noto Sans JP - 主要日语字体
export const notoSansJP = localFont({
  src: [
    {
      path: "./fonts/NotoSansJP-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/NotoSansJP-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-noto-sans-jp",
  display: "swap",
  fallback: [
    "Hiragino Sans",
    "Hiragino Kaku Gothic ProN",
    "Yu Gothic",
    "YuGothic",
    "Meiryo",
    "sans-serif",
  ],
  adjustFontFallback: false,
});
