import fs from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";
import { QUOTES, SLANG_MAPPINGS } from "../lib/data";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DATA_DIR, "quotes.db");
const SCHEMA_PATH = path.join(DATA_DIR, "schema.sql");

fs.mkdirSync(DATA_DIR, { recursive: true });
if (fs.existsSync(DB_PATH)) fs.rmSync(DB_PATH);

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
    @id, @quote, @title, @author, @dynasty, @source, @context, @translation,
    @themes_text, @modern_text, @emotion, @scene_text
  )
`);

const insertSlang = db.prepare(`
  INSERT INTO slang_mappings (id, patterns, keywords, themes, emotion, explanation)
  VALUES (@id, @patterns, @keywords, @themes, @emotion, @explanation)
`);

const tx = db.transaction(() => {
  for (const quote of QUOTES) {
    const record = {
      ...quote,
      themes: JSON.stringify(quote.themes),
      modern_meanings: JSON.stringify(quote.modernMeanings),
      scene: JSON.stringify(quote.scene),
      themes_text: quote.themes.join(" "),
      modern_text: quote.modernMeanings.join(" "),
      scene_text: quote.scene.join(" ")
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

console.log(`Seeded ${QUOTES.length} quotes and ${SLANG_MAPPINGS.length} slang mappings to ${DB_PATH}`);
