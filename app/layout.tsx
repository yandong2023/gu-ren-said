import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";
import "./ux.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://gurensaid.com"),
  title: "古人曰｜现代话 / 网络热梗，古人早就说过",
  description: "输入一句现代话或网络热梗，反查古诗文中真实存在的相似表达、作者、出处和原文，并生成适合手机传播的知识卡片。",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg"
  },
  openGraph: {
    title: "古人曰",
    description: "现代话 / 网络热梗，古人早就说过。反查真实古诗文原句和出处。",
    type: "website",
    url: "https://gurensaid.com",
    siteName: "古人曰",
    images: ["/og.svg"]
  },
  twitter: {
    card: "summary_large_image",
    title: "古人曰",
    description: "现代话 / 网络热梗，古人早就说过。反查真实古诗文原句和出处。",
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
      <body>
        {children}
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-V2YG6XD057" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-V2YG6XD057');
          `}
        </Script>
      </body>
    </html>
  );
}
