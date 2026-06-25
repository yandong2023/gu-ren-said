import type { MetadataRoute } from "next";
import { CHENGYU_RECORDS, chengyuHref } from "@/lib/chengyu-large";
import { absoluteQueryUrl, SEO_QUERY_WHITELIST } from "@/lib/trends.server";

const SITE_URL = "https://gurensaid.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const querySet = new Set<string>(SEO_QUERY_WHITELIST);
  const chengyuQuerySet = new Set(CHENGYU_RECORDS.flatMap((item) => [item.idiom, item.modernMeanings[0]]).filter(Boolean));
  const now = new Date();

  return [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1
    },
    {
      url: `${SITE_URL}/chengyu`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.86
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
    })),
    ...Array.from(chengyuQuerySet).slice(0, 120).map((query) => ({
      url: `${SITE_URL}${chengyuHref(query)}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.68
    }))
  ];
}
