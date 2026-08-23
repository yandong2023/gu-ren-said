import {
  ENGLISH_CLASSICS,
  ENGLISH_SEO_QUERIES,
  ENGLISH_TOPICS,
  getEnglishClassicsForTopic,
  searchEnglishClassics
} from "../lib/english-classics";

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
  { query: "Small steps still matter", expectedId: "xunzi-work-hard" }
];

const failures: string[] = [];
const ids = new Set<string>();

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
