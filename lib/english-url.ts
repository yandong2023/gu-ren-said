export function normalizeEnglishQuery(value: string) {
  return value
    .toLowerCase()
    .replace(/[’‘]/g, "'")
    .replace(/[^a-z0-9'\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function englishQueryToSlug(query: string) {
  return normalizeEnglishQuery(query)
    .replace(/'/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 100);
}

export function englishSlugToQuery(slug: string) {
  return decodeURIComponent(slug)
    .replace(/-+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 120);
}

export function englishQueryHref(query: string) {
  return `/en/q/${englishQueryToSlug(query)}`;
}
