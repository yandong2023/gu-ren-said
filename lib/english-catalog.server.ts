import {
  ENGLISH_CLASSICS,
  ENGLISH_TOPICS
} from "./english-classics-wave2";
import {
  ENGLISH_AUTHOR_PROFILES,
  ENGLISH_WORK_PROFILES,
  englishWorkMatches,
  getEnglishAuthorProfile,
  getEnglishAuthorProfileByName,
  getEnglishWorkProfile,
  getEnglishWorkProfileBySource,
  type EnglishAuthorProfile,
  type EnglishWorkProfile
} from "./english-catalog";
import type { EnglishClassic, EnglishTopic } from "./english-classics";

export type EnglishAuthorCollection = EnglishAuthorProfile & {
  href: string;
  items: EnglishClassic[];
  topics: EnglishTopic[];
  works: Array<EnglishWorkProfile & { href: string; count: number }>;
};

export type EnglishWorkCollection = EnglishWorkProfile & {
  href: string;
  items: EnglishClassic[];
  topics: EnglishTopic[];
  authors: Array<EnglishAuthorProfile & { href: string; count: number }>;
};

const MIN_COLLECTION_ITEMS = 2;

function sortItems(items: EnglishClassic[]) {
  return [...items].sort((a, b) => b.weight - a.weight || a.authorEn.localeCompare(b.authorEn));
}

function topicsForItems(items: EnglishClassic[], limit = 8) {
  const counts = new Map<string, number>();
  for (const item of items) {
    for (const slug of item.topicSlugs) counts.set(slug, (counts.get(slug) ?? 0) + 1);
  }

  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([slug]) => ENGLISH_TOPICS.find((topic) => topic.slug === slug))
    .filter((topic): topic is EnglishTopic => Boolean(topic))
    .slice(0, limit);
}

function worksForItems(items: EnglishClassic[], limit = 8) {
  const counts = new Map<string, number>();
  for (const item of items) {
    const profile = getEnglishWorkProfileBySource(item.sourceEn);
    if (profile) counts.set(profile.slug, (counts.get(profile.slug) ?? 0) + 1);
  }

  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([slug, count]) => {
      const profile = getEnglishWorkProfile(slug);
      return profile ? { ...profile, href: `/en/works/${profile.slug}`, count } : null;
    })
    .filter((profile): profile is EnglishWorkProfile & { href: string; count: number } => Boolean(profile))
    .slice(0, limit);
}

function authorsForItems(items: EnglishClassic[], limit = 8) {
  const counts = new Map<string, number>();
  for (const item of items) {
    const profile = getEnglishAuthorProfileByName(item.authorEn);
    if (profile) counts.set(profile.slug, (counts.get(profile.slug) ?? 0) + 1);
  }

  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([slug, count]) => {
      const profile = getEnglishAuthorProfile(slug);
      return profile ? { ...profile, href: `/en/poets/${profile.slug}`, count } : null;
    })
    .filter((profile): profile is EnglishAuthorProfile & { href: string; count: number } => Boolean(profile))
    .slice(0, limit);
}

function buildAuthorCollection(profile: EnglishAuthorProfile): EnglishAuthorCollection {
  const items = sortItems(ENGLISH_CLASSICS.filter((item) => profile.authorNames.includes(item.authorEn)));
  return {
    ...profile,
    href: `/en/poets/${profile.slug}`,
    items,
    topics: topicsForItems(items),
    works: worksForItems(items)
  };
}

function buildWorkCollection(profile: EnglishWorkProfile): EnglishWorkCollection {
  const items = sortItems(ENGLISH_CLASSICS.filter((item) => englishWorkMatches(profile, item.sourceEn)));
  return {
    ...profile,
    href: `/en/works/${profile.slug}`,
    items,
    topics: topicsForItems(items),
    authors: authorsForItems(items)
  };
}

export function getPublishedEnglishAuthors() {
  return ENGLISH_AUTHOR_PROFILES
    .map(buildAuthorCollection)
    .filter((collection) => collection.items.length >= MIN_COLLECTION_ITEMS)
    .sort((a, b) => b.items.length - a.items.length || a.name.localeCompare(b.name));
}

export function getPublishedEnglishWorks() {
  return ENGLISH_WORK_PROFILES
    .map(buildWorkCollection)
    .filter((collection) => collection.items.length >= MIN_COLLECTION_ITEMS)
    .sort((a, b) => b.items.length - a.items.length || a.name.localeCompare(b.name));
}

export function getEnglishAuthorCollection(slug: string) {
  const profile = getEnglishAuthorProfile(slug);
  if (!profile) return null;
  const collection = buildAuthorCollection(profile);
  return collection.items.length >= MIN_COLLECTION_ITEMS ? collection : null;
}

export function getEnglishWorkCollection(slug: string) {
  const profile = getEnglishWorkProfile(slug);
  if (!profile) return null;
  const collection = buildWorkCollection(profile);
  return collection.items.length >= MIN_COLLECTION_ITEMS ? collection : null;
}

export function getEnglishCatalogStats() {
  const authors = getPublishedEnglishAuthors();
  const works = getPublishedEnglishWorks();
  return {
    authors: authors.length,
    works: works.length,
    themes: ENGLISH_TOPICS.length,
    classics: ENGLISH_CLASSICS.length
  };
}
