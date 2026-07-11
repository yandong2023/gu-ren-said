import { QUOTES } from "../lib/data";

const groups = [
  { name: "论语", minimum: 3, match: (source: string, title: string) => source === "论语" || title === "论语" },
  { name: "孟子", minimum: 3, match: (source: string) => source === "孟子" },
  { name: "大学", minimum: 2, match: (source: string, title: string) => source.includes("大学") || title === "大学" },
  { name: "中庸", minimum: 2, match: (source: string, title: string) => source.includes("中庸") || title === "中庸" },
  { name: "荀子", minimum: 4, match: (source: string) => source === "荀子" },
  { name: "韩非子", minimum: 3, match: (source: string) => source === "韩非子" },
  { name: "庄子", minimum: 3, match: (source: string) => source === "庄子" },
  { name: "老子/道德经", minimum: 3, match: (source: string) => source === "道德经" },
  { name: "左传", minimum: 3, match: (source: string) => source === "左传" },
  { name: "史记", minimum: 3, match: (source: string) => source === "史记" },
  { name: "战国策", minimum: 3, match: (source: string) => source === "战国策" },
  { name: "古文观止常见篇目", minimum: 5, match: (source: string) => source.startsWith("古文观止") },
  { name: "唐宋诗词精选", minimum: 12, match: (source: string, _title: string, dynasty: string) => ["唐", "北宋", "南宋", "宋"].includes(dynasty) && ["全唐诗", "宋诗", "宋词", "东坡乐府"].some((item) => source.includes(item)) }
];

let failed = 0;
console.log(`Curated corpus: ${QUOTES.length} records\n`);

for (const group of groups) {
  const records = QUOTES.filter((item) => group.match(item.source, item.title, item.dynasty));
  const status = records.length >= group.minimum ? "✅" : "❌";
  console.log(`${status} ${group.name}: ${records.length} (minimum ${group.minimum})`);
  if (records.length < group.minimum) failed += 1;
}

const sources = new Map<string, number>();
for (const item of QUOTES) sources.set(item.source, (sources.get(item.source) ?? 0) + 1);

console.log("\nTop curated sources:");
for (const [source, count] of Array.from(sources.entries()).sort((a, b) => b[1] - a[1]).slice(0, 20)) {
  console.log(`- ${source}: ${count}`);
}

if (failed > 0) {
  console.error(`\n${failed} corpus groups are below the minimum coverage threshold.`);
  process.exit(1);
}

console.log("\nAll requested corpus groups meet the first-batch coverage threshold.");
