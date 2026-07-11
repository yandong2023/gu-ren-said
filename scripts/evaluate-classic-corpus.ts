import { expandQuery, searchInMemory } from "../lib/search";

const cases: Array<{ query: string; expectedIds: string[]; label: string }> = [
  { query: "团队有分歧也要好好合作", expectedIds: ["lunyu-zilu-harmony-difference", "mengzi-gongsunchou-people-united"], label: "和而不同 / 人和" },
  { query: "不要急于求成只看眼前小利", expectedIds: ["lunyu-zilu-haste-small-profit"], label: "长期主义" },
  { query: "项目要提前准备做好预案", expectedIds: ["zhongyong-plan-preparation", "zuozhuan-xianggong-prepared-risk", "zhanguoce-qi-three-burrows"], label: "规划与风险" },
  { query: "利用AI工具提高工作效率", expectedIds: ["xunzi-qinxue-use-tools"], label: "善假于物" },
  { query: "不要照搬旧经验 要根据现实创新", expectedIds: ["hanfeizi-wudu-innovation"], label: "因时而变" },
  { query: "不要和认知有限的人一直争论", expectedIds: ["zhuangzi-qiushui-limited-view", "sushi-xilin-blind-spot"], label: "认知局限" },
  { query: "人要有自知之明", expectedIds: ["laozi-33-self-knowledge"], label: "自知" },
  { query: "犯错了及时改正 现在补救还不晚", expectedIds: ["zuozhuan-xuangong-correct-error", "zhanguoce-chu-mend-fold"], label: "改错补救" },
  { query: "真正有实力不需要自吹自擂", expectedIds: ["shiji-lijiangjun-peach-plum"], label: "口碑与实力" },
  { query: "实践出真知 不要只会纸上谈兵", expectedIds: ["luyou-zidong-practice"], label: "实践" },
  { query: "事情突然有了转机", expectedIds: ["luyou-youshanxi-turnaround"], label: "柳暗花明" },
  { query: "好人才需要被看见 也需要好平台", expectedIds: ["hanyu-mashuo-talent-recognition"], label: "伯乐与千里马" },
  { query: "生日快乐", expectedIds: ["shijing-tianbao-birthday"], label: "生日祝福" }
];

let failed = 0;

for (const test of cases) {
  const results = searchInMemory(expandQuery(test.query), 8);
  const topIds = results.slice(0, 5).map((item) => item.id);
  const matched = test.expectedIds.some((id) => topIds.includes(id));

  if (!matched) {
    failed += 1;
    console.error(`❌ ${test.query} (${test.label})`);
    console.error(`   expected one of: ${test.expectedIds.join(", ")}`);
    console.error(`   got: ${topIds.join(", ") || "no results"}`);
  } else {
    const hit = results.find((item) => test.expectedIds.includes(item.id));
    console.log(`✅ ${test.query} → ${hit?.quote}`);
  }
}

if (failed > 0) {
  console.error(`\n${failed}/${cases.length} classic corpus relevance tests failed.`);
  process.exit(1);
}

console.log(`\nAll ${cases.length} classic corpus relevance tests passed.`);
