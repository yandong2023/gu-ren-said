import type { MetadataRoute } from "next";
import { PUBLISHED_CHENGYU_QUERIES, chengyuHref } from "@/lib/chengyu-large";
import { ENGLISH_SEO_QUERIES, ENGLISH_TOPICS } from "@/lib/english-classics-wave2";
import { englishQueryHref } from "@/lib/english-url";
import { absoluteQueryUrl, SEO_QUERY_WHITELIST } from "@/lib/trends.server";

const SITE_URL = "https://gurensaid.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const querySet = new Set<string>(SEO_QUERY_WHITELIST);
  const chengyuQuerySet = new Set<string>(PUBLISHED_CHENGYU_QUERIES);

  return [
    { url: SITE_URL },
    { url: `${SITE_URL}/chengyu` },
    { url: `${SITE_URL}/hot` },
    { url: `${SITE_URL}/en` },
    { url: `${SITE_URL}/en/topics` },
    ...Array.from(querySet).map((query) => ({
      url: absoluteQueryUrl(query)
    })),
    ...Array.from(chengyuQuerySet).map((query) => ({
      url: `${SITE_URL}${chengyuHref(query)}`
    })),
    ...ENGLISH_TOPICS.map((topic) => ({
      url: `${SITE_URL}/en/topics/${topic.slug}`
    })),
    ...ENGLISH_SEO_QUERIES.map((query) => ({
      url: `${SITE_URL}${englishQueryHref(query)}`
    }))
  ];
}
