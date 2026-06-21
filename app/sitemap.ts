import type { MetadataRoute } from "next";
import { absoluteQueryUrl, FALLBACK_TRENDING_QUERIES, getTrendingQueries } from "@/lib/trends.server";

const SITE_URL = "https://gurensaid.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const trending = await getTrendingQueries(30);
  const querySet = new Set<string>([...FALLBACK_TRENDING_QUERIES, ...trending.map((item) => item.query)]);
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
