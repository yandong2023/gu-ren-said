import fs from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";
import { scoreQuote } from "@/lib/search";
import type { ExpandedQuery, QuoteRecord, SearchResult } from "@/lib/types";

const DB_PATH = path.join(process.cwd(), "data", "quotes.db");
let cachedDb: Database.Database | null = null;

function parseJsonArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String);
  if (typeof value !== "string") return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return value.split(/[,，\s]+/).filter(Boolean);
  }
}

function rowToQuote(row: Record<string, unknown>): QuoteRecord {
  return {
    id: String(row.id),
    quote: String(row.quote),
    title: String(row.title),
    author: String(row.author),
    dynasty: String(row.dynasty),
    source: String(row.source),
    context: String(row.context ?? ""),
    translation: String(row.translation ?? ""),
    themes: parseJsonArray(row.themes),
    modernMeanings: parseJsonArray(row.modern_meanings),
    emotion: String(row.emotion ?? ""),
    scene: parseJsonArray(row.scene),
    weight: Number(row.weight ?? 50)
  };
}

function sanitizeFtsTerm(term: string): string | null {
  const cleaned = term.replace(/["'`^*:\-]/g, " ").trim();
  if (!cleaned) return null;
  return `"${cleaned.replace(/"/g, "")}"`;
}

function getDb(): Database.Database | null {
  if (cachedDb) return cachedDb;
  if (!fs.existsSync(DB_PATH)) return null;
  cachedDb = new Database(DB_PATH, { readonly: true, fileMustExist: true });
  return cachedDb;
}

export function searchSqlite(expanded: ExpandedQuery, limit = 12): SearchResult[] {
  const db = getDb();
  if (!db) return [];
  const matchQuery = expanded.terms.map(sanitizeFtsTerm).filter((item): item is string => Boolean(item)).slice(0, 18).join(" OR ");
  if (!matchQuery) return [];

  try {
    const rows = db.prepare(`
      SELECT q.*
      FROM quotes_fts f
      JOIN quotes q ON q.id = f.quote_id
      WHERE quotes_fts MATCH ?
      ORDER BY rank
      LIMIT ?
    `).all(matchQuery, Math.max(limit * 8, 60)) as Record<string, unknown>[];

    return rows.map(rowToQuote).map((quote) => {
      const result = scoreQuote(quote, expanded);
      return { ...result, score: result.score + 10, matchedBy: Array.from(new Set([...result.matchedBy, "fts5"])) };
    }).sort((a, b) => b.score - a.score).slice(0, limit);
  } catch {
    return [];
  }
}

export function getDbStatus() {
  return { sqlite: fs.existsSync(DB_PATH), path: DB_PATH, sqliteVec: Boolean(process.env.SQLITE_VEC_PATH) };
}
