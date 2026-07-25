import { runSearch } from "../lib/search-service.server";
import type { SearchResult } from "../lib/types";

type TestCase = {
  query: string;
  description: string;
  top1AnyTheme?: string[];
  forbiddenTop1Themes: string[];
  forbiddenTop1Ids?: string[];
  allowEmpty?: boolean;
  expectEmpty?: boolean;
  expectClarification?: boolean;
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
    expectEmpty: true
  },
  {
    query: "脑子有问题",
    description: "歧义辱骂或健康描述不能进入古文召回，必须提示用户把含义说具体",
    forbiddenTop1Themes: [],
    expectEmpty: true,
    expectClarification: true
  },
  {
    query: "这人有病",
    description: "可能是辱骂也可能是健康描述，不能硬配古文",
    forbiddenTop1Themes: [],
    expectEmpty: true,
    expectClarification: true
  },
  {
    query: "精神有问题",
    description: "精神健康描述具有医学和辱骂歧义，必须先澄清",
    forbiddenTop1Themes: [],
    expectEmpty: true,
    expectClarification: true
  },
  {
    query: "神经病",
    description: "攻击性健康词不能直接映射成古文",
    forbiddenTop1Themes: [],
    expectEmpty: true,
    expectClarification: true
  },
  {
    query: "脑残",
    description: "攻击性智力评价不能通过关键词硬配古文",
    forbiddenTop1Themes: [],
    expectEmpty: true,
    expectClarification: true
  },
  {
    query: "我不想躺平",
    description: "不想躺平不能返回归隐和松弛类结果",
    forbiddenTop1Themes: ["松弛", "归隐", "自由", "不争"],
    allowEmpty: true
  },
  {
    query: "我还没释怀",
    description: "尚未释怀不能返回已经放下、豁达通透的结果",
    forbiddenTop1Themes: ["释怀", "豁达", "通透", "放下"],
    allowEmpty: true
  },
  {
    query: "我不想发财",
    description: "否定发财意愿不能触发财运祝福",
    forbiddenTop1Themes: ["祝福", "财富", "富足", "生意"],
    forbiddenTop1Ids: ["shiji-guanyan-prosperity"],
    allowEmpty: true
  },
  {
    query: "我不想结婚",
    description: "不想结婚不能触发新婚祝福",
    forbiddenTop1Themes: ["祝福", "新婚", "爱情", "家庭"],
    forbiddenTop1Ids: ["shijing-taoyao-wedding"],
    allowEmpty: true
  },
  {
    query: "我不想回家",
    description: "不想回家不能被理解成想家",
    forbiddenTop1Themes: ["思乡", "归家", "亲情"],
    allowEmpty: true
  },
  {
    query: "我不想上岸",
    description: "不想上岸不能触发考试成功或金榜题名祝福",
    forbiddenTop1Themes: ["祝福", "考试", "成功", "金榜题名"],
    forbiddenTop1Ids: ["mengjiao-dengke-success"],
    allowEmpty: true
  },
  {
    query: "不开心是不可能的",
    description: "双重否定表达不能按“不开心”处理成悲伤",
    forbiddenTop1Themes: ["忧愁", "失意", "烦闷", "孤独"],
    allowEmpty: true
  },
  {
    query: "我不是不喜欢你",
    description: "双重否定的感情表达不能直接按拒绝处理",
    forbiddenTop1Themes: [],
    expectEmpty: true,
    expectClarification: true
  },
  {
    query: "我饿了",
    description: "生理状态不是古文表达意图，不能硬凑",
    forbiddenTop1Themes: [],
    expectEmpty: true
  },
  {
    query: "失眠怎么办",
    description: "健康求助问题不能被包装成古文答案",
    forbiddenTop1Themes: [],
    expectEmpty: true
  },
  {
    query: "怎么减肥",
    description: "行动建议问题不属于古文反查",
    forbiddenTop1Themes: [],
    expectEmpty: true
  },
  {
    query: "感冒了怎么办",
    description: "医疗求助问题不能硬配古文",
    forbiddenTop1Themes: [],
    expectEmpty: true
  },
  {
    query: "今天天气怎么样",
    description: "事实查询不是古文表达意图",
    forbiddenTop1Themes: [],
    expectEmpty: true
  }
];

function hasAnyTheme(result: SearchResult | undefined, themes: string[] | undefined): boolean {
  if (!themes || themes.length === 0) return true;
  if (!result) return false;
  return result.themes.some((theme) => themes.includes(theme));
}

async function evaluate(testCase: TestCase) {
  const payload = await runSearch(testCase.query, 8, { enhance: false });
  const clarificationMessage = payload.message;
  const results = payload.results;
  const top1 = results[0];
  const errors: string[] = [];

  if (testCase.expectClarification && !clarificationMessage) {
    errors.push("expected a clarification guard, but the query was allowed into search");
  }

  if (!testCase.expectClarification && clarificationMessage) {
    errors.push(`unexpected clarification guard: ${clarificationMessage}`);
  }

  if (testCase.expectEmpty && top1) {
    errors.push(`expected no results, got ${top1.id}: ${top1.quote}`);
  }

  if (!top1) {
    if (!testCase.allowEmpty && !testCase.expectEmpty && !testCase.expectClarification) errors.push("no results returned");
    return { testCase, payload, results, errors, clarificationMessage };
  }

  if (!testCase.allowEmpty && !testCase.expectEmpty && !hasAnyTheme(top1, testCase.top1AnyTheme)) {
    errors.push(`top1 theme mismatch: expected one of [${testCase.top1AnyTheme?.join(", ")}], got [${top1.themes.join(", ")}]`);
  }

  if (testCase.forbiddenTop1Themes.some((theme) => top1.themes.includes(theme))) {
    errors.push(`forbidden top1 theme: ${top1.themes.join(", ")}`);
  }

  if (testCase.forbiddenTop1Ids?.includes(top1.id)) {
    errors.push(`forbidden top1 id: ${top1.id}`);
  }

  return { testCase, payload, results, errors, clarificationMessage };
}

const requestedQuery = process.env.NEGATIVE_QUERY?.trim();
const selectedCases = requestedQuery ? TEST_CASES.filter((item) => item.query === requestedQuery) : TEST_CASES;

if (requestedQuery && selectedCases.length === 0) {
  console.error(`Unknown NEGATIVE_QUERY: ${requestedQuery}`);
  process.exit(1);
}

let failed = 0;

for (const testCase of selectedCases) {
  const result = await evaluate(testCase);
  const top = result.results.slice(0, 3).map((item) => `${item.id}: ${item.quote} [${item.themes.join("/")}] score=${item.score}`).join(" | ");

  if (result.errors.length > 0) {
    failed += 1;
    console.error(`\n❌ ${testCase.query}`);
    console.error(`   ${testCase.description}`);
    console.error(`   Expanded terms: ${result.payload.expanded.terms.join(", ")}`);
    console.error(`   Avoid themes: ${(result.payload.expanded.avoidThemes ?? []).join(", ")}`);
    console.error(`   Clarification: ${result.clarificationMessage ?? "无"}`);
    console.error(`   Top3: ${top}`);
    for (const error of result.errors) console.error(`   - ${error}`);
  } else {
    const output = result.clarificationMessage ? `需要澄清：${result.clarificationMessage}` : result.results[0]?.quote ?? "无结果（符合预期）";
    console.log(`✅ ${testCase.query} → ${output}`);
  }
}

if (failed > 0) {
  console.error(`\n${failed}/${selectedCases.length} risky query tests failed.`);
  process.exit(1);
}

console.log(`\nAll ${selectedCases.length} selected risky query tests passed.`);
