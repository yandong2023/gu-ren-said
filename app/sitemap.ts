import type { MetadataRoute } from "next";
import { absoluteQueryUrl, SEO_QUERY_WHITELIST } from "@/lib/trends.server";

const SITE_URL = "https://gurensaid.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const querySet = new Set<string>(SEO_QUERY_WHITELIST);
  const now = new Date();

  return [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1
    },
    {
      url: `${SITE_URL}/hot`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.8
    },
    ...Array.from(querySet).map((query) => ({
      url: absoluteQueryUrl(query),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.7
    }))
  ];
}
