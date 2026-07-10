import type { Metadata } from "next";
import ChengyuExperience from "@/components/ChengyuExperience";

export const metadata: Metadata = {
  title: "成语怎么说｜口语转成语｜古人曰",
  description: "输入一句大白话，找到意思相近、语气合适、能正确使用的成语，包含释义、例句、近义词和反义词。",
  alternates: {
    canonical: "/chengyu"
  },
  openGraph: {
    title: "成语怎么说｜口语转成语｜古人曰",
    description: "输入一句大白话，找到意思相近、语气合适、能正确使用的成语。",
    type: "website",
    url: "https://gurensaid.com/chengyu",
    siteName: "古人曰",
    images: ["/og.svg"]
  },
  twitter: {
    card: "summary_large_image",
    title: "成语怎么说｜口语转成语｜古人曰",
    description: "输入一句大白话，找到意思相近、语气合适、能正确使用的成语。",
    images: ["/og.svg"]
  }
};

export default function ChengyuPage() {
  return <ChengyuExperience />;
}
