import { CHENGYU_RECORD_COUNT, searchChengyu } from "../lib/chengyu-large";

type Case = {
  query: string;
  expectedAny: string[];
};

const MIN_CHENGYU_RECORD_COUNT = 1500;

const CASES: Case[] = [
  { query: "表面一套背后一套", expectedAny: ["阳奉阴违", "两面三刀", "表里不一", "口是心非"] },
  { query: "说话前后矛盾", expectedAny: ["自相矛盾", "前后矛盾", "前后不一", "言行不一"] },
  { query: "很会装", expectedAny: ["装腔作势", "装模作样", "故弄玄虚", "故作高深"] },
  { query: "想太多", expectedAny: ["杞人忧天", "庸人自扰", "患得患失"] },
  { query: "突然有转机", expectedAny: ["柳暗花明", "峰回路转", "否极泰来", "绝处逢生"] },
  { query: "效率很低", expectedAny: ["事倍功半", "徒劳无功", "劳而无功"] },
  { query: "很努力但很累", expectedAny: ["孜孜不倦", "废寝忘食", "夜以继日", "任重道远", "全力以赴"] },
  { query: "没人知道", expectedAny: ["默默无闻", "鲜为人知", "不为人知", "无人问津"] },
  { query: "很有创意", expectedAny: ["别出心裁", "独具匠心", "别具一格", "匠心独运"] },
  { query: "太老套了", expectedAny: ["千篇一律", "陈词滥调", "老生常谈", "墨守成规"] }
];

let failed = false;
console.log(`Chengyu record count: ${CHENGYU_RECORD_COUNT}`);

if (CHENGYU_RECORD_COUNT < MIN_CHENGYU_RECORD_COUNT) {
  console.error(`Expected Chengyu record count >= ${MIN_CHENGYU_RECORD_COUNT}, got ${CHENGYU_RECORD_COUNT}`);
  failed = true;
}

for (const item of CASES) {
  const results = searchChengyu(item.query, 5);
  const top = results[0];
  const candidates = results.map((result) => result.idiom);
  const passed = Boolean(top) && item.expectedAny.includes(top.idiom);
  console.log(`${passed ? "PASS" : "FAIL"} ${item.query} => ${top?.idiom ?? "无结果"} | top5: ${candidates.join("、")}`);
  if (!passed) failed = true;
}

if (failed) {
  process.exitCode = 1;
}
