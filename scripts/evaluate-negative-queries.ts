import { expandQuery, mergeResults, searchInMemory } from "../lib/search";
import { searchSqlite } from "../lib/db.server";
import type { SearchResult } from "../lib/types";

type TestCase = {
  query: string;
  description: string;
  top1AnyTheme: string[];
  forbiddenTop1Themes: string[];
  forbiddenTop1Ids?: string[];
};

const TEST_CASES: TestCase[] = [
  {
    query: "你真丑",
    description: "负向外貌查询不能误返回夸好看的美貌类结果",
    top1AnyTheme: ["负向外貌", "外貌", "反讽", "讽刺", "吐槽"],
    forbiddenTop1Themes: ["美貌", "赞美", "惊艳", "容貌"],
    forbiddenTop1Ids: ["shijing-shuoren-beauty", "li-yannian-beauty", "li-bai-qingpingdiao-beauty", "bai-juyi-changhenge-beauty"]
  },
  {
    query: "不好看",
    description: "包含“好看”的否定表达不能触发正向 beauty 结果",
    top1AnyTheme: ["负向外貌", "外貌", "反讽", "讽刺", "吐槽"],
    forbiddenTop1Themes: ["美貌", "赞美", "惊艳", "容貌"]
  },
  {
    query: "不漂亮",
    description: "包含“漂亮”的否定表达不能触发正向 beauty 结果",
    top1AnyTheme: ["负向外貌", "外貌", "反讽", "讽刺", "吐槽"],
    forbiddenTop1Themes: ["美貌", "赞美", "惊艳", "容貌"]
  }
];

function hasAnyTheme(result: SearchResult | undefined, themes: string[]): boolean {
  if (!result) return false;
  return result.themes.some((theme) => themes.includes(theme));
}

function evaluate(testCase: TestCase) {
  const expanded = expandQuery(testCase.query);
  const sqliteResults = searchSqlite(expanded, 8);
  const memoryResults = searchInMemory(expanded, 8);
  const results = mergeResults(sqliteResults, memoryResults).slice(0, 8);
  const top1 = results[0];
  const errors: string[] = [];

  if (!top1) {
    errors.push("no results returned");
    return { testCase, expanded, results, errors };
  }

  if (!hasAnyTheme(top1, testCase.top1AnyTheme)) {
    errors.push(`top1 theme mismatch: expected one of [${testCase.top1AnyTheme.join(", ")}], got [${top1.themes.join(", ")}]`);
  }

  if (testCase.forbiddenTop1Themes.some((theme) => top1.themes.includes(theme))) {
    errors.push(`forbidden beauty-like top1 theme: ${top1.themes.join(", ")}`);
  }

  if (testCase.forbiddenTop1Ids?.includes(top1.id)) {
    errors.push(`forbidden beauty top1 id: ${top1.id}`);
  }

  return { testCase, expanded, results, errors };
}

let failed = 0;

for (const testCase of TEST_CASES) {
  const result = evaluate(testCase);
  const top = result.results.slice(0, 3).map((item) => `${item.id}: ${item.quote} [${item.themes.join("/")}] score=${item.score}`).join(" | ");

  if (result.errors.length > 0) {
    failed += 1;
    console.error(`\n❌ ${testCase.query}`);
    console.error(`   ${testCase.description}`);
    console.error(`   Expanded terms: ${result.expanded.terms.join(", ")}`);
    console.error(`   Top3: ${top}`);
    for (const error of result.errors) console.error(`   - ${error}`);
  } else {
    console.log(`✅ ${testCase.query} → ${result.results[0]?.quote ?? "无结果"}`);
  }
}

if (failed > 0) {
  console.error(`\n${failed}/${TEST_CASES.length} negative query tests failed.`);
  process.exit(1);
}

console.log(`\nAll ${TEST_CASES.length} negative query tests passed.`);
