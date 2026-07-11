import type { Metadata } from "next";
import QualityDashboard from "@/components/QualityDashboard";

export const metadata: Metadata = {
  title: "搜索质量后台｜古人曰",
  robots: {
    index: false,
    follow: false,
    noarchive: true
  }
};

export default function QualityDashboardPage() {
  return <QualityDashboard />;
}
