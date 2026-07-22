import {
  CHENGYU_RECORDS,
  CHENGYU_RECORD_COUNT,
  PUBLISHED_CHENGYU_QUERIES,
  getPreferredChengyuQuery,
  isChengyuIdiomQuery,
  searchChengyu
} from "../lib/chengyu-large";

type Case = {
  query: string;
  expectedAny: string[];
};

const MIN_CHENGYU_RECORD_COUNT = 1500;
const GENERIC_LANDING_QUERIES = new Set(["常用成语", "成语表达", "更有文化的表达"]);

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

function normalize(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, "");
}

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

const idiomKeys = new Set(CHENGYU_RECORDS.map((record) => normalize(record.idiom)));
const genericKeys = new Set(Array.from(GENERIC_LANDING_QUERIES).map(normalize));
const invalidPublishedQueries = PUBLISHED_CHENGYU_QUERIES.filter((query) => {
  const key = normalize(query);
  return idiomKeys.has(key) || genericKeys.has(key);
});

if (invalidPublishedQueries.length > 0) {
  console.error(`Published Chengyu queries must be natural-language descriptions, found invalid queries: ${invalidPublishedQueries.slice(0, 10).join("、")}`);
  failed = true;
} else {
  console.log(`PASS published landing queries exclude all ${idiomKeys.size} idioms and generic placeholders`);
}

const recordsWithNaturalQuery = CHENGYU_RECORDS.filter((record) =>
  record.modernMeanings.some((meaning) => {
    const key = normalize(meaning);
    return !idiomKeys.has(key) && !genericKeys.has(key);
  })
);
const missingRedirectTargets = recordsWithNaturalQuery.filter((record) => !getPreferredChengyuQuery(record.idiom));

if (missingRedirectTargets.length > 0) {
  console.error(`Missing natural-language redirect targets: ${missingRedirectTargets.slice(0, 10).map((record) => record.idiom).join("、")}`);
  failed = true;
} else {
  console.log(`PASS ${recordsWithNaturalQuery.length} idiom URLs have natural-language redirect targets`);
}

const exampleRedirect = getPreferredChengyuQuery("众所周知");
const exampleTop = searchChengyu("大家都知道", 1)[0];

if (!isChengyuIdiomQuery("众所周知")) {
  console.error("Expected 众所周知 to be recognized as an exact idiom query");
  failed = true;
}

if (exampleRedirect !== "大家都知道") {
  console.error(`Expected 众所周知 to redirect to 大家都知道, got ${exampleRedirect ?? "null"}`);
  failed = true;
} else {
  console.log("PASS 众所周知 => 大家都知道");
}

if (exampleTop?.idiom !== "众所周知") {
  console.error(`Expected 大家都知道 to return 众所周知, got ${exampleTop?.idiom ?? "无结果"}`);
  failed = true;
} else {
  console.log("PASS 大家都知道 => 众所周知");
}

if (failed) {
  process.exitCode = 1;
}
