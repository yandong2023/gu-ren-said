import type { Metadata } from "next";
import { redirect } from "next/navigation";
import EnglishSearchExperience from "@/components/EnglishSearchExperience";
import { ENGLISH_TOPICS, getEnglishClassicsByIds } from "@/lib/english-classics-wave2";
import { englishQueryHref } from "@/lib/english-url";

export const metadata: Metadata = {
  title: "Gu Ren Said | Find Real Chinese Poems and Quotes for What You Mean",
  description: "Describe a feeling or thought in English and find a real, source-verified line from classical Chinese poetry and philosophy, with original Chinese, pinyin, translation, author, and context.",
  keywords: [
    "Chinese poems in English",
    "Chinese quotes with meaning",
    "classical Chinese poetry",
    "Chinese poem finder",
    "Chinese quotes about life",
    "Chinese poems about love"
  ],
  alternates: {
    canonical: "/en",
    languages: {
      en: "/en",
      "zh-CN": "/",
      "x-default": "/en"
    }
  },
  openGraph: {
    title: "Gu Ren Said — Find the classic Chinese line for what you mean",
    description: "English intent in. A real Chinese classic out—with original text, pinyin, translation, and a verified source.",
    type: "website",
    url: "https://gurensaid.com/en",
    siteName: "Gu Ren Said",
    images: ["/og-en.svg"]
  },
  twitter: {
    card: "summary_large_image",
    title: "Gu Ren Said — Ancient words, real sources",
    description: "Find a real classical Chinese line for a modern feeling, thought, or situation.",
    images: ["/og-en.svg"]
  }
};

const HOME_TOPIC_ORDER = [
  "love",
  "missing-someone",
  "moon-and-night",
  "seasons-and-nature",
  "parents-and-filial-love",
  "solitude-and-reflection",
  "travel-and-journey",
  "commitment-and-marriage",
  "family-and-reunion",
  "teaching-and-mentorship",
  "critical-thinking-and-empathy",
  "aging-and-resilience",
  "beauty",
  "friendship",
  "ambition-and-success",
  "perseverance",
  "letting-go",
  "inner-peace",
  "sadness-and-loneliness",
  "work-and-leadership",
  "mistakes-and-renewal",
  "perspective-and-self-knowledge",
  "life"
];

type PageProps = {
  searchParams: Promise<{ q?: string | string[] }>;
};

export default async function EnglishHomePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const rawQuery = Array.isArray(params.q) ? params.q[0] : params.q;
  const query = rawQuery?.trim();
  if (query) redirect(englishQueryHref(query));

  const featured = getEnglishClassicsByIds([
    "zhangjiuling-wangyue-shared-moon",
    "wangwei-shanju-autumn",
    "mengjiao-youziyin-mother"
  ]);
  const topicBySlug = new Map(ENGLISH_TOPICS.map((topic) => [topic.slug, topic]));
  const topics = HOME_TOPIC_ORDER
    .map((slug) => topicBySlug.get(slug))
    .filter((topic): topic is NonNullable<typeof topic> => Boolean(topic))
    .map(({ slug, shortTitle, description }) => ({ slug, shortTitle, description }));

  return <EnglishSearchExperience featured={featured} topics={topics} />;
}
