CREATE TABLE IF NOT EXISTS quotes (
  id TEXT PRIMARY KEY,
  quote TEXT NOT NULL,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  dynasty TEXT NOT NULL,
  source TEXT NOT NULL,
  context TEXT,
  translation TEXT,
  themes TEXT NOT NULL,
  modern_meanings TEXT NOT NULL,
  emotion TEXT,
  scene TEXT NOT NULL,
  weight INTEGER DEFAULT 50,
  verified INTEGER DEFAULT 1,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE VIRTUAL TABLE IF NOT EXISTS quotes_fts USING fts5(
  quote_id UNINDEXED,
  quote,
  title,
  author,
  dynasty,
  source,
  context,
  translation,
  themes,
  modern_meanings,
  emotion,
  scene,
  tokenize = 'unicode61 remove_diacritics 2'
);

CREATE TABLE IF NOT EXISTS slang_mappings (
  id TEXT PRIMARY KEY,
  patterns TEXT NOT NULL,
  keywords TEXT NOT NULL,
  themes TEXT NOT NULL,
  emotion TEXT,
  explanation TEXT
);

-- Optional sqlite-vec plan:
-- 1. Compile/install sqlite-vec locally.
-- 2. Set SQLITE_VEC_PATH=/absolute/path/to/vec0.so or sqlite_vec.dylib.
-- 3. Add a vector table, for example:
--    SELECT load_extension($SQLITE_VEC_PATH);
--    CREATE VIRTUAL TABLE quote_vec USING vec0(embedding float[384]);
-- 4. Store quote_id in a side table or metadata column according to your sqlite-vec version.
--
-- MVP already works with FTS5 + semantic slang mapping and consumes 0 LLM tokens.
