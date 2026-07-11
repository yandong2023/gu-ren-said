import { expandQuery, mergeResults, searchInMemory } from "../lib/search";
import { searchSqlite } from "../lib/db.server";

const query = "正常商业竞争 不要总是做些小动作";
const expanded = expandQuery(query);
const results = mergeResults(
  searchSqlite(expanded, 8),
  searchInMemory(expanded, 8)
).slice(0, 8);

const top = results[0];
const expectedIds = new Set([
  "lunyu-liren-proper-way",
  "lunyu-yanyuan-help-good"
]);

if (!top) {
  console.error("❌ fair competition query returned no result");
  process.exit(1);
}

if (!expectedIds.has(top.id)) {
  console.error(`❌ unexpected top result: ${top.id} ${top.quote}`);
  console.error(results.slice(0, 5).map((item) => `${item.id}: ${item.quote} [${item.themes.join("/")}]`).join("\n"));
  process.exit(1);
}

if (!top.themes.some((theme) => ["正当竞争", "诚信", "规则", "正道"].includes(theme))) {
  console.error(`❌ top result lacks fair-competition themes: ${top.themes.join(", ")}`);
  process.exit(1);
}

console.log(`✅ ${query} → ${top.quote} —— ${top.dynasty}·${top.author}《${top.title}》`);
