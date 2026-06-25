import { CHENGYU_RECORDS as SEED_CHENGYU_RECORDS, chengyuHref, chengyuToSlug, slugToChengyuQuery, type ChengyuRecord, type ChengyuResult } from "./chengyu";
import { EXTRA_CHENGYU_RECORDS } from "./chengyu-expansion";

const STOP_WORDS = new Set(["我", "你", "他", "她", "它", "的", "了", "啊", "呀", "吧", "吗", "呢", "很", "太", "真", "真的", "有点", "一个", "这个", "那个"]);
const LOW_SIGNAL_CHARS = new Set(["好", "说", "想", "人", "事", "不", "有", "没", "真", "太", "这", "那", "很", "更", "多", "少"]);

function dedupeRecords(records: ChengyuRecord[]) {
  const byIdiom = new Map<string, ChengyuRecord>();
  for (const record of records) {
    const key = record.idiom;
    const existing = byIdiom.get(key);
    if (!existing || record.modernMeanings.length > existing.modernMeanings.length) byIdiom.set(key, record);
  }
  return Array.from(byIdiom.values());
}

export const CHENGYU_RECORDS = dedupeRecords([...SEED_CHENGYU_RECORDS, ...EXTRA_CHENGYU_RECORDS]);
export const CHENGYU_RECORD_COUNT = CHENGYU_RECORDS.length;
export { chengyuHref, chengyuToSlug, slugToChengyuQuery };

function normalize(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, "");
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

  const hasStrongSignal = ["idiom-exact", "modern-exact", "modern-term", "scene", "meaning"].some((type) => matchedBy.has(type));
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
