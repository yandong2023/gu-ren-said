import { QUOTES } from "./data";
import { normalizeEnglishQuery } from "./english-url";
import type { QuoteRecord } from "./types";

export type EnglishClassic = {
  id: string;
  chinese: QuoteRecord;
  pinyin: string;
  literalTranslation: string;
  naturalMeaning: string;
  titleEn: string;
  authorEn: string;
  eraEn: string;
  sourceEn: string;
  whyItFits: string;
  culturalNote?: string;
  searchTerms: string[];
  topicSlugs: string[];
  weight: number;
};

export type EnglishSearchResult = EnglishClassic & {
  score: number;
  matchedTopics: string[];
};

export type EnglishTopic = {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  intro: string;
  aliases: string[];
  exampleQueries: string[];
};

type EnglishMetadata = Omit<EnglishClassic, "chinese">;

const QUOTE_BY_ID = new Map(QUOTES.map((quote) => [quote.id, quote]));

function makeClassic(metadata: EnglishMetadata): EnglishClassic {
  const chinese = QUOTE_BY_ID.get(metadata.id);
  if (!chinese) {
    throw new Error(`English classic references a missing Chinese quote: ${metadata.id}`);
  }
  return { ...metadata, chinese };
}

export const ENGLISH_TOPICS: EnglishTopic[] = [
  {
    slug: "love",
    title: "Chinese Poems and Quotes About Love",
    shortTitle: "Love",
    description: "Verified lines from classical Chinese poetry about affection, romance, and a heart that cannot forget.",
    intro: "These lines express love without inventing a modern quotation. Each result keeps the original Chinese, pinyin, an English reading, and a traceable source.",
    aliases: ["love", "romance", "romantic", "in love", "affection", "heart", "beloved"],
    exampleQueries: ["I love you", "I cannot stop thinking about her", "a poetic way to confess love"]
  },
  {
    slug: "missing-someone",
    title: "Chinese Poems About Missing Someone",
    shortTitle: "Missing someone",
    description: "Classical Chinese lines for longing, absence, and someone who remains on your mind.",
    intro: "Longing is one of the richest themes in Chinese poetry. These verified lines range from quiet affection to the ache of distance.",
    aliases: ["miss you", "missing someone", "miss someone", "longing", "yearning", "thinking of you", "far away", "apart"],
    exampleQueries: ["I miss you", "we are far apart", "I keep thinking about someone"]
  },
  {
    slug: "beauty",
    title: "Chinese Poems and Quotes About Beauty",
    shortTitle: "Beauty",
    description: "Elegant classical Chinese lines for praising a smile, eyes, presence, and unforgettable beauty.",
    intro: "Rather than using generic compliments, these lines draw on images of flowers, clouds, spring wind, and luminous eyes.",
    aliases: ["beautiful", "beauty", "pretty", "gorgeous", "stunning", "lovely", "her smile", "her eyes"],
    exampleQueries: ["You are beautiful", "Her smile is unforgettable", "a poetic compliment for her"]
  },
  {
    slug: "friendship",
    title: "Chinese Quotes and Poems About Friendship",
    shortTitle: "Friendship",
    description: "Verified classical Chinese lines about true friends, distance, understanding, and harmony without conformity.",
    intro: "Chinese classics often describe friendship as closeness of mind rather than physical distance or constant agreement.",
    aliases: ["friend", "friendship", "true friend", "best friend", "friends far apart", "understand each other", "team harmony"],
    exampleQueries: ["True friends stay close across distance", "A friend who understands me", "We disagree but remain friends"]
  },
  {
    slug: "homesickness",
    title: "Chinese Poems About Homesickness and Family",
    shortTitle: "Homesickness",
    description: "Classical Chinese poetry about missing home, family, and familiar places while living far away.",
    intro: "Homesickness has a distinct place in Chinese poetry, especially around festivals, travel, and life away from family.",
    aliases: ["homesick", "homesickness", "miss home", "miss my family", "far from home", "living abroad", "away from family"],
    exampleQueries: ["I miss my hometown", "I miss my family", "I feel alone far from home"]
  },
  {
    slug: "sadness-and-loneliness",
    title: "Chinese Poems About Sadness and Loneliness",
    shortTitle: "Sadness",
    description: "Classical Chinese lines for sorrow, loneliness, emotional exhaustion, and grief that will not disappear on command.",
    intro: "These lines do not force sadness into a cheerful slogan. They give difficult feelings a truthful and memorable form.",
    aliases: ["sad", "sadness", "lonely", "loneliness", "sorrow", "heartbroken", "grief", "down", "empty", "tired of everything"],
    exampleQueries: ["I feel lonely tonight", "My sadness keeps growing", "I am emotionally exhausted"]
  },
  {
    slug: "letting-go",
    title: "Chinese Quotes and Poems About Letting Go",
    shortTitle: "Letting go",
    description: "Verified lines from Chinese classics about release, acceptance, endings, and no longer being ruled by the past.",
    intro: "Letting go in Chinese classics is often less about forgetting and more about recovering freedom, proportion, and inner steadiness.",
    aliases: ["let go", "letting go", "move on", "past", "breakup", "goodbye", "release", "accept", "closure", "forget each other"],
    exampleQueries: ["Let go of the past", "It is time to move on", "Sometimes love means saying goodbye"]
  },
  {
    slug: "perseverance",
    title: "Chinese Quotes About Perseverance and Hope",
    shortTitle: "Perseverance",
    description: "Classical Chinese lines about resilience, patient progress, courage after failure, and hope beyond hardship.",
    intro: "These sayings distinguish empty motivation from durable effort: begin, accumulate, endure, and keep sight of the larger horizon.",
    aliases: ["persevere", "perseverance", "do not give up", "never give up", "stay strong", "keep going", "resilience", "hope", "hard times", "failure"],
    exampleQueries: ["Do not give up", "Better days will come", "Small steps still matter"]
  },
  {
    slug: "inner-peace",
    title: "Chinese Quotes and Poems About Inner Peace",
    shortTitle: "Inner peace",
    description: "Classical Chinese lines about calm, simplicity, freedom from noise, and a mind not controlled by praise or blame.",
    intro: "Inner peace in the Chinese classics is not passive numbness. It is the ability to see clearly without being pulled in every direction.",
    aliases: ["peace", "inner peace", "calm", "quiet", "slow down", "simple life", "free from stress", "not care what people think", "balanced"],
    exampleQueries: ["I want a quieter life", "Do not let criticism control you", "Find peace in simple things"]
  },
  {
    slug: "life",
    title: "Chinese Quotes and Poems About Life",
    shortTitle: "Life",
    description: "Verified classical Chinese lines about enjoying the present, weathering change, and choosing what deserves your attention.",
    intro: "These lines hold celebration and restraint together: enjoy what is good, endure what is hard, and do not confuse passing conditions with the whole of life.",
    aliases: ["life", "enjoy life", "live in the moment", "present moment", "success and failure", "ups and downs", "meaning of life"],
    exampleQueries: ["Enjoy the moment", "Life has ups and downs", "Do not waste the good days"]
  },
  {
    slug: "wisdom",
    title: "Ancient Chinese Quotes About Wisdom",
    shortTitle: "Wisdom",
    description: "Source-verified teachings on priorities, patience, judgment, principles, and learning from others.",
    intro: "The point is not to collect decorative quotations, but to recover ideas in their original works and apply them with context.",
    aliases: ["wisdom", "wise", "advice", "priorities", "patience", "principles", "judgment", "decision", "long term"],
    exampleQueries: ["Do not rush", "Know what matters first", "Stand by your principles"]
  },
  {
    slug: "learning-and-growth",
    title: "Chinese Quotes About Learning and Growth",
    shortTitle: "Learning",
    description: "Classical Chinese teachings on steady study, reflection, practice, preparation, and learning from everyone.",
    intro: "These lines treat learning as a disciplined cycle: observe widely, ask carefully, think clearly, distinguish well, and put knowledge into action.",
    aliases: ["learn", "learning", "study", "growth", "improve", "teacher", "practice", "knowledge", "education", "small steps"],
    exampleQueries: ["Learn from everyone", "Knowledge requires practice", "Progress comes from small steps"]
  },
  {
    slug: "courage-and-principles",
    title: "Chinese Quotes About Courage and Principles",
    shortTitle: "Courage",
    description: "Classical Chinese sayings about integrity under wealth, hardship, pressure, praise, and criticism.",
    intro: "Courage here means more than bold action. It means keeping your center when circumstances try to buy, frighten, or flatter you away from it.",
    aliases: ["courage", "brave", "principle", "principles", "integrity", "pressure", "criticism", "be yourself", "stand firm", "temptation"],
    exampleQueries: ["Stand by your principles", "Be yourself despite criticism", "Stay firm under pressure"]
  }
];

export const ENGLISH_CLASSICS: EnglishClassic[] = [
  makeClassic({
    id: "shijing-love",
    pinyin: "Qīng qīng zǐ jīn, yōu yōu wǒ xīn.",
    literalTranslation: "Green, green is your collar; long, long is the yearning in my heart.",
    naturalMeaning: "You stay on my mind, and my longing does not fade.",
    titleEn: "Zi Jin (The Blue Collar)",
    authorEn: "Anonymous",
    eraEn: "Pre-Qin China",
    sourceEn: "The Book of Songs",
    whyItFits: "A compact expression of sustained longing for someone who is absent or silent.",
    culturalNote: "The collar identifies the person being longed for; the repeated words make the feeling linger.",
    searchTerms: ["i miss you", "i keep thinking about you", "cannot stop thinking about her", "cannot stop thinking about him", "longing for someone", "you are always on my mind", "quiet love", "unspoken love", "yearning"],
    topicSlugs: ["love", "missing-someone"],
    weight: 108
  }),
  makeClassic({
    id: "shijing-shuoren-beauty",
    pinyin: "Qiǎo xiào qiàn xī, měi mù pàn xī.",
    literalTranslation: "Her charming smile is lovely; her beautiful eyes glance brightly.",
    naturalMeaning: "Your smile and your eyes are captivating.",
    titleEn: "Shuo Ren (The Stately Lady)",
    authorEn: "Anonymous",
    eraEn: "Pre-Qin China",
    sourceEn: "The Book of Songs",
    whyItFits: "It praises beauty through expression and presence rather than a flat statement about appearance.",
    searchTerms: ["you are beautiful", "beautiful smile", "beautiful eyes", "her smile is lovely", "pretty", "gorgeous", "captivating", "poetic compliment"],
    topicSlugs: ["beauty", "love"],
    weight: 112
  }),
  makeClassic({
    id: "li-yannian-beauty",
    pinyin: "Běi fāng yǒu jiā rén, jué shì ér dú lì.",
    literalTranslation: "In the north there is a beautiful woman, peerless and standing alone.",
    naturalMeaning: "She is strikingly beautiful and entirely her own.",
    titleEn: "Song of Li Yannian",
    authorEn: "Li Yannian",
    eraEn: "Han dynasty",
    sourceEn: "Book of Han, Biographies of Imperial Relatives",
    whyItFits: "The line joins exceptional beauty with an independent, unforgettable presence.",
    searchTerms: ["she is stunning", "peerless beauty", "beautiful and independent", "unforgettable woman", "she stands out", "gorgeous woman", "one of a kind"],
    topicSlugs: ["beauty"],
    weight: 107
  }),
  makeClassic({
    id: "li-bai-qingpingdiao-beauty",
    pinyin: "Yún xiǎng yī shang huā xiǎng róng, chūn fēng fú jiàn lù huá nóng.",
    literalTranslation: "Clouds would borrow her robes and flowers her face; spring wind brushes the railing, and the dew glows richly.",
    naturalMeaning: "Her beauty calls to mind clouds, blossoms, spring wind, and luminous dew.",
    titleEn: "Qingping Tune, No. 1",
    authorEn: "Li Bai",
    eraEn: "Tang dynasty",
    sourceEn: "Complete Tang Poems",
    whyItFits: "Li Bai turns praise into a scene of clouds, flowers, spring air, and light.",
    searchTerms: ["poetic way to say beautiful", "beauty like flowers", "she looks radiant", "beautiful as spring", "ethereal beauty", "elegant compliment", "she is gorgeous"],
    topicSlugs: ["beauty", "love"],
    weight: 105
  }),
  makeClassic({
    id: "wangbo-friend",
    pinyin: "Hǎi nèi cún zhī jǐ, tiān yá ruò bǐ lín.",
    literalTranslation: "If one has a true friend within the four seas, even the edge of the world feels like next door.",
    naturalMeaning: "True friends remain close, however far apart they are.",
    titleEn: "Farewell to Vice-Prefect Du, Leaving for Shuzhou",
    authorEn: "Wang Bo",
    eraEn: "Tang dynasty",
    sourceEn: "Complete Tang Poems",
    whyItFits: "One of the clearest classical Chinese expressions of friendship surviving distance.",
    searchTerms: ["true friends stay close", "long distance friendship", "friends far apart", "distance cannot break friendship", "best friend far away", "friendship across distance", "you are always close"],
    topicSlugs: ["friendship", "missing-someone"],
    weight: 112
  }),
  makeClassic({
    id: "wangwei-miss-home",
    pinyin: "Dú zài yì xiāng wéi yì kè, měi féng jiā jié bèi sī qīn.",
    literalTranslation: "Alone in a foreign place, I am a stranger; at every festival, I miss my family all the more.",
    naturalMeaning: "Being far from home makes special days feel even lonelier.",
    titleEn: "Thinking of My Brothers East of the Mountains on the Ninth Day of the Ninth Month",
    authorEn: "Wang Wei",
    eraEn: "Tang dynasty",
    sourceEn: "Complete Tang Poems",
    whyItFits: "It directly connects distance, festival time, loneliness, and longing for family.",
    searchTerms: ["i miss home", "i miss my family", "homesick", "far from home", "living abroad", "away from family", "alone on a holiday", "miss my hometown"],
    topicSlugs: ["homesickness", "missing-someone", "sadness-and-loneliness"],
    weight: 116
  }),
  makeClassic({
    id: "su-shi-dingfengbo-letgo",
    pinyin: "Huí shǒu xiàng lái xiāo sè chù, guī qù, yě wú fēng yǔ yě wú qíng.",
    literalTranslation: "Looking back at the bleak place I came through, I return: there is neither storm nor clear sky.",
    naturalMeaning: "After weathering the storm, I no longer let hardship or ease define me.",
    titleEn: "Calming the Waves: Do Not Listen to the Rain Beating Through the Woods",
    authorEn: "Su Shi",
    eraEn: "Northern Song dynasty",
    sourceEn: "Dongpo Yuefu",
    whyItFits: "The line looks back on difficulty from a place beyond both fear and forced optimism.",
    culturalNote: "The poem begins during a rainstorm, but the ending turns weather into a metaphor for changing circumstances.",
    searchTerms: ["let go of the past", "move on", "after the storm", "accept what happened", "no longer afraid", "inner peace after hardship", "leave the past behind", "life has ups and downs"],
    topicSlugs: ["letting-go", "inner-peace", "life"],
    weight: 118
  }),
  makeClassic({
    id: "yueyanglou-letgo",
    pinyin: "Bù yǐ wù xǐ, bù yǐ jǐ bēi.",
    literalTranslation: "Do not rejoice because of external things, nor grieve because of personal loss.",
    naturalMeaning: "Keep your balance through success and setback.",
    titleEn: "Memorial to Yueyang Tower",
    authorEn: "Fan Zhongyan",
    eraEn: "Northern Song dynasty",
    sourceEn: "Collected Works of Fan Zhongyan",
    whyItFits: "It describes emotional steadiness that is not controlled by possessions, status, or personal fortune.",
    searchTerms: ["stay balanced", "do not let success change you", "do not let failure destroy you", "emotional balance", "ups and downs", "not controlled by circumstances", "remain calm"],
    topicSlugs: ["inner-peace", "life", "letting-go"],
    weight: 104
  }),
  makeClassic({
    id: "li-bai-xinglunan-stable",
    pinyin: "Cháng fēng pò làng huì yǒu shí, zhí guà yún fān jì cāng hǎi.",
    literalTranslation: "A time will come to ride the long wind and break the waves; I will set my cloudlike sail straight across the vast sea.",
    naturalMeaning: "Your chance will come. Keep going toward the larger horizon.",
    titleEn: "Hard Is the Way of the World, No. 1",
    authorEn: "Li Bai",
    eraEn: "Tang dynasty",
    sourceEn: "Complete Tang Poems",
    whyItFits: "It holds hope after frustration without pretending the road has been easy.",
    searchTerms: ["better days will come", "do not give up", "keep going", "hope after failure", "your time will come", "overcome difficulties", "future will be better", "believe in yourself"],
    topicSlugs: ["perseverance", "life"],
    weight: 120
  }),
  makeClassic({
    id: "zhengxie-work-hard",
    pinyin: "Qiān mó wàn jī hái jiān jìng, rèn ěr dōng xī nán běi fēng.",
    literalTranslation: "Ground a thousand times and struck ten thousand, still it stands firm, whatever wind blows from any direction.",
    naturalMeaning: "Stay strong no matter how many setbacks come or where the pressure comes from.",
    titleEn: "Bamboo in the Rock",
    authorEn: "Zheng Xie",
    eraEn: "Qing dynasty",
    sourceEn: "Collected Works of Zheng Xie",
    whyItFits: "The bamboo becomes a vivid image of resilience under repeated pressure.",
    searchTerms: ["stay strong", "resilience", "do not break", "keep standing", "many setbacks", "pressure from all sides", "never give up", "be tough"],
    topicSlugs: ["perseverance", "courage-and-principles"],
    weight: 116
  }),
  makeClassic({
    id: "xunzi-work-hard",
    pinyin: "Bù jī kuǐ bù, wú yǐ zhì qiān lǐ; bù jī xiǎo liú, wú yǐ chéng jiāng hǎi.",
    literalTranslation: "Without accumulating small steps, one cannot reach a thousand miles; without gathering small streams, rivers and seas cannot form.",
    naturalMeaning: "Great progress is built from small, repeated actions.",
    titleEn: "Encouraging Learning",
    authorEn: "Xunzi",
    eraEn: "Warring States period",
    sourceEn: "Xunzi",
    whyItFits: "It is a precise classical statement of compounding effort and patient progress.",
    searchTerms: ["small steps matter", "progress takes time", "consistent effort", "build good habits", "one step at a time", "slow progress", "daily improvement", "long journey"],
    topicSlugs: ["perseverance", "learning-and-growth"],
    weight: 118
  }),
  makeClassic({
    id: "tao-yuanming-yinju-tangping",
    pinyin: "Cǎi jú dōng lí xià, yōu rán jiàn nán shān.",
    literalTranslation: "I pluck chrysanthemums by the eastern fence and, at ease, see the southern mountain.",
    naturalMeaning: "Peace appears when you step away from noise and live simply.",
    titleEn: "Drinking Wine, No. 5",
    authorEn: "Tao Yuanming",
    eraEn: "Eastern Jin dynasty",
    sourceEn: "Collected Works of Tao Yuanming",
    whyItFits: "A quiet everyday action opens into an unforced encounter with nature.",
    searchTerms: ["simple life", "quiet life", "inner peace", "slow down", "escape the noise", "peace in nature", "calm countryside", "live simply"],
    topicSlugs: ["inner-peace", "life"],
    weight: 114
  }),
  makeClassic({
    id: "tao-yuanming-guiqulai",
    pinyin: "Guī qù lái xī, tián yuán jiāng wú hú bù guī?",
    literalTranslation: "Return, return! The fields are going wild—why not go home?",
    naturalMeaning: "Leave the life that drains you and return to what truly matters.",
    titleEn: "Return Home",
    authorEn: "Tao Yuanming",
    eraEn: "Eastern Jin dynasty",
    sourceEn: "Collected Works of Tao Yuanming",
    whyItFits: "It voices the moment of choosing a more authentic life over exhausting ambition.",
    searchTerms: ["i want to go home", "quit the rat race", "return to myself", "life is draining me", "leave a stressful job", "choose a simple life", "go back to what matters"],
    topicSlugs: ["inner-peace", "letting-go", "life"],
    weight: 105
  }),
  makeClassic({
    id: "li-bai-jiangjinjiu-happy",
    pinyin: "Rén shēng dé yì xū jìn huān, mò shǐ jīn zūn kōng duì yuè.",
    literalTranslation: "When life goes well, enjoy it fully; do not leave the golden cup empty beneath the moon.",
    naturalMeaning: "Celebrate the good moments while they are here.",
    titleEn: "Bring in the Wine",
    authorEn: "Li Bai",
    eraEn: "Tang dynasty",
    sourceEn: "Complete Tang Poems",
    whyItFits: "It gives joyful permission to be fully present when life offers a moment worth celebrating.",
    searchTerms: ["enjoy the moment", "celebrate life", "live while you can", "good times", "do not waste today", "be happy now", "enjoy success", "seize the day"],
    topicSlugs: ["life"],
    weight: 110
  }),
  makeClassic({
    id: "li-bai-xuanzhou-emo",
    pinyin: "Chōu dāo duàn shuǐ shuǐ gèng liú, jǔ bēi xiāo chóu chóu gèng chóu.",
    literalTranslation: "Cut water with a blade and it flows all the more; raise a cup to drown sorrow and sorrow grows deeper.",
    naturalMeaning: "Trying to force grief away can make it return even more strongly.",
    titleEn: "Farewell to Secretary Shu Yun at Xie Tiao Tower in Xuanzhou",
    authorEn: "Li Bai",
    eraEn: "Tang dynasty",
    sourceEn: "Complete Tang Poems",
    whyItFits: "The image captures frustration with feelings that cannot simply be cut off or numbed.",
    searchTerms: ["i feel sad", "my sadness keeps growing", "cannot escape sorrow", "lonely tonight", "heartbroken", "emotionally exhausted", "trying to forget makes it worse", "grief"],
    topicSlugs: ["sadness-and-loneliness", "letting-go"],
    weight: 115
  }),
  makeClassic({
    id: "du-fu-li-bai-awesome",
    pinyin: "Bǐ luò jīng fēng yǔ, shī chéng qì guǐ shén.",
    literalTranslation: "When his brush falls, wind and rain are startled; when the poem is complete, ghosts and spirits weep.",
    naturalMeaning: "His talent is so powerful that it seems to shake heaven and earth.",
    titleEn: "Twenty Rhymes for Li Bai",
    authorEn: "Du Fu",
    eraEn: "Tang dynasty",
    sourceEn: "Complete Tang Poems",
    whyItFits: "It is an extravagant but memorable way to praise extraordinary creative talent.",
    searchTerms: ["incredible talent", "you are amazing", "brilliant writer", "masterpiece", "creative genius", "powerful art", "praise someone's work", "extraordinary skill"],
    topicSlugs: ["life"],
    weight: 92
  }),
  makeClassic({
    id: "lunyu-shuer-three-teachers",
    pinyin: "Sān rén xíng, bì yǒu wǒ shī yān. Zé qí shàn zhě ér cóng zhī, qí bù shàn zhě ér gǎi zhī.",
    literalTranslation: "When three people walk together, one of them must be my teacher. I follow what is good in them and correct in myself what is not good.",
    naturalMeaning: "Everyone can teach you something—through an example to follow or a mistake to avoid.",
    titleEn: "Analects 7: Shu Er",
    authorEn: "Confucius",
    eraEn: "Pre-Qin China",
    sourceEn: "The Analects",
    whyItFits: "It turns ordinary encounters into a disciplined practice of learning and self-correction.",
    searchTerms: ["learn from everyone", "everyone can teach you", "humility", "find a teacher everywhere", "learn from good and bad examples", "keep learning", "self improvement"],
    topicSlugs: ["learning-and-growth", "wisdom"],
    weight: 112
  }),
  makeClassic({
    id: "lunyu-zilu-harmony-difference",
    pinyin: "Jūn zǐ hé ér bù tóng, xiǎo rén tóng ér bù hé.",
    literalTranslation: "The noble person is harmonious without being identical; the petty person is identical without true harmony.",
    naturalMeaning: "Real harmony allows disagreement; shallow agreement can hide deeper conflict.",
    titleEn: "Analects 13: Zi Lu",
    authorEn: "Confucius",
    eraEn: "Pre-Qin China",
    sourceEn: "The Analects",
    whyItFits: "It distinguishes respectful difference from mere conformity.",
    searchTerms: ["agree to disagree", "harmony without conformity", "we can disagree", "different opinions", "healthy friendship", "team disagreement", "respect differences", "do not blindly agree"],
    topicSlugs: ["friendship", "wisdom"],
    weight: 110
  }),
  makeClassic({
    id: "lunyu-zilu-haste-small-profit",
    pinyin: "Yù sù zé bù dá, jiàn xiǎo lì zé dà shì bù chéng.",
    literalTranslation: "If you desire speed, you will not arrive; if you chase small gains, great work will not be completed.",
    naturalMeaning: "Do not let impatience or short-term rewards ruin the larger goal.",
    titleEn: "Analects 13: Zi Lu",
    authorEn: "Confucius",
    eraEn: "Pre-Qin China",
    sourceEn: "The Analects",
    whyItFits: "It links haste and short-term thinking to failure at work that matters.",
    searchTerms: ["do not rush", "haste makes waste", "slow down", "long term thinking", "do not chase quick wins", "patience", "short term gain", "great work takes time"],
    topicSlugs: ["wisdom", "learning-and-growth"],
    weight: 116
  }),
  makeClassic({
    id: "mengzi-tengwen-great-man",
    pinyin: "Fù guì bù néng yín, pín jiàn bù néng yí, wēi wǔ bù néng qū.",
    literalTranslation: "Wealth and honor cannot corrupt him, poverty and low status cannot move him, and force cannot make him bend.",
    naturalMeaning: "Hold your principles through temptation, hardship, and pressure.",
    titleEn: "Mencius: Teng Wen Gong II",
    authorEn: "Mencius",
    eraEn: "Warring States period",
    sourceEn: "Mencius",
    whyItFits: "It defines integrity by the pressures it can withstand.",
    searchTerms: ["stand by your principles", "integrity", "do not bend under pressure", "stay true to yourself", "resist temptation", "be brave", "moral courage", "hold your ground"],
    topicSlugs: ["courage-and-principles", "wisdom"],
    weight: 118
  }),
  makeClassic({
    id: "zhuangzi-xiaoyaoyou-independent-judgement",
    pinyin: "Qiě jǔ shì yù zhī ér bù jiā quàn, jǔ shì fēi zhī ér bù jiā jǔ.",
    literalTranslation: "Praised by the whole world, he is not further encouraged; condemned by the whole world, he is not discouraged.",
    naturalMeaning: "Let neither praise nor criticism control who you are.",
    titleEn: "Free and Easy Wandering",
    authorEn: "Zhuangzi",
    eraEn: "Warring States period",
    sourceEn: "Zhuangzi",
    whyItFits: "It describes an inner standard strong enough to survive both approval and rejection.",
    searchTerms: ["do not care what people think", "be yourself", "ignore criticism", "not controlled by praise", "inner confidence", "stay true to yourself", "public opinion", "self worth"],
    topicSlugs: ["inner-peace", "courage-and-principles"],
    weight: 120
  }),
  makeClassic({
    id: "zhuangzi-dazongshi-forget-river",
    pinyin: "Xiāng rú yǐ mò, bù rú xiāng wàng yú jiāng hú.",
    literalTranslation: "Rather than moistening each other with foam, it is better to forget each other in the rivers and lakes.",
    naturalMeaning: "Sometimes the kinder choice is to let each other go and live freely.",
    titleEn: "The Great and Venerable Teacher",
    authorEn: "Zhuangzi",
    eraEn: "Warring States period",
    sourceEn: "Zhuangzi",
    whyItFits: "It contrasts mutual struggle in a depleted place with freedom in a larger world.",
    culturalNote: "The full passage describes fish stranded when a spring dries up. The line is about freedom from a desperate condition, not casual indifference.",
    searchTerms: ["sometimes love means letting go", "goodbye", "move on from a relationship", "let each other go", "breakup closure", "set someone free", "separate peacefully", "forget each other"],
    topicSlugs: ["letting-go", "love"],
    weight: 114
  }),
  makeClassic({
    id: "laozi-64-start-step",
    pinyin: "Qiān lǐ zhī xíng, shǐ yú zú xià.",
    literalTranslation: "A journey of a thousand miles begins beneath one's feet.",
    naturalMeaning: "Begin with the first real step, however small.",
    titleEn: "Tao Te Ching, Chapter 64",
    authorEn: "Laozi",
    eraEn: "Spring and Autumn period",
    sourceEn: "Tao Te Ching",
    whyItFits: "It turns an overwhelming distance into one immediate action.",
    searchTerms: ["take the first step", "just start", "begin today", "long journey", "start small", "stop procrastinating", "one step at a time", "new beginning"],
    topicSlugs: ["perseverance", "learning-and-growth"],
    weight: 120
  }),
  makeClassic({
    id: "zhongyong-plan-preparation",
    pinyin: "Fán shì yù zé lì, bù yù zé fèi.",
    literalTranslation: "In all things, preparation leads to success; lack of preparation leads to failure.",
    naturalMeaning: "Prepare before you begin if you want the work to stand.",
    titleEn: "Doctrine of the Mean",
    authorEn: "Traditionally attributed to Zisi",
    eraEn: "Warring States period",
    sourceEn: "Book of Rites: Doctrine of the Mean",
    whyItFits: "It states the practical value of preparation in the fewest possible words.",
    searchTerms: ["prepare before you begin", "planning matters", "be prepared", "success needs preparation", "make a plan", "do your homework", "prepare for failure", "project planning"],
    topicSlugs: ["wisdom", "learning-and-growth"],
    weight: 113
  }),
  makeClassic({
    id: "zhongyong-learn-practice",
    pinyin: "Bó xué zhī, shěn wèn zhī, shèn sī zhī, míng biàn zhī, dǔ xíng zhī.",
    literalTranslation: "Study broadly, question carefully, think cautiously, distinguish clearly, and practice earnestly.",
    naturalMeaning: "Learn widely, ask well, think clearly, judge carefully, and then act.",
    titleEn: "Doctrine of the Mean",
    authorEn: "Traditionally attributed to Zisi",
    eraEn: "Warring States period",
    sourceEn: "Book of Rites: Doctrine of the Mean",
    whyItFits: "It presents learning as a full cycle rather than passive information gathering.",
    searchTerms: ["how to learn", "study and practice", "think clearly", "ask good questions", "knowledge into action", "learning process", "critical thinking", "keep improving"],
    topicSlugs: ["learning-and-growth", "wisdom"],
    weight: 112
  }),
  makeClassic({
    id: "daxue-order-priority",
    pinyin: "Wù yǒu běn mò, shì yǒu zhōng shǐ. Zhī suǒ xiān hòu, zé jìn dào yǐ.",
    literalTranslation: "Things have roots and branches; affairs have endings and beginnings. To know what comes first and what follows is to approach the Way.",
    naturalMeaning: "Know what matters first, and do not confuse the root with the branches.",
    titleEn: "The Great Learning",
    authorEn: "Traditionally associated with Zengzi",
    eraEn: "Pre-Qin China",
    sourceEn: "Book of Rites: The Great Learning",
    whyItFits: "It frames good judgment as the ability to distinguish foundations, details, and proper sequence.",
    searchTerms: ["know your priorities", "what matters first", "focus on the important things", "root cause", "do not confuse priorities", "first things first", "plan in the right order", "focus"],
    topicSlugs: ["wisdom", "learning-and-growth"],
    weight: 114
  })
];

export const ENGLISH_SEO_QUERIES = [
  "I love you",
  "I miss you",
  "You are beautiful",
  "I miss my hometown",
  "I miss my family",
  "Do not give up",
  "Better days will come",
  "Let go of the past",
  "I feel lonely tonight",
  "True friends stay close across distance",
  "Be yourself despite criticism",
  "Take the first step",
  "Slow down and do not rush",
  "Enjoy the moment",
  "Stay strong under pressure",
  "Learn from everyone",
  "Prepare before you begin",
  "Small steps still matter",
  "Sometimes love means letting go",
  "I want a quieter life"
] as const;

const STOPWORDS = new Set([
  "a", "an", "and", "are", "as", "at", "be", "but", "by", "can", "do", "for", "from", "have", "how", "i", "in", "is", "it", "me", "my", "of", "on", "or", "say", "so", "someone", "that", "the", "their", "them", "they", "this", "to", "want", "way", "we", "what", "when", "with", "you", "your"
]);

function tokens(value: string) {
  return normalizeEnglishQuery(value)
    .split(" ")
    .filter((token) => token.length > 1 && !STOPWORDS.has(token));
}

function phraseMatches(query: string, phrase: string) {
  const normalizedPhrase = normalizeEnglishQuery(phrase);
  if (!normalizedPhrase) return false;
  return query === normalizedPhrase || query.includes(normalizedPhrase) || normalizedPhrase.includes(query);
}

function matchedTopicSlugs(query: string) {
  const queryTokens = new Set(tokens(query));
  return ENGLISH_TOPICS.filter((topic) => topic.aliases.some((alias) => {
    const normalizedAlias = normalizeEnglishQuery(alias);
    if (query.includes(normalizedAlias)) return true;
    const aliasTokens = tokens(alias);
    return aliasTokens.length > 0 && aliasTokens.every((token) => queryTokens.has(token));
  })).map((topic) => topic.slug);
}

export function searchEnglishClassics(rawQuery: string, limit = 6): EnglishSearchResult[] {
  const query = normalizeEnglishQuery(rawQuery);
  if (query.length < 2) return [];

  const queryTokens = new Set(tokens(query));
  const topicMatches = matchedTopicSlugs(query);

  const scored = ENGLISH_CLASSICS.map((classic) => {
    let score = 0;
    const matchedTopics = classic.topicSlugs.filter((slug) => topicMatches.includes(slug));

    score += matchedTopics.length * 42;

    for (const term of classic.searchTerms) {
      const normalizedTerm = normalizeEnglishQuery(term);
      if (query === normalizedTerm) score += 120;
      else if (phraseMatches(query, normalizedTerm)) score += 72;

      const termTokens = new Set(tokens(normalizedTerm));
      for (const token of queryTokens) {
        if (termTokens.has(token)) score += token.length >= 7 ? 15 : 10;
      }
    }

    const searchableText = normalizeEnglishQuery([
      classic.naturalMeaning,
      classic.literalTranslation,
      classic.whyItFits,
      classic.titleEn,
      classic.authorEn,
      ...classic.searchTerms
    ].join(" "));

    for (const token of queryTokens) {
      if (searchableText.includes(token)) score += token.length >= 7 ? 10 : 5;
    }

    if (score > 0) score += classic.weight / 10;
    return { ...classic, score, matchedTopics };
  });

  return scored
    .filter((result) => result.score >= 20)
    .sort((a, b) => b.score - a.score || b.weight - a.weight)
    .slice(0, Math.min(Math.max(limit, 1), 10));
}

export function getEnglishTopic(slug: string) {
  return ENGLISH_TOPICS.find((topic) => topic.slug === slug);
}

export function getEnglishClassicsForTopic(slug: string, limit = 12) {
  return ENGLISH_CLASSICS
    .filter((classic) => classic.topicSlugs.includes(slug))
    .sort((a, b) => b.weight - a.weight)
    .slice(0, limit);
}

export function getEnglishClassicsByIds(ids: string[]) {
  const wanted = new Set(ids);
  return ENGLISH_CLASSICS.filter((classic) => wanted.has(classic.id));
}

export function shouldIndexEnglishQuery(query: string) {
  const normalized = normalizeEnglishQuery(query);
  return ENGLISH_SEO_QUERIES.some((item) => normalizeEnglishQuery(item) === normalized);
}
