import { unstable_cache } from "next/cache";
import { runSearch } from "./search-service.server";
import { FALLBACK_TRENDING_QUERIES, getTrendingQueries, type TrendingQuery } from "./trends.server";
import type { SearchResult } from "./types";

export type HotRange = "today" | "week" | "all";
export type HotSource = "search" | "editorial";

export type HotItem = TrendingQuery & {
  source: HotSource;
};

export type RankedPreview = {
  item: HotItem;
  result: SearchResult;
};

export type HotFeed = {
  requestedRange: HotRange;
  range: HotRange;
  label: string;
  fallback: boolean;
  items: HotItem[];
  previews: RankedPreview[];
};

function isEditorialFallback(range: HotRange, items: TrendingQuery[]) {
  if (range !== "all" || items.length === 0) return false;
  return items.every((item, index) => item.query === FALLBACK_TRENDING_QUERIES[index]);
}

function labelFor(range: HotRange, source: HotSource) {
  if (source === "editorial") return "编辑精选";
  if (range === "today") return "今日热门反查";
  if (range === "week") return "本周热门反查";
  return "长期热门反查";
}

async function loadRange(range: HotRange): Promise<RankedPreview[]> {
  const rawItems = await getTrendingQueries(20, range);
  const source: HotSource = isEditorialFallback(range, rawItems) ? "editorial" : "search";
  const checked = await Promise.all(rawItems.map(async (item) => {
    const payload = await runSearch(item.query, 1, { enhance: false });
    const result = payload.results[0];
    return result ? { item: { ...item, source }, result } : null;
  }));

  return checked.filter((entry): entry is RankedPreview => Boolean(entry)).slice(0, 10);
}

const getCachedRange = unstable_cache(
  async (range: HotRange) => loadRange(range),
  ["grs-hot-range-v2"],
  { revalidate: 60 * 30 }
);

function fallbackOrder(range: HotRange): HotRange[] {
  if (range === "today") return ["today", "week", "all"];
  if (range === "week") return ["week", "all"];
  return ["all"];
}

export async function getHotFeed(requestedRange: HotRange): Promise<HotFeed> {
  for (const range of fallbackOrder(requestedRange)) {
    const previews = await getCachedRange(range);
    if (previews.length === 0) continue;
    const source = previews[0].item.source;
    return {
      requestedRange,
      range,
      label: labelFor(range, source),
      fallback: range !== requestedRange || source === "editorial",
      items: previews.map(({ item }) => item),
      previews
    };
  }

  return {
    requestedRange,
    range: requestedRange,
    label: "热门反查",
    fallback: false,
    items: [],
    previews: []
  };
}

export async function getHotPageData() {
  const [today, week, all] = await Promise.all([
    getCachedRange("today"),
    getCachedRange("week"),
    getCachedRange("all")
  ]);

  const previewGroup = today.length > 0 ? today : week.length > 0 ? week : all;
  const previewLabel = previewGroup.length > 0
    ? labelFor(previewGroup === today ? "today" : previewGroup === week ? "week" : "all", previewGroup[0].item.source)
    : "热门知识卡片";

  return { today, week, all, previewGroup, previewLabel };
}
