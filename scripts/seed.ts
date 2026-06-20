import fs from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";
import { QUOTES, SLANG_MAPPINGS } from "../lib/data";
import type { QuoteRecord } from "../lib/types";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DATA_DIR, "quotes.db");
const SCHEMA_PATH = path.join(DATA_DIR, "schema.sql");

const SHOULD_IMPORT_CHINESE_POETRY = process.env.IMPORT_CHINESE_POETRY !== "0";
const MAX_REMOTE_QUOTES = Number.parseInt(process.env.MAX_REMOTE_QUOTES ?? "12000", 10);
const TANG_FILES = Number.parseInt(process.env.TANG_FILES ?? "6", 10);
const SONG_CI_FILES = Number.parseInt(process.env.SONG_CI_FILES ?? "4", 10);

const TANG_BASE = "https://raw.githubusercontent.com/chinese-poetry/chinese-poetry/master/%E5%85%A8%E5%94%90%E8%AF%97";
const SONG_CI_BASE = "https://raw.githubusercontent.com/chinese-poetry/chinese-poetry/master/%E5%AE%8B%E8%AF%8D";

type ChinesePoetryItem = {
  id?: string;
  author?: string;
  title?: string;
  rhythmic?: string;
  paragraphs?: string[];
  tags?: string[];
};

type ThemeRule = {
  theme: string;
  emotion: string;
  words: string[];
};

const THEME_RULES: ThemeRule[] = [
  { theme: "忧愁", emotion: "sad", words: ["愁", "悲", "泪", "恨", "断肠", "惆怅", "凄", "伤", "怨", "离情", "销魂", "憔悴"] },
  { theme: "思乡", emotion: "homesick", words: ["故乡", "思乡", "异乡", "归乡", "归家", "客", "明月", "故园", "故国", "乡心"] },
  { theme: "离别", emotion: "sad", words: ["离别", "送", "别", "阳关", "征鸿", "长亭", "行人", "相送", "分携"] },
  { theme: "希望", emotion: "positive", words: ["春", "新", "朝", "日", "晴", "云开", "会", "明", "生", "花开", "东风"] },
  { theme: "坚持", emotion: "driven", words: ["坚", "志", "凌云", "千里", "跬步", "磨", "击", "破浪", "不辞", "百战"] },
  { theme: "松弛", emotion: "calm", words: ["闲", "悠", "山", "田", "归去", "南山", "渔", "隐", "云水", "溪", "林", "竹"] },
  { theme: "赞美", emotion: "admire", words: ["奇", "绝", "惊", "才", "神", "仙", "妙", "豪", "壮", "风流"] },
  { theme: "爱情", emotion: "love", words: ["相思", "情", "心", "伊人", "佳人", "红豆", "鸳鸯", "梦", "念", "郎"] },
  { theme: "友情", emotion: "warm", words: ["知己", "故人", "朋友", "相逢", "同", "酒", "欢", "天涯"] },
  { theme: "释怀", emotion: "relieved", words: ["无", "空", "忘", "归去", "风雨", "晴", "从容", "淡", "笑"] }
];

function cleanText(value: string): string {
  return value.replace(/\s+/g, "").replace(/[\u0000-\u001F]/g, "").trim();
}

function isUsefulQuote(value: string): boolean {
  const cleaned = cleanText(value);
  const cjkCount = Array.from(cleaned).filter((char) => /[\u3400-\u9fff]/.test(char)).length;
  return cjkCount >= 4 && cleaned.length <= 72;
}

function slug(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9\u4e00-\u9fa5]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);
}

function inferThemes(text: string, tags: string[] = []): { themes: string[]; emotion: string } {
  const themes = new Set<string>();
  let emotion = "classic";
  const haystack = `${text} ${tags.join(" ")}`;

  for (const tag of tags) {
    if (tag && tag.length <= 8) themes.add(tag);
  }

  for (const rule of THEME_RULES) {
    if (rule.words.some((word) => haystack.includes(word))) {
      themes.add(rule.theme);
      if (emotion === "classic") emotion = rule.emotion;
    }
  }

  if (themes.size === 0) themes.add("古诗文");
  return { themes: Array.from(themes).slice(0, 6), emotion };
}

function makeRecord(item: ChinesePoetryItem, quote: string, index: number, sourceKind: "tang" | "song-ci", fileOffset: number): QuoteRecord | null {
  const cleanedQuote = cleanText(quote);
  if (!isUsefulQuote(cleanedQuote)) return null;

  const title = item.title ?? item.rhythmic ?? "无题";
  const author = item.author ?? "佚名";
  const tags = item.tags ?? [];
  const context = (item.paragraphs ?? []).map(cleanText).join(" ").slice(0, 240);
  const { themes, emotion } = inferThemes(`${cleanedQuote} ${title} ${author} ${context}`, tags);
  const sourceName = sourceKind === "tang" ? "全唐诗" : "宋词";
  const dynasty = sourceKind === "tang" ? "唐" : "宋";
  const sourceLabel = `${sourceName} / chinese-poetry`;
  const popularBonus = tags.some((tag) => tag.includes("三百首") || tag.includes("小学") || tag.includes("初中")) ? 18 : 0;

  return {
    id: `${sourceKind}-${fileOffset}-${slug(item.id ?? `${author}-${title}`)}-${index}`,
    quote: cleanedQuote,
    title,
    author,
    dynasty,
    source: sourceLabel,
    context,
    translation: `这句出自${dynasty}代${author}《${title}》，可结合“${themes.slice(0, 3).join(" / ")}”等主题理解。`,
    themes,
    modernMeanings: themes,
    emotion,
    scene: Array.from(new Set([...tags, ...themes])).slice(0, 8),
    weight: 42 + popularBonus
  };
}

async function fetchJson(url: string): Promise<ChinesePoetryItem[]> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetch(url, { signal: controller.signal, headers: { "User-Agent": "gu-ren-said-seed" } });
    if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
    return (await response.json()) as ChinesePoetryItem[];
  } finally {
    clearTimeout(timeout);
  }
}

async function importChinesePoetry(): Promise<QuoteRecord[]> {
  if (!SHOULD_IMPORT_CHINESE_POETRY || MAX_REMOTE_QUOTES <= 0) return [];

  const records: QuoteRecord[] = [];

  async function importFiles(kind: "tang" | "song-ci", fileCount: number, makeUrl: (offset: number) => string) {
    for (let i = 0; i < fileCount && records.length < MAX_REMOTE_QUOTES; i += 1) {
      const offset = i * 1000;
      const url = makeUrl(offset);
      try {
        const items = await fetchJson(url);
        for (const item of items) {
          const paragraphs = item.paragraphs ?? [];
          for (let paragraphIndex = 0; paragraphIndex < paragraphs.length; paragraphIndex += 1) {
            const record = makeRecord(item, paragraphs[paragraphIndex], paragraphIndex, kind, offset);
            if (!record) continue;
            records.push(record);
            if (records.length >= MAX_REMOTE_QUOTES) break;
          }
          if (records.length >= MAX_REMOTE_QUOTES) break;
        }
        console.log(`Imported ${items.length} works from ${url}`);
      } catch (error) {
        console.warn(`Skip ${url}: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
  }

  await importFiles("tang", TANG_FILES, (offset) => `${TANG_BASE}/poet.tang.${offset}.json`);
  await importFiles("song-ci", SONG_CI_FILES, (offset) => `${SONG_CI_BASE}/ci.song.${offset}.json`);

  return records;
}

function makeFtsText(value: string): string {
  const cleaned = String(value ?? "").replace(/\s+/g, " ").trim();
  const cjkChars = Array.from(cleaned).filter((char) => /[\u3400-\u9fff]/.test(char)).join(" ");
  return `${cleaned} ${cjkChars}`.trim();
}

function uniqueQuotes(records: QuoteRecord[]): QuoteRecord[] {
  const byKey = new Map<string, QuoteRecord>();
  for (const record of records) {
    const key = `${record.quote}|${record.author}|${record.title}`;
    const existing = byKey.get(key);
    if (!existing || record.weight > existing.weight) byKey.set(key, record);
  }
  return Array.from(byKey.values());
}

async function main() {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  if (fs.existsSync(DB_PATH)) fs.rmSync(DB_PATH);

  const remoteQuotes = await importChinesePoetry();
  const allQuotes = uniqueQuotes([...QUOTES, ...remoteQuotes]);

  const db = new Database(DB_PATH);
  const schema = fs.readFileSync(SCHEMA_PATH, "utf-8");
  db.exec(schema);

  const insertQuote = db.prepare(`
    INSERT INTO quotes (
      id, quote, title, author, dynasty, source, context, translation,
      themes, modern_meanings, emotion, scene, weight, verified
    ) VALUES (
      @id, @quote, @title, @author, @dynasty, @source, @context, @translation,
      @themes, @modern_meanings, @emotion, @scene, @weight, 1
    )
  `);

  const insertFts = db.prepare(`
    INSERT INTO quotes_fts (
      quote_id, quote, title, author, dynasty, source, context, translation,
      themes, modern_meanings, emotion, scene
    ) VALUES (
      @id, @quote_fts, @title_fts, @author_fts, @dynasty_fts, @source_fts, @context_fts, @translation_fts,
      @themes_fts, @modern_fts, @emotion_fts, @scene_fts
    )
  `);

  const insertSlang = db.prepare(`
    INSERT INTO slang_mappings (id, patterns, keywords, themes, emotion, explanation)
    VALUES (@id, @patterns, @keywords, @themes, @emotion, @explanation)
  `);

  const tx = db.transaction(() => {
    for (const quote of allQuotes) {
      const themesText = quote.themes.join(" ");
      const modernText = quote.modernMeanings.join(" ");
      const sceneText = quote.scene.join(" ");
      const record = {
        ...quote,
        themes: JSON.stringify(quote.themes),
        modern_meanings: JSON.stringify(quote.modernMeanings),
        scene: JSON.stringify(quote.scene),
        quote_fts: makeFtsText(quote.quote),
        title_fts: makeFtsText(quote.title),
        author_fts: makeFtsText(quote.author),
        dynasty_fts: makeFtsText(quote.dynasty),
        source_fts: makeFtsText(quote.source),
        context_fts: makeFtsText(quote.context),
        translation_fts: makeFtsText(quote.translation),
        themes_fts: makeFtsText(themesText),
        modern_fts: makeFtsText(modernText),
        emotion_fts: makeFtsText(quote.emotion),
        scene_fts: makeFtsText(sceneText)
      };
      insertQuote.run(record);
      insertFts.run(record);
    }

    for (const mapping of SLANG_MAPPINGS) {
      insertSlang.run({
        id: mapping.id,
        patterns: JSON.stringify(mapping.patterns),
        keywords: JSON.stringify(mapping.keywords),
        themes: JSON.stringify(mapping.themes),
        emotion: mapping.emotion,
        explanation: mapping.explanation
      });
    }
  });

  tx();
  db.pragma("optimize");
  db.close();

  console.log(`Seeded ${allQuotes.length} quotes (${QUOTES.length} curated + ${remoteQuotes.length} imported) and ${SLANG_MAPPINGS.length} slang mappings to ${DB_PATH}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
