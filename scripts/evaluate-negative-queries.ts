import { expandQuery, mergeResults, searchInMemory } from "../lib/search";
import { searchSqlite } from "../lib/db.server";
import type { SearchResult } from "../lib/types";

type TestCase = {
  query: string;
  description: string;
  top1AnyTheme?: string[];
  forbiddenTop1Themes: string[];
  forbiddenTop1Ids?: string[];
  allowEmpty?: boolean;
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
  },
  {
    query: "我不开心",
    description: "不开心不能因为包含开心而返回快乐得意类结果",
    top1AnyTheme: ["忧愁", "失意", "烦闷", "孤独"],
    forbiddenTop1Themes: ["快乐", "得意", "畅快"]
  },
  {
    query: "我不喜欢你",
    description: "不喜欢不能被理解成喜欢或告白；没有合适古文时宁可不返回",
    forbiddenTop1Themes: ["爱情", "告白", "心动", "暗恋", "相思", "相守", "承诺", "深情"],
    allowEmpty: true
  },
  {
    query: "我没信心",
    description: "没信心不能返回胜券在握、稳了等正向结果",
    top1AnyTheme: ["忧愁", "失意", "烦闷", "无奈", "逆境"],
    forbiddenTop1Themes: ["希望", "信心", "成功"]
  },
  {
    query: "我不想努力了",
    description: "不想努力不能强行返回坚持和努力类鸡汤",
    top1AnyTheme: ["松弛", "归隐", "自由", "压力", "疲惫"],
    forbiddenTop1Themes: ["努力", "坚持", "成长", "成功"],
    allowEmpty: true
  },
  {
    query: "今天吃什么",
    description: "与古诗文表达意图无关的泛问题不应该硬凑结果",
    forbiddenTop1Themes: [],
    allowEmpty: true
  }
];

function hasAnyTheme(result: SearchResult | undefined, themes: string[] | undefined): boolean {
  if (!themes || themes.length === 0) return true;
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
    if (!testCase.allowEmpty) errors.push("no results returned");
    return { testCase, expanded, results, errors };
  }

  if (!hasAnyTheme(top1, testCase.top1AnyTheme)) {
    errors.push(`top1 theme mismatch: expected one of [${testCase.top1AnyTheme?.join(", ")}], got [${top1.themes.join(", ")}]`);
  }

  if (testCase.forbiddenTop1Themes.some((theme) => top1.themes.includes(theme))) {
    errors.push(`forbidden top1 theme: ${top1.themes.join(", ")}`);
  }

  if (testCase.forbiddenTop1Ids?.includes(top1.id)) {
    errors.push(`forbidden top1 id: ${top1.id}`);
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
    console.error(`   Avoid themes: ${(result.expanded.avoidThemes ?? []).join(", ")}`);
    console.error(`   Top3: ${top}`);
    for (const error of result.errors) console.error(`   - ${error}`);
  } else {
    console.log(`✅ ${testCase.query} → ${result.results[0]?.quote ?? "无结果（符合预期）"}`);
  }
}

if (failed > 0) {
  console.error(`\n${failed}/${TEST_CASES.length} negative query tests failed.`);
  process.exit(1);
}

console.log(`\nAll ${TEST_CASES.length} negative query tests passed.`);
