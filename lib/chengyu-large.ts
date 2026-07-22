import { CHENGYU_RECORDS as SEED_CHENGYU_RECORDS, chengyuHref, chengyuToSlug, slugToChengyuQuery, type ChengyuRecord, type ChengyuResult } from "./chengyu";
import { COMMON_CHENGYU_BANK_RECORDS } from "./chengyu-bank";
import { EXTRA_CHENGYU_RECORDS } from "./chengyu-expansion";
import { MORE_CHENGYU_RECORDS } from "./chengyu-more";

const STOP_WORDS = new Set(["我", "你", "他", "她", "它", "的", "了", "啊", "呀", "吧", "吗", "呢", "很", "太", "真", "真的", "有点", "一个", "这个", "那个"]);
const LOW_SIGNAL_CHARS = new Set(["好", "说", "想", "人", "事", "不", "有", "没", "真", "太", "这", "那", "很", "更", "多", "少"]);
const GENERIC_LANDING_QUERIES = new Set(["常用成语", "成语表达", "更有文化的表达"]);

const QUERY_PREFERENCES: Record<string, string[]> = {
  表面一套背后一套: ["阳奉阴违", "两面三刀", "表里不一", "口是心非"],
  说话前后矛盾: ["自相矛盾", "前后矛盾", "前后不一", "言行不一"],
  很会装: ["装腔作势", "装模作样", "故弄玄虚", "故作高深"],
  想太多: ["杞人忧天", "庸人自扰", "患得患失"],
  突然有转机: ["柳暗花明", "峰回路转", "否极泰来", "绝处逢生"],
  效率很低: ["事倍功半", "徒劳无功", "劳而无功"],
  很努力但很累: ["孜孜不倦", "废寝忘食", "夜以继日", "任重道远", "全力以赴"],
  没人知道: ["默默无闻", "鲜为人知", "不为人知", "无人问津"],
  很有创意: ["别出心裁", "独具匠心", "别具一格", "匠心独运"],
  太老套了: ["千篇一律", "陈词滥调", "老生常谈", "墨守成规"],
  大家都知道: ["众所周知", "家喻户晓", "妇孺皆知", "尽人皆知"],
  所有人都知道: ["众所周知", "尽人皆知", "家喻户晓", "妇孺皆知"],
  大家都清楚: ["众所周知", "尽人皆知", "心知肚明"],
  这是人人皆知的事: ["众所周知", "尽人皆知", "妇孺皆知"]
};

const CHENGYU_RECORD_OVERRIDES: Record<string, Partial<Omit<ChengyuRecord, "id" | "idiom">>> = {
  众所周知: {
    pinyin: "zhòng suǒ zhōu zhī",
    meaning: "大家普遍都知道。",
    tone: "中性",
    modernMeanings: ["大家都知道", "所有人都知道", "大家都清楚", "这是人人皆知的事"],
    scenes: ["常识", "说明", "强调", "写作"],
    synonyms: ["家喻户晓", "妇孺皆知", "尽人皆知"],
    antonyms: ["鲜为人知", "不为人知"],
    example: "这个道理众所周知，不必再反复说明。",
    note: "用于说明某件事已经被普遍知晓。"
  }
};

function dedupeRecords(records: ChengyuRecord[]) {
  const byIdiom = new Map<string, ChengyuRecord>();
  for (const record of records) {
    const key = record.idiom;
    const existing = byIdiom.get(key);
    if (!existing || record.modernMeanings.length > existing.modernMeanings.length) byIdiom.set(key, record);
  }
  return Array.from(byIdiom.values());
}

function normalize(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, "");
}

function applyRecordOverride(record: ChengyuRecord): ChengyuRecord {
  const override = CHENGYU_RECORD_OVERRIDES[record.idiom];
  return override ? { ...record, ...override, id: record.id, idiom: record.idiom } : record;
}

export const CHENGYU_RECORDS = dedupeRecords([...SEED_CHENGYU_RECORDS, ...EXTRA_CHENGYU_RECORDS, ...MORE_CHENGYU_RECORDS, ...COMMON_CHENGYU_BANK_RECORDS]).map(applyRecordOverride);
export const CHENGYU_RECORD_COUNT = CHENGYU_RECORDS.length;

const CHENGYU_IDIOM_QUERY_KEYS = new Set(CHENGYU_RECORDS.map((record) => normalize(record.idiom)));
const GENERIC_LANDING_QUERY_KEYS = new Set(Array.from(GENERIC_LANDING_QUERIES).map(normalize));

function getRecordLandingQuery(record: ChengyuRecord) {
  return record.modernMeanings.find((value) => {
    const key = normalize(value);
    return Boolean(key) && !CHENGYU_IDIOM_QUERY_KEYS.has(key) && !GENERIC_LANDING_QUERY_KEYS.has(key);
  });
}

export const PUBLISHED_CHENGYU_QUERIES = Array.from(new Set(
  CHENGYU_RECORDS
    .map(getRecordLandingQuery)
    .filter((value): value is string => Boolean(value))
));

const PUBLISHED_CHENGYU_QUERY_KEYS = new Set(PUBLISHED_CHENGYU_QUERIES.map(normalize));

export { chengyuHref, chengyuToSlug, slugToChengyuQuery };

export function isPublishedChengyuQuery(query: string) {
  return PUBLISHED_CHENGYU_QUERY_KEYS.has(normalize(query));
}

export function isChengyuIdiomQuery(query: string) {
  return CHENGYU_IDIOM_QUERY_KEYS.has(normalize(query));
}

export function getPreferredChengyuQuery(query: string) {
  const key = normalize(query);
  if (!key || !isChengyuIdiomQuery(query)) return null;
  const record = CHENGYU_RECORDS.find((item) => normalize(item.idiom) === key);
  return record ? getRecordLandingQuery(record) ?? null : null;
}

function tokenize(input: string) {
  const compact = normalize(input);
  const terms = new Set<string>();
  input.split(/[\s,，。！？!?.、/\\]+/).map((item) => item.trim()).filter(Boolean).forEach((item) => {
    if (!STOP_WORDS.has(item)) terms.add(item);
  });

  if (/^[\u4e00-\u9fa5]+$/.test(compact) && compact.length <= 24) {
    for (let size = 2; size <= 5; size += 1) {
      for (let i = 0; i <= compact.length - size; i += 1) {
        const phrase = compact.slice(i, i + size);
        if (Array.from(phrase).every((char) => STOP_WORDS.has(char) || LOW_SIGNAL_CHARS.has(char))) continue;
        terms.add(phrase);
      }
    }
  }

  return Array.from(terms).slice(0, 48);
}

function recordBlob(record: ChengyuRecord) {
  return normalize([
    record.id,
    record.idiom,
    record.pinyin,
    record.meaning,
    record.source ?? "",
    record.tone,
    record.modernMeanings.join(" "),
    record.scenes.join(" "),
    record.synonyms.join(" "),
    record.antonyms.join(" "),
    record.example,
    record.note ?? ""
  ].join(" "));
}

function scoreRecord(record: ChengyuRecord, query: string): ChengyuResult {
  const normalizedQuery = normalize(query);
  const terms = tokenize(query);
  const blob = recordBlob(record);
  const matchedBy = new Set<string>();
  let score = 0;

  if (normalizedQuery && normalize(record.idiom) === normalizedQuery) {
    score += 100;
    matchedBy.add("idiom-exact");
  }

  if (normalizedQuery && record.modernMeanings.some((meaning) => normalize(meaning).includes(normalizedQuery) || normalizedQuery.includes(normalize(meaning)))) {
    score += 72;
    matchedBy.add("modern-exact");
  }

  for (const term of terms) {
    const normalizedTerm = normalize(term);
    if (!normalizedTerm) continue;
    if (record.modernMeanings.some((meaning) => normalize(meaning).includes(normalizedTerm))) {
      score += 18;
      matchedBy.add("modern-term");
    }
    if (record.scenes.some((scene) => normalize(scene).includes(normalizedTerm))) {
      score += 10;
      matchedBy.add("scene");
    }
    if (record.meaning && normalize(record.meaning).includes(normalizedTerm)) {
      score += 10;
      matchedBy.add("meaning");
    }
    if (record.synonyms.some((item) => normalize(item).includes(normalizedTerm)) || record.antonyms.some((item) => normalize(item).includes(normalizedTerm))) {
      score += 8;
      matchedBy.add("related");
    }
    if (blob.includes(normalizedTerm)) {
      score += normalizedTerm.length >= 2 ? 4 : 0;
      matchedBy.add("keyword");
    }
  }

  const preferred = QUERY_PREFERENCES[normalizedQuery] ?? [];
  const preferredIndex = preferred.indexOf(record.idiom);
  if (preferredIndex >= 0) {
    score += 160 - preferredIndex * 8;
    matchedBy.add("fixed-query-preference");
  }

  const hasStrongSignal = ["idiom-exact", "modern-exact", "modern-term", "scene", "meaning", "fixed-query-preference"].some((type) => matchedBy.has(type));
  if (!hasStrongSignal) score = Math.min(score, 20);

  const reason = matchedBy.has("idiom-exact")
    ? `你输入的是成语“${record.idiom}”，它的意思是：${record.meaning}`
    : `“${record.idiom}”可以表达“${record.modernMeanings.slice(0, 2).join(" / ")}”这类意思，语气为${record.tone}。`;

  return { ...record, score: Number(score.toFixed(2)), matchedBy: Array.from(matchedBy), reason };
}

export function searchChengyu(query: string, limit = 8): ChengyuResult[] {
  const value = query.trim();
  if (!value) return [];
  return CHENGYU_RECORDS
    .map((record) => scoreRecord(record, value))
    .filter((result) => result.score >= 28)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
