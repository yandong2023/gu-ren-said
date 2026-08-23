import {
  ENGLISH_CLASSICS,
  ENGLISH_SEO_QUERIES,
  ENGLISH_TOPICS,
  getEnglishClassicsForTopic,
  searchEnglishClassics
} from "../lib/english-classics-wave2";

const SEARCH_CASES: Array<{ query: string; expectedId: string }> = [
  { query: "I miss you", expectedId: "shijing-love" },
  { query: "You are beautiful", expectedId: "shijing-shuoren-beauty" },
  { query: "I miss my hometown", expectedId: "wangwei-miss-home" },
  { query: "Do not give up", expectedId: "li-bai-xinglunan-stable" },
  { query: "Better days will come", expectedId: "li-bai-xinglunan-stable" },
  { query: "Let go of the past", expectedId: "su-shi-dingfengbo-letgo" },
  { query: "I feel lonely tonight", expectedId: "li-bai-xuanzhou-emo" },
  { query: "True friends stay close across distance", expectedId: "wangbo-friend" },
  { query: "Be yourself despite criticism", expectedId: "zhuangzi-xiaoyaoyou-independent-judgement" },
  { query: "Take the first step", expectedId: "laozi-64-start-step" },
  { query: "Slow down and do not rush", expectedId: "lunyu-zilu-haste-small-profit" },
  { query: "Prepare before you begin", expectedId: "zhongyong-plan-preparation" },
  { query: "Learn from everyone", expectedId: "lunyu-shuer-three-teachers" },
  { query: "Small steps still matter", expectedId: "xunzi-work-hard" },
  { query: "I love you but you do not know", expectedId: "yue-ren-ge-love" },
  { query: "I want to grow old with you", expectedId: "zhuo-wenjun-baitou-love" },
  { query: "True love survives distance", expectedId: "qin-guan-queshen-love" },
  { query: "May we share the same moon", expectedId: "sushi-shuidiaogetou-reunion" },
  { query: "Goodbye and good luck", expectedId: "gaoshi-biedongda-farewell" },
  { query: "Know yourself", expectedId: "laozi-33-self-knowledge" },
  { query: "Everyone makes mistakes", expectedId: "zuozhuan-xuangong-correct-error" },
  { query: "It is not too late to fix it", expectedId: "zhanguoce-chu-mend-fold" },
  { query: "Let your work speak for itself", expectedId: "shiji-lijiangjun-peach-plum" },
  { query: "Practice is better than theory", expectedId: "luyou-zidong-practice" },
  { query: "Step back to see the whole picture", expectedId: "sushi-xilin-blind-spot" },
  { query: "When one road closes another opens", expectedId: "luyou-youshanxi-turnaround" },
  { query: "Human life is brief", expectedId: "sushi-chibi-small-in-world" },
  { query: "Success must be earned the right way", expectedId: "lunyu-liren-proper-way" },
  { query: "Renew yourself every day", expectedId: "daxue-daily-renewal-opening" },
  { query: "Dream big", expectedId: "libai-shangliyong-career" },
  { query: "A blessing for a new home", expectedId: "shijing-sigan-housewarming" },
  { query: "We are under the same moon", expectedId: "zhangjiuling-wangyue-shared-moon" },
  { query: "Looking at the moon makes me miss home", expectedId: "li-bai-jingyesi-moon-home" },
  { query: "Life cannot be perfect", expectedId: "sushi-shuidiao-imperfection" },
  { query: "Spring is beginning quietly", expectedId: "hanyu-early-spring" },
  { query: "Autumn can still be hopeful", expectedId: "liuyuxi-autumn-crane" },
  { query: "A lonely boat in the snow", expectedId: "liuzongyuan-jiangxue-solitude" },
  { query: "May your journey have fair wind", expectedId: "wangwan-beigushan-sail" },
  { query: "I watched my friend sail away", expectedId: "libai-yellow-crane-farewell" },
  { query: "I miss my mother", expectedId: "mengjiao-youziyin-mother" },
  { query: "Students can surpass teachers", expectedId: "hanyu-shishuo-student-teacher" },
  { query: "Review the old to learn the new", expectedId: "lunyu-weizheng-review-new" },
  { query: "Teachers and students grow together", expectedId: "liji-xueji-teaching-learning" },
  { query: "Do not believe every book blindly", expectedId: "mengzi-jinxin-books-critical" },
  { query: "Treat others as you wish to be treated", expectedId: "lunyu-weilinggong-golden-rule" },
  { query: "Stay ambitious as you grow older", expectedId: "caocao-guisu-old-steed" },
  { query: "Hardship should not break your ambition", expectedId: "wangbo-old-stronger" }
];

const failures: string[] = [];
const ids = new Set<string>();

if (ENGLISH_CLASSICS.length < 110) failures.push(`Expected at least 110 English classics, received ${ENGLISH_CLASSICS.length}.`);
if (ENGLISH_TOPICS.length < 31) failures.push(`Expected at least 31 English topics, received ${ENGLISH_TOPICS.length}.`);

for (const classic of ENGLISH_CLASSICS) {
  if (ids.has(classic.id)) failures.push(`Duplicate English classic id: ${classic.id}`);
  ids.add(classic.id);

  if (!classic.chinese.quote || !classic.chinese.source) failures.push(`${classic.id} is missing its Chinese source record.`);
  if (!classic.pinyin || !classic.literalTranslation || !classic.naturalMeaning) failures.push(`${classic.id} is missing bilingual display fields.`);
  if (classic.searchTerms.length < 4) failures.push(`${classic.id} needs more English search terms.`);
  if (classic.topicSlugs.length === 0) failures.push(`${classic.id} is not assigned to a topic.`);
}

for (const topic of ENGLISH_TOPICS) {
  const items = getEnglishClassicsForTopic(topic.slug, 20);
  if (items.length === 0) failures.push(`Topic has no classics: ${topic.slug}`);
}

for (const testCase of SEARCH_CASES) {
  const results = searchEnglishClassics(testCase.query, 3);
  if (results[0]?.id !== testCase.expectedId) {
    failures.push(`${testCase.query}: expected ${testCase.expectedId}, received ${results.map((item) => item.id).join(", ") || "no results"}`);
  }
}

for (const query of ENGLISH_SEO_QUERIES) {
  if (searchEnglishClassics(query, 1).length === 0) failures.push(`SEO query has no result: ${query}`);
}

if (failures.length > 0) {
  console.error("English corpus checks failed:\n" + failures.map((failure) => `- ${failure}`).join("\n"));
  process.exit(1);
}

console.log(`English corpus checks passed: ${ENGLISH_CLASSICS.length} classics, ${ENGLISH_TOPICS.length} topics, ${SEARCH_CASES.length} ranking cases.`);
