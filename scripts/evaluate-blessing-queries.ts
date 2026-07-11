import { expandQuery, searchInMemory } from "../lib/search";

const cases: Array<{ query: string; expectedId: string; label: string }> = [
  { query: "新婚快乐", expectedId: "shijing-taoyao-wedding", label: "新婚祝福" },
  { query: "开业大吉", expectedId: "daxue-daily-renewal-opening", label: "开业祝福" },
  { query: "金榜题名", expectedId: "mengjiao-dengke-success", label: "考试祝福" },
  { query: "一路顺风", expectedId: "gaoshi-biedongda-farewell", label: "送别祝福" },
  { query: "恭喜发财", expectedId: "shiji-guanyan-prosperity", label: "财富祝福" },
  { query: "早日康复", expectedId: "shangshu-hongfan-health", label: "健康祝福" },
  { query: "新年快乐", expectedId: "wanganshi-yuanri-newyear", label: "新年祝福" },
  { query: "乔迁之喜", expectedId: "shijing-sigan-housewarming", label: "乔迁祝福" },
  { query: "步步高升", expectedId: "libai-shangliyong-career", label: "事业祝福" },
  { query: "中秋快乐", expectedId: "sushi-shuidiaogetou-reunion", label: "团圆祝福" }
];

let failed = 0;

for (const test of cases) {
  const results = searchInMemory(expandQuery(test.query), 8);
  const topIds = results.slice(0, 5).map((item) => item.id);
  const matched = topIds.includes(test.expectedId);

  if (!matched) {
    failed += 1;
    console.error(`❌ ${test.query} (${test.label})`);
    console.error(`   expected: ${test.expectedId}`);
    console.error(`   got: ${topIds.join(", ") || "no results"}`);
  } else {
    const hit = results.find((item) => item.id === test.expectedId);
    console.log(`✅ ${test.query} → ${hit?.quote}`);
  }
}

if (failed > 0) {
  console.error(`\n${failed}/${cases.length} blessing query tests failed.`);
  process.exit(1);
}

console.log(`\nAll ${cases.length} blessing query tests passed.`);
