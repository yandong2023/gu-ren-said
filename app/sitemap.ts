import type { MetadataRoute } from "next";
import { PUBLISHED_CHENGYU_QUERIES, chengyuHref } from "@/lib/chengyu-large";
import { absoluteQueryUrl, SEO_QUERY_WHITELIST } from "@/lib/trends.server";

const SITE_URL = "https://gurensaid.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const querySet = new Set<string>(SEO_QUERY_WHITELIST);
  const chengyuQuerySet = new Set<string>(PUBLISHED_CHENGYU_QUERIES);

  return [
    { url: SITE_URL },
    { url: `${SITE_URL}/chengyu` },
    { url: `${SITE_URL}/hot` },
    ...Array.from(querySet).map((query) => ({
      url: absoluteQueryUrl(query)
    })),
    ...Array.from(chengyuQuerySet).map((query) => ({
      url: `${SITE_URL}${chengyuHref(query)}`
    }))
  ];
}
