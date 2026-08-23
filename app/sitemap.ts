import type { MetadataRoute } from "next";
import { PUBLISHED_CHENGYU_QUERIES, chengyuHref } from "@/lib/chengyu-large";
import { ENGLISH_SEO_QUERIES, ENGLISH_TOPICS } from "@/lib/english-classics-wave2";
import { getPublishedEnglishAuthors, getPublishedEnglishWorks } from "@/lib/english-catalog.server";
import { englishQueryHref } from "@/lib/english-url";
import { absoluteQueryUrl, SEO_QUERY_WHITELIST } from "@/lib/trends.server";

const SITE_URL = "https://gurensaid.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const querySet = new Set<string>(SEO_QUERY_WHITELIST);
  const chengyuQuerySet = new Set<string>(PUBLISHED_CHENGYU_QUERIES);
  const authors = getPublishedEnglishAuthors();
  const works = getPublishedEnglishWorks();

  return [
    { url: SITE_URL },
    { url: `${SITE_URL}/chengyu` },
    { url: `${SITE_URL}/hot` },
    { url: `${SITE_URL}/en` },
    { url: `${SITE_URL}/en/explore` },
    { url: `${SITE_URL}/en/topics` },
    { url: `${SITE_URL}/en/poets` },
    { url: `${SITE_URL}/en/works` },
    ...Array.from(querySet).map((query) => ({
      url: absoluteQueryUrl(query)
    })),
    ...Array.from(chengyuQuerySet).map((query) => ({
      url: `${SITE_URL}${chengyuHref(query)}`
    })),
    ...ENGLISH_TOPICS.map((topic) => ({
      url: `${SITE_URL}/en/topics/${topic.slug}`
    })),
    ...authors.map((author) => ({
      url: `${SITE_URL}${author.href}`
    })),
    ...works.map((work) => ({
      url: `${SITE_URL}${work.href}`
    })),
    ...ENGLISH_SEO_QUERIES.map((query) => ({
      url: `${SITE_URL}${englishQueryHref(query)}`
    }))
  ];
}
