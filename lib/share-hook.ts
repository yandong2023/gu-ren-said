import type { SearchResult } from "@/lib/types";

const MAX_QUERY_LENGTH = 18;

function compactText(input: string) {
  return input
    .replace(/[\n\r]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function trimQuery(query: string) {
  const normalized = compactText(query);
  if (normalized.length <= MAX_QUERY_LENGTH) return normalized;
  return `${normalized.slice(0, MAX_QUERY_LENGTH)}…`;
}

function hashString(input: string) {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash * 31 + input.charCodeAt(i)) >>> 0;
  }
  return hash;
}

export function getShareHookCandidates(query: string, result: SearchResult) {
  const q = trimQuery(query || result.modernMeanings?.[0] || "这句话");
  const quote = compactText(result.quote || "");
  const source = `${result.dynasty}·${result.author}`;

  const templates = [
    `原来“${q}”，古人早就说过。`,
    `古人没有直说“${q}”，却早就写出了这种感觉。`,
    `如果把“${q}”翻成古诗文，大概会这样说。`,
    `原来这种“${q}”的感觉，古人早就写进诗里了。`
  ];

  const start = hashString(`${q}|${quote}|${source}`) % templates.length;
  return Array.from({ length: templates.length }, (_, index) => templates[(start + index) % templates.length]);
}

export function getPrimaryShareHook(query: string, result: SearchResult) {
  return getShareHookCandidates(query, result)[0];
}
