import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://gurensaid.com"),
  title: "古人早就说过｜热梗古诗文反查",
  description: "输入一句现代话或网络热梗，反查古诗文中真实存在的相似表达，并生成适合手机传播的出处卡片。",
  alternates: {
    canonical: "/"
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg"
  },
  openGraph: {
    title: "古人早就说过",
    description: "现代话 / 网络热梗 → 古诗文真实出处 → 可分享卡片",
    type: "website",
    url: "https://gurensaid.com",
    siteName: "Gu Ren Said",
    images: ["/og.svg"]
  },
  twitter: {
    card: "summary_large_image",
    title: "古人早就说过",
    description: "现代话 / 网络热梗 → 古诗文真实出处 → 可分享卡片",
    images: ["/og.svg"]
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#f7ead8"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
