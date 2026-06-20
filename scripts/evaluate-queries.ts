import { expandQuery, mergeResults, searchInMemory } from "../lib/search";
import { searchSqlite } from "../lib/db.server";
import type { SearchResult } from "../lib/types";

type TestCase = {
  query: string;
  description: string;
  top1AnyTheme?: string[];
  top3AnyTheme?: string[];
  top3AnyId?: string[];
  forbiddenTop1Ids?: string[];
  forbiddenTop1Themes?: string[];
};

const LOVE_IDS = [
  "zhuo-wenjun-baitou-love",
  "yue-ren-ge-love",
  "shijing-jigu-love",
  "wen-tingyun-hongdou-love",
  "li-zhiyi-busuanzi-love",
  "qin-guan-queshen-love"
];

const TEST_CASES: TestCase[] = [
  {
    query: "你真好看",
    description: "夸人好看应该返回美貌/赞美类结果，不能返回释怀类结果",
    top1AnyTheme: ["美貌", "惊艳", "赞美"],
    top3AnyId: ["shijing-shuoren-beauty", "li-yannian-beauty", "li-bai-qingpingdiao-beauty", "bai-juyi-changhenge-beauty"],
    forbiddenTop1Ids: ["yueyanglou-letgo", "su-shi-dingfengbo-letgo"],
    forbiddenTop1Themes: ["释怀"]
  },
  {
    query: "你好漂亮",
    description: "漂亮类查询应该进入美貌/惊艳主题",
    top1AnyTheme: ["美貌", "惊艳", "赞美"],
    top3AnyId: ["shijing-shuoren-beauty", "li-yannian-beauty", "li-bai-qingpingdiao-beauty", "bai-juyi-changhenge-beauty"],
    forbiddenTop1Themes: ["释怀", "忧愁"]
  },
  {
    query: "我爱你",
    description: "我爱你应该返回爱情/告白/相守类精选句，不能返回单纯夸外貌",
    top1AnyTheme: ["爱情", "告白", "相守", "承诺", "相思"],
    top3AnyId: LOVE_IDS,
    forbiddenTop1Themes: ["美貌", "友情", "思乡", "释怀"]
  },
  {
    query: "我喜欢你",
    description: "我喜欢你应该偏告白、心动或暗恋",
    top1AnyTheme: ["爱情", "告白", "心动", "暗恋"],
    top3AnyId: ["yue-ren-ge-love", "zhuo-wenjun-baitou-love", "shijing-love"],
    forbiddenTop1Themes: ["美貌", "友情", "思乡"]
  },
  {
    query: "我想你",
    description: "我想你应该偏相思和深情，不应该只是泛泛爱情",
    top1AnyTheme: ["相思", "深情", "爱情"],
    top3AnyId: ["wen-tingyun-hongdou-love", "li-zhiyi-busuanzi-love", "shijing-love"],
    forbiddenTop1Themes: ["美貌", "友情", "释怀"]
  },
  {
    query: "我想和你一辈子在一起",
    description: "一辈子在一起应该偏相守和承诺",
    top1AnyTheme: ["相守", "承诺", "爱情"],
    top3AnyId: ["zhuo-wenjun-baitou-love", "shijing-jigu-love", "qin-guan-queshen-love"],
    forbiddenTop1Themes: ["美貌", "友情", "忧愁"]
  },
  {
    query: "我暗恋你很久了",
    description: "暗恋应该偏心悦、未说出口、心动",
    top1AnyTheme: ["暗恋", "心动", "告白", "爱情"],
    top3AnyId: ["yue-ren-ge-love", "shijing-love"],
    forbiddenTop1Themes: ["美貌", "友情", "思乡"]
  },
  {
    query: "我 emo 了",
    description: "emo 应该返回忧愁/失意类结果",
    top1AnyTheme: ["忧愁", "失意", "烦闷"],
    top3AnyId: ["li-bai-xuanzhou-emo"]
  },
  {
    query: "今天破防了",
    description: "破防应该偏向忧愁和烦闷，不应该是成功/希望",
    top3AnyTheme: ["忧愁", "失意", "烦闷"],
    forbiddenTop1Themes: ["希望", "成功"]
  },
  {
    query: "这事包的",
    description: "包的应该返回信心/希望/成功类结果",
    top1AnyTheme: ["希望", "信心", "成功"],
    top3AnyId: ["li-bai-xinglunan-stable"]
  },
  {
    query: "考试稳了拿下",
    description: "稳了拿下应该偏向成功和信心",
    top3AnyTheme: ["希望", "信心", "成功"]
  },
  {
    query: "太卷了想躺平",
    description: "躺平/不想卷应该返回松弛、归隐、自由类结果",
    top1AnyTheme: ["松弛", "归隐", "自由"],
    top3AnyId: ["tao-yuanming-yinju-tangping", "tao-yuanming-guiqulai"]
  },
  {
    query: "不想上班只想回家",
    description: "不想上班应该偏向归去、松弛、田园",
    top3AnyTheme: ["归隐", "松弛", "自由"]
  },
  {
    query: "这人太牛了",
    description: "太牛了应该返回赞美/才华/震撼类结果",
    top1AnyTheme: ["赞美", "才华", "震撼"],
    top3AnyId: ["du-fu-li-bai-awesome"]
  },
  {
    query: "这作品封神了",
    description: "封神应该返回赞美和震撼类结果",
    top3AnyTheme: ["赞美", "才华", "震撼"]
  },
  {
    query: "我真的会谢",
    description: "我真的会谢应该返回无语/荒诞/心累类结果",
    top3AnyTheme: ["无语", "荒诞", "复杂"]
  },
  {
    query: "这事太离谱",
    description: "离谱应该返回无语、荒诞或复杂类结果",
    top3AnyTheme: ["无语", "荒诞", "复杂"]
  },
  {
    query: "想家了",
    description: "想家应该返回思乡/漂泊/亲情类结果",
    top1AnyTheme: ["思乡", "漂泊", "亲情"],
    top3AnyId: ["wangwei-miss-home"]
  },
  {
    query: "一个人在外突然想家",
    description: "异乡想家应该进入思乡主题",
    top3AnyTheme: ["思乡", "漂泊", "亲情"]
  },
  {
    query: "算了不内耗了",
    description: "不内耗应该返回释怀/豁达/通透类结果",
    top1AnyTheme: ["释怀", "豁达", "通透"],
    top3AnyId: ["su-shi-dingfengbo-letgo", "yueyanglou-letgo"]
  },
  {
    query: "看开了没什么大不了",
    description: "看开应该返回释怀/豁达类结果",
    top3AnyTheme: ["释怀", "豁达", "通透"]
  },
  {
    query: "别放弃继续扛住",
    description: "别放弃应该返回坚持/逆境/努力类结果",
    top1AnyTheme: ["坚持", "逆境", "韧性", "努力"],
    top3AnyId: ["zhengxie-work-hard", "xunzi-work-hard"]
  },
  {
    query: "慢慢变强别急",
    description: "慢慢变强应该返回成长/努力/坚持类结果",
    top3AnyTheme: ["努力", "坚持", "成长"]
  },
  {
    query: "开心到飞起",
    description: "开心应该返回快乐/得意/畅快类结果",
    top1AnyTheme: ["快乐", "得意", "畅快"],
    top3AnyId: ["li-bai-jiangjinjiu-happy"]
  },
  {
    query: "有点心动念念不忘",
    description: "心动应该返回爱情/相思/心动类结果",
    top1AnyTheme: ["爱情", "相思", "心动"],
    top3AnyId: ["shijing-love", "yue-ren-ge-love", "wen-tingyun-hongdou-love"]
  },
  {
    query: "我们真是同频朋友",
    description: "同频朋友应该返回友情/知己类结果",
    top3AnyTheme: ["友情", "知己", "陪伴"]
  }
];

function hasAnyTheme(result: SearchResult | undefined, themes: string[] | undefined): boolean {
  if (!themes || themes.length === 0) return true;
  if (!result) return false;
  return result.themes.some((theme) => themes.includes(theme));
}

function topNHasAnyTheme(results: SearchResult[], n: number, themes: string[] | undefined): boolean {
  if (!themes || themes.length === 0) return true;
  return results.slice(0, n).some((result) => hasAnyTheme(result, themes));
}

function topNHasAnyId(results: SearchResult[], n: number, ids: string[] | undefined): boolean {
  if (!ids || ids.length === 0) return true;
  return results.slice(0, n).some((result) => ids.includes(result.id));
}

function evaluate(testCase: TestCase) {
  const expanded = expandQuery(testCase.query);
  const sqliteResults = searchSqlite(expanded, 8);
  const memoryResults = searchInMemory(expanded, 8);
  const results = mergeResults(sqliteResults, memoryResults).slice(0, 8);
  const top1 = results[0];
  const errors: string[] = [];

  if (results.length === 0) {
    errors.push("no results returned");
  }

  if (!hasAnyTheme(top1, testCase.top1AnyTheme)) {
    errors.push(`top1 theme mismatch: expected one of [${testCase.top1AnyTheme?.join(", ")}], got [${top1?.themes.join(", ")}]`);
  }

  if (!topNHasAnyTheme(results, 3, testCase.top3AnyTheme)) {
    errors.push(`top3 theme mismatch: expected one of [${testCase.top3AnyTheme?.join(", ")}], got ${results.slice(0, 3).map((r) => `${r.id}{${r.themes.join("/")}}`).join("; ")}`);
  }

  if (!topNHasAnyId(results, 3, testCase.top3AnyId)) {
    errors.push(`top3 id mismatch: expected one of [${testCase.top3AnyId?.join(", ")}], got [${results.slice(0, 3).map((r) => r.id).join(", ")}]`);
  }

  if (top1 && testCase.forbiddenTop1Ids?.includes(top1.id)) {
    errors.push(`forbidden top1 id: ${top1.id}`);
  }

  if (top1 && testCase.forbiddenTop1Themes?.some((theme) => top1.themes.includes(theme))) {
    errors.push(`forbidden top1 theme: ${top1.themes.join(", ")}`);
  }

  return { testCase, expanded, results, errors };
}

let failed = 0;

for (const testCase of TEST_CASES) {
  const result = evaluate(testCase);
  const top = result.results.slice(0, 3).map((item) => `${item.quote} —— ${item.dynasty}·${item.author}《${item.title}》 [${item.themes.join("/")}]`).join(" | ");

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
  console.error(`\n${failed}/${TEST_CASES.length} query relevance tests failed.`);
  process.exit(1);
}

console.log(`\nAll ${TEST_CASES.length} query relevance tests passed.`);
