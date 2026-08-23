import { QUOTES } from "./data";
import {
  ENGLISH_CLASSICS as BASE_ENGLISH_CLASSICS,
  ENGLISH_SEO_QUERIES as BASE_ENGLISH_SEO_QUERIES,
  ENGLISH_TOPICS as BASE_ENGLISH_TOPICS
} from "./english-classics";
import { normalizeEnglishQuery } from "./english-url";
import { EXTRA_QUOTES } from "./extra-data";
import type {
  EnglishClassic,
  EnglishSearchResult,
  EnglishTopic
} from "./english-classics";
import type { QuoteRecord } from "./types";

export type { EnglishClassic, EnglishSearchResult, EnglishTopic } from "./english-classics";

const QUOTE_BY_ID = new Map<string, QuoteRecord>(
  [...QUOTES, ...EXTRA_QUOTES].map((quote) => [quote.id, quote])
);

function classic(
  id: string,
  pinyin: string,
  literalTranslation: string,
  naturalMeaning: string,
  titleEn: string,
  authorEn: string,
  eraEn: string,
  sourceEn: string,
  whyItFits: string,
  searchTerms: string[],
  topicSlugs: string[],
  weight: number,
  culturalNote?: string
): EnglishClassic {
  const chinese = QUOTE_BY_ID.get(id);
  if (!chinese) throw new Error(`Expanded English classic references a missing Chinese quote: ${id}`);

  return {
    id,
    chinese,
    pinyin,
    literalTranslation,
    naturalMeaning,
    titleEn,
    authorEn,
    eraEn,
    sourceEn,
    whyItFits,
    culturalNote,
    searchTerms,
    topicSlugs,
    weight
  };
}

export const EXTRA_ENGLISH_TOPICS: EnglishTopic[] = [
  {
    slug: "commitment-and-marriage",
    title: "Chinese Poems and Quotes About Commitment and Marriage",
    shortTitle: "Commitment",
    description: "Source-verified lines about lifelong devotion, marriage, faithful love, and growing old together.",
    intro: "These lines range from private promises to traditional wedding blessings. The original wording and source remain visible so romantic use does not erase historical context.",
    aliases: ["commitment", "marriage", "wedding", "faithful love", "grow old together", "lifelong love", "forever together", "devotion"],
    exampleQueries: ["I want to grow old with you", "A Chinese wedding blessing", "Love that lasts a lifetime"]
  },
  {
    slug: "farewell-and-distance",
    title: "Chinese Poems About Farewell and Distance",
    shortTitle: "Farewell",
    description: "Classical Chinese lines for parting, long-distance relationships, journeys, and wishing someone well on the road ahead.",
    intro: "Farewell poetry does not treat distance as one emotion. It can carry grief, confidence, loyalty, blessing, or a promise that separation will not end the bond.",
    aliases: ["farewell", "goodbye", "parting", "separation", "long distance", "far apart", "journey", "leave", "road ahead"],
    exampleQueries: ["Goodbye and good luck", "True love survives distance", "We are far apart but still connected"]
  },
  {
    slug: "family-and-reunion",
    title: "Chinese Poems and Quotes About Family and Reunion",
    shortTitle: "Family & reunion",
    description: "Verified lines about family, shared moonlight, reunion, health, home, and blessings across distance.",
    intro: "Family feeling in Chinese classics often gathers around home, festivals, health, longevity, and the moon shared by people who cannot be together.",
    aliases: ["family", "reunion", "parents", "home", "together again", "shared moon", "health and longevity", "family blessing"],
    exampleQueries: ["May my family stay safe", "May we share the same moon", "A blessing for health and longevity"]
  },
  {
    slug: "ambition-and-success",
    title: "Chinese Quotes and Poems About Ambition and Success",
    shortTitle: "Ambition & success",
    description: "Classical lines about large ambitions, earned success, wider horizons, talent, opportunity, and the exhilaration of achievement.",
    intro: "These lines distinguish ambition from empty boasting. They connect success to vision, preparation, opportunity, integrity, and the ability to keep climbing.",
    aliases: ["ambition", "success", "career", "achievement", "dream big", "promotion", "opportunity", "recognition", "goal", "vision"],
    exampleQueries: ["Dream big", "Congratulations on your success", "Climb higher to see farther"]
  },
  {
    slug: "work-and-leadership",
    title: "Ancient Chinese Quotes About Work and Leadership",
    shortTitle: "Work & leadership",
    description: "Source-verified teachings on strategy, responsibility, teamwork, preparation, talent, tools, discretion, and execution.",
    intro: "The strongest work-related classics are not productivity slogans. They ask leaders to prepare, recognize people, use tools well, carry responsibility, and protect standards.",
    aliases: ["work", "leadership", "management", "strategy", "teamwork", "planning", "execution", "responsibility", "talent", "business"],
    exampleQueries: ["Leadership means responsibility", "Strategy wins before action", "Use the right tools"]
  },
  {
    slug: "mistakes-and-renewal",
    title: "Chinese Quotes About Mistakes, Recovery, and Renewal",
    shortTitle: "Mistakes & renewal",
    description: "Classical teachings about admitting mistakes, repairing damage, learning from history, daily renewal, and finding another way forward.",
    intro: "These sources do not pretend mistakes never happened. They emphasize correction, repair, reflection, renewal, and the possibility of a new opening after loss.",
    aliases: ["mistake", "mistakes", "fix it", "repair", "recovery", "renewal", "start again", "second chance", "learn from the past", "new beginning"],
    exampleQueries: ["Everyone makes mistakes", "It is not too late to fix it", "Renew yourself every day"]
  },
  {
    slug: "perspective-and-self-knowledge",
    title: "Chinese Quotes About Perspective and Self-Knowledge",
    shortTitle: "Perspective",
    description: "Classical Chinese lines about knowing yourself, seeing blind spots, widening experience, focus, humility, and proportion.",
    intro: "A narrow view can come from limited experience, distraction, or being too close to the problem. These lines encourage distance, attention, and honest self-knowledge.",
    aliases: ["perspective", "self knowledge", "know yourself", "blind spot", "bigger picture", "wider view", "focus", "limited experience", "humility"],
    exampleQueries: ["Know yourself", "Step back to see the whole picture", "People are limited by their experience"]
  },
  {
    slug: "fairness-and-integrity",
    title: "Chinese Quotes About Fairness and Integrity",
    shortTitle: "Fairness & integrity",
    description: "Source-verified teachings on equal rules, honest competition, proper means, helping others do good, and resisting unjust advantage.",
    intro: "Integrity becomes meaningful when money, status, competition, and power create an incentive to bend the rules. These lines make that pressure explicit.",
    aliases: ["fairness", "integrity", "honesty", "equal rules", "fair competition", "right way", "justice", "ethics", "do the right thing"],
    exampleQueries: ["Rules should apply to everyone", "Success must be earned the right way", "Compete fairly"]
  },
  {
    slug: "time-and-impermanence",
    title: "Chinese Poems and Quotes About Time and Impermanence",
    shortTitle: "Time & impermanence",
    description: "Classical Chinese reflections on brief human life, change, decline, renewal, and our small place in a much larger world.",
    intro: "Impermanence in the classics can feel humbling rather than hopeless. The same awareness that life is brief can also place private trouble in a wider frame.",
    aliases: ["time", "impermanence", "life is short", "brief life", "change", "passing", "universe", "small in the world", "nothing lasts"],
    exampleQueries: ["Human life is brief", "Everything changes", "We are small in the universe"]
  },
  {
    slug: "celebrations-and-new-beginnings",
    title: "Chinese Poems and Blessings for Celebrations and New Beginnings",
    shortTitle: "New beginnings",
    description: "Verified lines for weddings, birthdays, success, a new year, a new home, a new venture, and a hopeful beginning.",
    intro: "These blessings are tied to real works and occasions. Each page explains what the source originally celebrates instead of presenting a generic generated greeting.",
    aliases: ["celebration", "new beginning", "birthday", "new year", "wedding blessing", "new home", "success", "congratulations", "fresh start", "good wishes"],
    exampleQueries: ["Happy New Year", "Congratulations on your success", "A blessing for a new home"]
  }
];

export const EXTRA_ENGLISH_CLASSICS: EnglishClassic[] = [
  classic(
    "zhuo-wenjun-baitou-love",
    "Yuàn dé yī xīn rén, bái tóu bù xiāng lí.",
    "May I find one true-hearted person and never part until our hair turns white.",
    "I want a faithful love that lasts for life.",
    "Baitou Yin (Song of White Hair)",
    "Traditionally attributed to Zhuo Wenjun",
    "Han dynasty",
    "New Songs from a Jade Terrace",
    "A direct wish for one faithful partner and a lifetime without separation.",
    ["i want to grow old with you", "faithful love", "love that lasts a lifetime", "one true heart", "never leave each other", "lifelong partner", "forever together", "marriage promise"],
    ["love", "commitment-and-marriage"],
    124,
    "The attribution to Zhuo Wenjun is traditional; the line is presented with the source used by the Chinese corpus."
  ),
  classic(
    "yue-ren-ge-love",
    "Shān yǒu mù xī mù yǒu zhī, xīn yuè jūn xī jūn bù zhī.",
    "The mountain has trees and the trees have branches; my heart delights in you, yet you do not know.",
    "I love you, but you do not know how I feel.",
    "Song of the Yue Boatman",
    "Anonymous",
    "Pre-Qin China",
    "Shuo Yuan (Garden of Stories)",
    "Few classical lines express unspoken affection more clearly: the feeling is real, but remains unknown to the beloved.",
    ["i love you but you do not know", "secret love", "unspoken love", "i like you but cannot say it", "you do not know how i feel", "hidden feelings", "crush on someone", "silent confession"],
    ["love", "missing-someone"],
    125
  ),
  classic(
    "shijing-jigu-love",
    "Sǐ shēng qì kuò, yǔ zǐ chéng shuō. Zhí zǐ zhī shǒu, yǔ zǐ xié lǎo.",
    "Through life and death, union and separation, I made this pledge with you: holding your hand, I will grow old with you.",
    "I promise to stand with you through life and grow old together.",
    "Ji Gu (Drums)",
    "Anonymous",
    "Pre-Qin China",
    "The Book of Songs",
    "Its language of pledge, hand-holding, and growing old together makes it a powerful expression of enduring commitment.",
    ["hold your hand and grow old", "grow old together", "through life and death", "lifelong promise", "wedding vow", "stay together forever", "enduring love", "marriage commitment"],
    ["love", "commitment-and-marriage"],
    123,
    "The poem's original setting is separation in military service, which gives the promise a more difficult context than a simple wedding slogan."
  ),
  classic(
    "wen-tingyun-hongdou-love",
    "Líng lóng tóu zǐ ān hóng dòu, rù gǔ xiāng sī zhī bù zhī.",
    "A red bean is set inside the delicate die; do you know this longing has entered my bones?",
    "I miss you so deeply it feels carved into me.",
    "Newly Added Song of Willow Branches",
    "Wen Tingyun",
    "Tang dynasty",
    "Complete Tang Poems",
    "The red bean is a traditional emblem of longing, while the image of it entering the bones intensifies the feeling.",
    ["i miss you deeply", "longing in my bones", "cannot stop missing you", "deep longing", "you are always in my heart", "painful love", "red bean love poem", "i miss her so much"],
    ["love", "missing-someone"],
    122
  ),
  classic(
    "li-zhiyi-busuanzi-love",
    "Zhǐ yuàn jūn xīn sì wǒ xīn, dìng bù fù xiāng sī yì.",
    "I only wish your heart were like mine; then you would not fail this longing.",
    "I hope you feel the same way I do.",
    "Song of Divination: I Live at the Head of the Yangtze",
    "Li Zhiyi",
    "Northern Song dynasty",
    "Guxi Ci",
    "It turns distance and longing into one vulnerable request for mutual feeling.",
    ["i hope you feel the same", "do you love me too", "mutual love", "please do not betray my feelings", "we share the same heart", "i wish you loved me", "love across distance", "return my love"],
    ["love", "missing-someone", "farewell-and-distance"],
    121
  ),
  classic(
    "qin-guan-queshen-love",
    "Liǎng qíng ruò shì jiǔ cháng shí, yòu qǐ zài zhāo zhāo mù mù.",
    "If two hearts are meant to last, why must they be together morning and evening?",
    "True love can endure distance and time apart.",
    "Immortal at the Magpie Bridge",
    "Qin Guan",
    "Northern Song dynasty",
    "Huaihai Ci",
    "It argues that lasting affection is not measured only by constant physical presence.",
    ["true love survives distance", "long distance relationship", "love does not need daily presence", "we are far apart but still in love", "lasting love", "distance cannot break love", "love across time", "apart but together"],
    ["love", "commitment-and-marriage", "farewell-and-distance"],
    124
  ),
  classic(
    "shijing-taoyao-wedding",
    "Táo zhī yāo yāo, zhuó zhuó qí huá. Zhī zǐ yú guī, yí qí shì jiā.",
    "The peach tree is young and lovely, its blossoms bright. This young woman goes to her marriage; may she bring harmony to her household.",
    "May the marriage be joyful and the new home flourish.",
    "Tao Yao (The Peach Tree)",
    "Anonymous",
    "Pre-Qin China",
    "The Book of Songs",
    "One of the best-known traditional Chinese wedding blessings, joining bright blossoms with a harmonious household.",
    ["chinese wedding blessing", "happy marriage", "blessing for newlyweds", "may your home be harmonious", "wedding poem", "marriage happiness", "new family blessing", "peach blossom wedding"],
    ["commitment-and-marriage", "family-and-reunion", "celebrations-and-new-beginnings"],
    122
  ),
  classic(
    "gaoshi-biedongda-farewell",
    "Mò chóu qián lù wú zhī jǐ, tiān xià shuí rén bù shí jūn.",
    "Do not worry that no true friend waits on the road ahead; who under heaven does not know you?",
    "Go forward confidently—you will find people who recognize and value you.",
    "Farewell to Dong Da, No. 1",
    "Gao Shi",
    "Tang dynasty",
    "Complete Tang Poems",
    "Instead of dwelling only on sorrow, the speaker gives a departing friend courage for the future.",
    ["goodbye and good luck", "farewell to a friend", "do not fear the road ahead", "you will find new friends", "wishing you a bright future", "graduation farewell", "safe journey", "encouragement before leaving"],
    ["farewell-and-distance", "friendship", "ambition-and-success"],
    123
  ),
  classic(
    "sushi-shuidiaogetou-reunion",
    "Dàn yuàn rén cháng jiǔ, qiān lǐ gòng chán juān.",
    "May we both live long; though a thousand miles apart, we share the beauty of the moon.",
    "Even far apart, may we be safe and connected under the same moon.",
    "Prelude to Water Melody: When Will the Moon Be Clear and Bright?",
    "Su Shi",
    "Northern Song dynasty",
    "Dongpo Yuefu",
    "The shared moon becomes a bond between people who cannot physically reunite.",
    ["may we share the same moon", "far apart under the same moon", "mid autumn blessing", "miss my family", "wish you a long life", "connected across distance", "family reunion poem", "long distance blessing"],
    ["family-and-reunion", "missing-someone", "farewell-and-distance"],
    125
  ),
  classic(
    "bai-juyi-changhenge-beauty",
    "Huí móu yī xiào bǎi mèi shēng, liù gōng fěn dài wú yán sè.",
    "At one backward glance and smile, a hundred charms came alive; the painted beauties of the six palaces lost their color.",
    "Her smile outshines everyone around her.",
    "Song of Everlasting Sorrow",
    "Bai Juyi",
    "Tang dynasty",
    "Complete Tang Poems",
    "The line praises a single smile by showing every other beauty fade beside it.",
    ["her smile outshines everyone", "beautiful when she smiles", "unforgettable smile", "most beautiful woman", "a hundred charms", "radiant smile", "she is breathtaking", "poetic compliment for her smile"],
    ["beauty", "love"],
    116
  ),
  classic(
    "shijing-tianbao-birthday",
    "Rú yuè zhī héng, rú rì zhī shēng, rú Nán Shān zhī shòu, bù qiān bù bēng. Rú sōng bǎi zhī mào, wú bù ěr huò chéng.",
    "May you endure like the waxing moon, rise like the sun, live as long as the Southern Mountain, unshaken and unfailing; flourish like pine and cypress, with all blessings continuing.",
    "May your life be long, steady, and ever flourishing.",
    "Tian Bao (Heaven Protects)",
    "Anonymous",
    "Pre-Qin China",
    "The Book of Songs",
    "A classical blessing for longevity and enduring flourishing, built from the moon, sun, mountain, pine, and cypress.",
    ["chinese birthday blessing", "may you live long", "longevity blessing", "birthday poem", "may your life flourish", "blessing for an elder", "long life and prosperity", "health and longevity"],
    ["family-and-reunion", "celebrations-and-new-beginnings"],
    120
  ),
  classic(
    "mengzi-gongsunchou-people-united",
    "Tiān shí bù rú dì lì, dì lì bù rú rén hé.",
    "Favorable timing is not as valuable as favorable terrain; favorable terrain is not as valuable as harmony among people.",
    "Unity matters more than circumstances.",
    "Mencius: Gongsun Chou II",
    "Mencius",
    "Warring States period",
    "Mencius",
    "It places human cooperation above both timing and material advantage.",
    ["unity matters more than circumstances", "teamwork matters", "people working together", "team harmony", "a united team", "cooperation beats conditions", "people are the advantage", "team unity"],
    ["friendship", "work-and-leadership", "wisdom"],
    119
  ),
  classic(
    "mengzi-gaozi-hardship-growth",
    "Shēng yú yōu huàn, ér sǐ yú ān lè yě.",
    "One survives and grows through hardship, and perishes in ease.",
    "Difficulty can strengthen you; complacency can weaken you.",
    "Mencius: Gaozi II",
    "Mencius",
    "Warring States period",
    "Mencius",
    "The line treats hardship as a source of alertness and growth, while warning against excessive comfort.",
    ["hardship makes you stronger", "do not become complacent", "growth through adversity", "leave your comfort zone", "pressure can build strength", "stay alert in good times", "comfort can weaken you", "adversity and growth"],
    ["perseverance", "ambition-and-success", "wisdom"],
    118
  ),
  classic(
    "daxue-focus-absent-mind",
    "Xīn bù zài yān, shì ér bù jiàn, tīng ér bù wén, shí ér bù zhī qí wèi.",
    "When the mind is absent, one looks without seeing, hears without listening, and eats without knowing the taste.",
    "Without attention, you can be present and still miss everything.",
    "The Great Learning",
    "Traditionally associated with Zengzi",
    "Pre-Qin China",
    "Book of Rites: The Great Learning",
    "It describes distraction through ordinary senses that stop registering what is directly in front of them.",
    ["pay attention", "be present", "my mind is elsewhere", "cannot focus", "look without seeing", "listen without hearing", "mindfulness", "stop being distracted"],
    ["learning-and-growth", "perspective-and-self-knowledge", "inner-peace"],
    114
  ),
  classic(
    "xunzi-qinxue-blue-better",
    "Qīng, qǔ zhī yú lán, ér qīng yú lán; bīng, shuǐ wéi zhī, ér hán yú shuǐ.",
    "Blue dye comes from the indigo plant yet is bluer than indigo; ice is made from water yet colder than water.",
    "A student or successor can surpass the teacher.",
    "Encouraging Learning",
    "Xunzi",
    "Warring States period",
    "Xunzi",
    "Its paired images explain how learning and transformation can produce something that exceeds its origin.",
    ["the student surpasses the teacher", "surpass your teacher", "the next generation can do better", "learn and improve", "outgrow your mentor", "blue from indigo", "continuous improvement", "successor becomes greater"],
    ["learning-and-growth", "ambition-and-success"],
    118
  ),
  classic(
    "xunzi-qinxue-perseverance",
    "Qiè ér shě zhī, xiǔ mù bù zhé; qiè ér bù shě, jīn shí kě lòu.",
    "If you carve and give up, even rotten wood will not break; if you carve without stopping, metal and stone can be engraved.",
    "Persistence makes even the hardest goal yield.",
    "Encouraging Learning",
    "Xunzi",
    "Warring States period",
    "Xunzi",
    "The contrast shows that consistency matters more than a dramatic beginning.",
    ["persistence can overcome anything", "do not quit halfway", "keep working at it", "consistency wins", "hard goals take persistence", "never stop carving", "long term effort", "finish what you start"],
    ["perseverance", "learning-and-growth"],
    122
  ),
  classic(
    "xunzi-qinxue-use-tools",
    "Jūn zǐ xìng fēi yì yě, shàn jiǎ yú wù yě.",
    "The exemplary person is not born different; he is skilled at making use of things.",
    "Success often comes from using tools and conditions well, not from being superhuman.",
    "Encouraging Learning",
    "Xunzi",
    "Warring States period",
    "Xunzi",
    "It shifts attention from innate superiority to the intelligent use of tools, systems, and external support.",
    ["use the right tools", "work smarter", "successful people use tools", "leverage technology", "use external resources", "tools improve ability", "do not do everything alone", "make use of conditions"],
    ["learning-and-growth", "work-and-leadership", "wisdom"],
    120
  ),
  classic(
    "hanfeizi-youdu-law-equal",
    "Fǎ bù ē guì, shéng bù náo qū.",
    "Law does not bend toward the powerful; the marking line does not curve around what is crooked.",
    "Rules should apply equally, even to the powerful.",
    "You Du (Having Standards)",
    "Han Fei",
    "Warring States period",
    "Han Feizi",
    "The measuring line becomes an image of a standard that refuses to bend for status.",
    ["rules should apply to everyone", "no one is above the law", "equal standards", "do not favor the powerful", "fair rules", "same rules for everyone", "justice without privilege", "standards must not bend"],
    ["fairness-and-integrity", "work-and-leadership", "courage-and-principles"],
    123
  ),
  classic(
    "hanfeizi-wudu-innovation",
    "Bù qī xiū gǔ, bù fǎ cháng kě.",
    "Do not expect to restore the ancient ways, and do not treat customary methods as permanently valid.",
    "Adapt to reality instead of copying old solutions.",
    "The Five Vermin",
    "Han Fei",
    "Warring States period",
    "Han Feizi",
    "It rejects automatic reverence for precedent when circumstances have changed.",
    ["adapt to change", "do not copy old methods", "innovation requires change", "old solutions may not work", "respond to reality", "do not be trapped by tradition", "change the method", "modern problems need new solutions"],
    ["wisdom", "work-and-leadership", "learning-and-growth"],
    118
  ),
  classic(
    "hanfeizi-shuinan-confidentiality",
    "Shì yǐ mì chéng, yǔ yǐ xiè bài.",
    "Affairs succeed through secrecy; words cause them to fail through disclosure.",
    "Some plans need discretion before they are ready.",
    "The Difficulties of Persuasion",
    "Han Fei",
    "Warring States period",
    "Han Feizi",
    "It is a warning that careless disclosure can destroy work before execution is complete.",
    ["keep plans confidential", "do not reveal too early", "discretion matters", "keep a secret", "plans fail through leaks", "say less before it is done", "protect confidential work", "do not announce unfinished plans"],
    ["work-and-leadership", "wisdom"],
    113
  ),
  classic(
    "zhuangzi-qiushui-limited-view",
    "Jǐng wā bù kě yǐ yǔ yú hǎi zhě, jū yú xū yě; xià chóng bù kě yǐ yǔ yú bīng zhě, dǔ yú shí yě.",
    "You cannot speak of the sea to a frog in a well, constrained by its place; nor of ice to a summer insect, bound by its season.",
    "People can be limited by the world they have experienced.",
    "Autumn Floods",
    "Zhuangzi",
    "Warring States period",
    "Zhuangzi",
    "Place and time become metaphors for the limits that experience can place on understanding.",
    ["people are limited by their experience", "narrow perspective", "frog in a well", "open your mind", "some people cannot understand", "limited worldview", "expand your horizons", "experience shapes understanding"],
    ["perspective-and-self-knowledge", "wisdom", "learning-and-growth"],
    123
  ),
  classic(
    "laozi-33-self-knowledge",
    "Zhī rén zhě zhì, zì zhī zhě míng.",
    "To know others is intelligence; to know oneself is clarity.",
    "Understanding yourself is the deeper wisdom.",
    "Tao Te Ching, Chapter 33",
    "Laozi",
    "Spring and Autumn period",
    "Tao Te Ching",
    "It distinguishes social intelligence from the harder achievement of honest self-knowledge.",
    ["know yourself", "self awareness", "understand your strengths and weaknesses", "self knowledge", "look inward", "understanding yourself", "honest self reflection", "wisdom begins with self knowledge"],
    ["perspective-and-self-knowledge", "wisdom"],
    125
  ),
  classic(
    "laozi-44-know-stop",
    "Zhī zú bù rǔ, zhī zhǐ bù dài, kě yǐ cháng jiǔ.",
    "Know contentment and avoid disgrace; know where to stop and avoid danger; then you can endure.",
    "Know what is enough and when to stop.",
    "Tao Te Ching, Chapter 44",
    "Laozi",
    "Spring and Autumn period",
    "Tao Te Ching",
    "Contentment and restraint are presented as conditions for safety and endurance.",
    ["know when to stop", "know what is enough", "do not be greedy", "set boundaries", "leave while ahead", "contentment", "avoid excess", "when to walk away"],
    ["inner-peace", "wisdom", "perspective-and-self-knowledge"],
    121
  ),
  classic(
    "zuozhuan-yingong-injustice-destroys",
    "Duō xíng bù yì, bì zì bì.",
    "One who repeatedly acts unjustly will surely bring about his own ruin.",
    "Persistent wrongdoing eventually destroys the wrongdoer.",
    "Duke Yin, Year One",
    "Zuo Qiuming",
    "Spring and Autumn period",
    "Zuo Commentary",
    "It warns that repeated injustice creates the conditions of its own collapse.",
    ["wrongdoing destroys itself", "bad actions have consequences", "injustice will fail", "you reap what you sow", "evil brings ruin", "dishonest people eventually fall", "unjust behavior", "consequences of wrongdoing"],
    ["fairness-and-integrity", "wisdom"],
    114
  ),
  classic(
    "zuozhuan-xuangong-correct-error",
    "Rén shuí wú guò? Guò ér néng gǎi, shàn mò dà yān.",
    "Who among people is without fault? To err and then correct it—no goodness is greater.",
    "Everyone makes mistakes; what matters is changing.",
    "Duke Xuan, Year Two",
    "Zuo Qiuming",
    "Spring and Autumn period",
    "Zuo Commentary",
    "It combines realism about human error with a strong standard for repair.",
    ["everyone makes mistakes", "admit your mistake", "change after doing wrong", "give someone a second chance", "correct your errors", "people can improve", "forgive a genuine change", "mistakes and growth"],
    ["mistakes-and-renewal", "learning-and-growth", "friendship"],
    124
  ),
  classic(
    "zuozhuan-xianggong-prepared-risk",
    "Jū ān sī wēi, sī zé yǒu bèi, yǒu bèi wú huàn.",
    "In safety, think of danger; thinking brings preparation, and preparation prevents calamity.",
    "Prepare for risk before trouble arrives.",
    "Duke Xiang, Year Eleven",
    "Zuo Qiuming",
    "Spring and Autumn period",
    "Zuo Commentary",
    "It is a compact chain from awareness to preparation to reduced harm.",
    ["prepare for risk before trouble", "plan for emergencies", "be ready before a crisis", "risk management", "do not wait for disaster", "prepare while things are calm", "have a contingency plan", "prevention is better"],
    ["work-and-leadership", "wisdom"],
    123
  ),
  classic(
    "shiji-lijiangjun-peach-plum",
    "Táo lǐ bù yán, xià zì chéng qī.",
    "Peach and plum trees do not speak, yet paths form beneath them.",
    "Real character and ability attract respect without self-promotion.",
    "Biography of General Li",
    "Sima Qian",
    "Western Han dynasty",
    "Records of the Grand Historian",
    "People repeatedly walk toward fruit and shade; the image becomes a lesson in influence earned without boasting.",
    ["let your work speak for itself", "results speak louder than words", "do not brag", "reputation grows naturally", "quiet excellence", "earn respect through action", "good character attracts people", "real ability needs no boasting"],
    ["work-and-leadership", "ambition-and-success", "wisdom"],
    121
  ),
  classic(
    "shiji-chenshe-great-ambition",
    "Yàn què ān zhī hóng hú zhī zhì zāi!",
    "How could sparrows and swallows know the ambition of a great swan?",
    "People with small horizons may not understand a larger dream.",
    "The House of Chen She",
    "Sima Qian",
    "Western Han dynasty",
    "Records of the Grand Historian",
    "The contrast between small birds and the great swan gives defiant language to misunderstood ambition.",
    ["people do not understand my ambition", "big dreams", "do not let small minds limit you", "great ambition", "they underestimate me", "larger vision", "dream beyond others", "misunderstood goals"],
    ["ambition-and-success", "courage-and-principles"],
    121
  ),
  classic(
    "shiji-gaozu-strategy",
    "Yùn chóu cè wéi zhàng zhī zhōng, jué shèng yú qiān lǐ zhī wài.",
    "Form strategies within the command tent and decide victory a thousand miles away.",
    "Good strategy shapes results long before the final action.",
    "Basic Annals of Emperor Gaozu",
    "Sima Qian",
    "Western Han dynasty",
    "Records of the Grand Historian",
    "It praises the kind of planning whose effects reach far beyond the room where decisions are made.",
    ["strategy wins before action", "good planning decides success", "think several steps ahead", "strategic leadership", "win through planning", "plan from behind the scenes", "long range strategy", "excellent strategist"],
    ["work-and-leadership", "ambition-and-success", "wisdom"],
    123
  ),
  classic(
    "zhanguoce-zhao-history-teacher",
    "Qián shì zhī bù wàng, hòu shì zhī shī.",
    "Do not forget what happened before; it becomes the teacher of what comes after.",
    "Use the past as a lesson, not a prison.",
    "Strategies of Zhao I",
    "Anonymous compilers",
    "Compiled in the Western Han dynasty",
    "Strategies of the Warring States",
    "It turns historical memory into practical guidance for future decisions.",
    ["learn from the past", "history is a teacher", "do not repeat old mistakes", "remember the lesson", "use experience wisely", "reflect on what happened", "past lessons", "learn from failure"],
    ["mistakes-and-renewal", "wisdom"],
    121
  ),
  classic(
    "zhanguoce-chu-mend-fold",
    "Wáng yáng ér bǔ láo, wèi wéi chí yě.",
    "To repair the pen after losing a sheep is not yet too late.",
    "It is still worth fixing a problem after something has gone wrong.",
    "Strategies of Chu IV",
    "Anonymous compilers",
    "Compiled in the Western Han dynasty",
    "Strategies of the Warring States",
    "The image recognizes the loss but refuses the excuse that repair is now pointless.",
    ["it is not too late to fix it", "repair the damage", "fix a mistake after failure", "better late than never", "take corrective action", "stop further loss", "make amends", "solve the problem now"],
    ["mistakes-and-renewal", "perseverance"],
    124
  ),
  classic(
    "zhanguoce-qi-three-burrows",
    "Jiǎo tù yǒu sān kū, jǐn dé miǎn qí sǐ ěr.",
    "A cunning rabbit has three burrows and only thereby escapes death.",
    "Do not depend on a single plan; keep alternatives.",
    "Strategies of Qi IV",
    "Anonymous compilers",
    "Compiled in the Western Han dynasty",
    "Strategies of the Warring States",
    "Multiple shelters become a vivid warning against a single point of failure.",
    ["do not rely on one plan", "have a backup plan", "keep several options", "do not put everything in one basket", "contingency planning", "multiple escape routes", "reduce single point of failure", "keep a way out"],
    ["work-and-leadership", "wisdom"],
    117
  ),
  classic(
    "hanyu-shishuo-no-one-knows-all",
    "Rén fēi shēng ér zhī zhī zhě, shú néng wú huò?",
    "People are not born knowing; who can be without questions?",
    "Not knowing is normal—ask and learn.",
    "On Teachers",
    "Han Yu",
    "Tang dynasty",
    "Guwen Guanzhi: On Teachers",
    "The question removes shame from uncertainty and makes seeking instruction reasonable.",
    ["not knowing is normal", "do not be afraid to ask", "everyone has questions", "ask an expert", "no one knows everything", "learn from a teacher", "admit what you do not know", "questions are part of learning"],
    ["learning-and-growth", "perspective-and-self-knowledge"],
    123
  ),
  classic(
    "hanyu-jinxue-hardwork-thinking",
    "Yè jīng yú qín, huāng yú xī; xíng chéng yú sī, huǐ yú suí.",
    "Work becomes refined through diligence and falls into neglect through play; conduct succeeds through thought and is ruined by careless following.",
    "Diligence needs reflection; effort without thought is not enough.",
    "An Explanation of Advancing in Learning",
    "Han Yu",
    "Tang dynasty",
    "Guwen Guanzhi: An Explanation of Advancing in Learning",
    "It balances hard work with independent thought rather than praising effort alone.",
    ["hard work and thinking", "diligence requires reflection", "do not follow blindly", "work hard and think", "success needs discipline", "effort without thought", "study diligently", "avoid careless habits"],
    ["learning-and-growth", "work-and-leadership", "perseverance"],
    121
  ),
  classic(
    "hanyu-mashuo-talent-recognition",
    "Shì yǒu Bó Lè, rán hòu yǒu qiān lǐ mǎ.",
    "Only when there is a Bo Le can there be a thousand-li horse.",
    "Talent needs someone able to recognize and support it.",
    "On Horses",
    "Han Yu",
    "Tang dynasty",
    "Guwen Guanzhi: On Horses",
    "The legendary judge of horses becomes a metaphor for leaders who can identify rare ability.",
    ["talent needs to be recognized", "a good leader recognizes talent", "waiting for an opportunity", "great talent needs a platform", "find the right mentor", "recognize potential", "talent without opportunity", "the right person sees your ability"],
    ["work-and-leadership", "ambition-and-success"],
    117
  ),
  classic(
    "fan-zhongyan-worry-first",
    "Xiān tiān xià zhī yōu ér yōu, hòu tiān xià zhī lè ér lè.",
    "Be concerned before all under heaven are concerned, and enjoy happiness only after all under heaven enjoy it.",
    "Leadership means carrying responsibility before taking reward.",
    "Memorial to Yueyang Tower",
    "Fan Zhongyan",
    "Northern Song dynasty",
    "Guwen Guanzhi: Memorial to Yueyang Tower",
    "It defines public responsibility through sequence: concern first, enjoyment last.",
    ["leadership means responsibility", "put others before yourself", "leaders carry the burden first", "public duty", "serve before enjoying", "responsible leadership", "care about the common good", "take responsibility before reward"],
    ["work-and-leadership", "fairness-and-integrity", "courage-and-principles"],
    121
  ),
  classic(
    "sushi-chibi-small-in-world",
    "Jì fú yóu yú tiān dì, miǎo cāng hǎi zhī yī sù.",
    "We lodge like mayflies between heaven and earth, tiny as a single grain in the vast sea.",
    "Human life is brief and small within the immensity of the universe.",
    "Former Rhapsody on the Red Cliffs",
    "Su Shi",
    "Northern Song dynasty",
    "Guwen Guanzhi: Former Rhapsody on the Red Cliffs",
    "The mayfly and grain of millet place an individual life against cosmic scale.",
    ["human life is brief", "we are small in the universe", "life is short", "a grain in the ocean", "cosmic perspective", "human beings are tiny", "impermanence", "our troubles are small"],
    ["time-and-impermanence", "life", "perspective-and-self-knowledge"],
    123
  ),
  classic(
    "luyou-youshanxi-turnaround",
    "Shān chóng shuǐ fù yí wú lù, liǔ àn huā míng yòu yī cūn.",
    "Mountains repeat, waters wind; I doubt there is a road—then shaded willows and bright flowers reveal another village.",
    "When the way seems closed, a new opening may appear.",
    "Visiting Shanxi Village",
    "Lu You",
    "Southern Song dynasty",
    "Song poetry",
    "The physical landscape produces one of the clearest Chinese images of an unexpected turn for the better.",
    ["when one road closes another opens", "a new way appears", "there is still hope", "unexpected turnaround", "no way forward then hope", "light after difficulty", "another village", "things can change suddenly"],
    ["perseverance", "mistakes-and-renewal", "life"],
    125
  ),
  classic(
    "luyou-zidong-practice",
    "Zhǐ shàng dé lái zhōng jué qiǎn, jué zhī cǐ shì yào gōng xíng.",
    "What is gained from paper always feels shallow; to truly know it, one must practice it.",
    "Real understanding comes through doing.",
    "Reading on a Winter Night for My Son Ziyu",
    "Lu You",
    "Southern Song dynasty",
    "Song poetry",
    "It draws a firm boundary between secondhand knowledge and embodied experience.",
    ["practice is better than theory", "learn by doing", "books are not enough", "real experience matters", "put theory into practice", "hands on learning", "knowledge requires action", "do the work yourself"],
    ["learning-and-growth", "work-and-leadership", "ambition-and-success"],
    125
  ),
  classic(
    "sushi-xilin-blind-spot",
    "Bù shí Lú Shān zhēn miàn mù, zhǐ yuán shēn zài cǐ shān zhōng.",
    "I cannot know the true face of Mount Lu because I am inside the mountain.",
    "Being inside a situation can hide the full picture.",
    "Written on the Wall at West Forest Temple",
    "Su Shi",
    "Northern Song dynasty",
    "Song poetry",
    "The mountain becomes a model of the blind spots created by proximity and involvement.",
    ["step back to see the whole picture", "too close to the problem", "cannot see clearly from inside", "blind spot", "look from another angle", "the bigger picture", "outsider perspective", "distance brings clarity"],
    ["perspective-and-self-knowledge", "wisdom"],
    125
  ),
  classic(
    "wangzhihuan-climb-higher",
    "Yù qióng qiān lǐ mù, gèng shàng yī céng lóu.",
    "To see a thousand miles farther, climb one story higher.",
    "Raise your level if you want a wider view.",
    "Climbing Stork Tower",
    "Wang Zhihuan",
    "Tang dynasty",
    "Complete Tang Poems",
    "The simple movement upward joins effort, perspective, and ambition in one image.",
    ["climb higher to see farther", "raise your level", "wider perspective", "keep improving", "reach the next level", "advance your career", "see beyond the present", "aim higher"],
    ["ambition-and-success", "learning-and-growth", "perspective-and-self-knowledge"],
    124
  ),
  classic(
    "liu-yuxi-new-growth",
    "Chén zhōu cè pàn qiān fān guò, bìng shù qián tóu wàn mù chūn.",
    "Beside the sunken boat, a thousand sails pass; before the diseased tree, ten thousand trees enter spring.",
    "New life and opportunity continue beyond loss and decline.",
    "Reply to Bai Juyi at Our First Banquet in Yangzhou",
    "Liu Yuxi",
    "Tang dynasty",
    "Complete Tang Poems",
    "The damaged boat and tree remain visible, but they no longer occupy the whole landscape.",
    ["new life follows loss", "life moves forward", "new opportunities appear", "everything changes", "renewal after decline", "the future continues", "hope after loss", "new growth"],
    ["mistakes-and-renewal", "life", "perseverance", "time-and-impermanence"],
    121
  ),
  classic(
    "li-bai-light-boat-relief",
    "Liǎng àn yuán shēng tí bù zhù, qīng zhōu yǐ guò wàn chóng shān.",
    "The cries of apes on both banks have not ceased, yet the light boat has already passed ten thousand mountains.",
    "Sometimes you realize only afterward how much hardship you have already crossed.",
    "Leaving Baidi City at Dawn",
    "Li Bai",
    "Tang dynasty",
    "Complete Tang Poems",
    "The speed and lightness of the boat make past obstacles suddenly feel distant.",
    ["i have made it through the hard part", "already passed the mountains", "finally through the difficulty", "things became easier", "look how far you have come", "hard times are behind me", "relief after struggle", "moving forward quickly"],
    ["letting-go", "perseverance", "life"],
    122
  ),
  classic(
    "lunyu-liren-proper-way",
    "Fù yǔ guì, shì rén zhī suǒ yù yě; bù yǐ qí dào dé zhī, bù chǔ yě.",
    "Wealth and honor are what people desire; if they cannot be obtained by the right way, do not accept them.",
    "Success is not worth having if it requires the wrong means.",
    "Analects 4: Li Ren",
    "Confucius",
    "Pre-Qin China",
    "The Analects",
    "It recognizes the desire for success while refusing dishonest methods.",
    ["success must be earned the right way", "do not cheat to get ahead", "ethical success", "honest competition", "wealth without wrongdoing", "do not use dirty tricks", "integrity in business", "the right means matter"],
    ["fairness-and-integrity", "ambition-and-success", "courage-and-principles"],
    123
  ),
  classic(
    "lunyu-yanyuan-help-good",
    "Jūn zǐ chéng rén zhī měi, bù chéng rén zhī è. Xiǎo rén fǎn shì.",
    "The noble person brings others' good purposes to completion and does not complete their wrongdoing; the petty person does the opposite.",
    "Support what is good in others instead of helping harm.",
    "Analects 12: Yan Yuan",
    "Confucius",
    "Pre-Qin China",
    "The Analects",
    "It gives cooperation a moral direction: help good work succeed, but do not enable harm.",
    ["help others do good", "support other people's success", "do not sabotage others", "healthy competition", "help good things happen", "do not enable wrongdoing", "cooperate fairly", "bring out the best in others"],
    ["fairness-and-integrity", "friendship", "work-and-leadership"],
    119
  ),
  classic(
    "daxue-daily-renewal-opening",
    "Gǒu rì xīn, rì rì xīn, yòu rì xīn.",
    "If you can renew yourself in one day, renew yourself each day, and renew yourself again.",
    "Keep becoming new through daily improvement.",
    "The Great Learning",
    "Traditionally associated with Zengzi",
    "Pre-Qin China",
    "Book of Rites: The Great Learning",
    "Its repetition turns renewal into a daily discipline rather than a one-time reset.",
    ["renew yourself every day", "daily improvement", "start fresh", "keep changing for the better", "a new beginning", "improve every day", "continuous renewal", "begin again today"],
    ["mistakes-and-renewal", "celebrations-and-new-beginnings", "learning-and-growth"],
    122
  ),
  classic(
    "mengjiao-dengke-success",
    "Chūn fēng dé yì mǎ tí jí, yī rì kàn jìn Cháng'ān huā.",
    "Proud in the spring wind, my horse's hooves fly; in one day I see all the flowers of Chang'an.",
    "The exhilaration of finally succeeding after hard work.",
    "After Passing the Examination",
    "Meng Jiao",
    "Tang dynasty",
    "Complete Tang Poems",
    "The swift horse and spring city capture the release of long effort turning into public success.",
    ["congratulations on your success", "finally succeeded", "passed the exam", "celebrate an achievement", "career success", "hard work paid off", "good news after effort", "proud and happy"],
    ["ambition-and-success", "celebrations-and-new-beginnings", "life"],
    121
  ),
  classic(
    "libai-shangliyong-career",
    "Dà péng yī rì tóng fēng qǐ, fú yáo zhí shàng jiǔ wàn lǐ.",
    "When the great roc rises with the wind, it soars ninety thousand li.",
    "A great ambition can rise with the right moment.",
    "Presented to Li Yong",
    "Li Bai",
    "Tang dynasty",
    "Complete Tang Poems",
    "The giant roc gives scale and motion to confidence in an extraordinary future.",
    ["dream big", "career will take off", "rise with the wind", "great ambition", "soar to success", "your opportunity will come", "aim extraordinarily high", "a bright future"],
    ["ambition-and-success", "courage-and-principles", "celebrations-and-new-beginnings"],
    125
  ),
  classic(
    "shiji-guanyan-prosperity",
    "Cāng lǐn shí ér zhī lǐ jié, yī shí zú ér zhī róng rǔ.",
    "When granaries are full, people understand rites; when food and clothing are sufficient, they understand honor and shame.",
    "Material security supports social dignity and order.",
    "Biographies of Guan Zhong and Yan Ying",
    "Sima Qian",
    "Western Han dynasty",
    "Records of the Grand Historian",
    "The line links moral and social order to the material conditions in which people live.",
    ["basic needs come first", "material security matters", "prosperity supports dignity", "people need food and clothing", "economic conditions shape society", "stable livelihood", "leadership and prosperity", "social order needs security"],
    ["work-and-leadership", "wisdom", "family-and-reunion"],
    112
  ),
  classic(
    "shangshu-hongfan-health",
    "Wǔ fú: yī yuē shòu, èr yuē fù, sān yuē kāng níng, sì yuē yōu hǎo dé, wǔ yuē kǎo zhōng mìng.",
    "The five blessings are longevity, wealth, health and peace, love of virtue, and a fulfilled natural end.",
    "A full life includes health, security, character, and longevity.",
    "Hong Fan (The Great Plan)",
    "Anonymous",
    "Pre-Qin China",
    "Book of Documents",
    "The list shows that classical blessing joins material well-being to health, virtue, and a complete life.",
    ["blessing for health and longevity", "may you be healthy and safe", "the five blessings", "long life and peace", "health wealth and virtue", "blessing for parents", "wish someone recovery", "a full and fortunate life"],
    ["family-and-reunion", "celebrations-and-new-beginnings", "life"],
    117
  ),
  classic(
    "wanganshi-yuanri-newyear",
    "Bào zhú shēng zhōng yī suì chú, chūn fēng sòng nuǎn rù tú sū.",
    "Amid the sound of firecrackers, the old year departs; the spring wind carries warmth into the tu su wine.",
    "The old year gives way to warmth and renewal.",
    "New Year's Day",
    "Wang Anshi",
    "Northern Song dynasty",
    "Collected Works of Wang Anshi",
    "Its sounds, warmth, and spring wind make renewal concrete rather than abstract.",
    ["happy chinese new year", "happy new year", "leave the old year behind", "spring brings renewal", "new year poem", "fresh start for the year", "festival blessing", "welcome a new year"],
    ["celebrations-and-new-beginnings", "life"],
    120
  ),
  classic(
    "shijing-sigan-housewarming",
    "Rú qí sī yì, rú shǐ sī jí, rú niǎo sī gé, rú huī sī fēi, jūn zǐ yōu jī.",
    "Like one rising on tiptoe, like an arrow set straight, like a bird spreading its wings, like a pheasant in flight—the noble lord ascends it.",
    "May the new home rise beautifully and become a place of flourishing.",
    "Si Gan (The Mountain Stream)",
    "Anonymous",
    "Pre-Qin China",
    "The Book of Songs",
    "The original passage praises the form and elevation of a newly built residence through images of wings and flight.",
    ["blessing for a new home", "housewarming blessing", "may your new home flourish", "new house poem", "congratulations on your new home", "beautiful new home", "move into a new house", "traditional chinese housewarming"],
    ["celebrations-and-new-beginnings", "family-and-reunion"],
    112
  )
];

export const EXTRA_ENGLISH_SEO_QUERIES = [
  "I want to grow old with you",
  "I love you but you do not know",
  "True love survives distance",
  "May we share the same moon",
  "Goodbye and good luck",
  "A Chinese wedding blessing",
  "A Chinese birthday blessing",
  "Unity matters more than circumstances",
  "Hardship makes you stronger",
  "Pay attention and be present",
  "The student can surpass the teacher",
  "Persistence can overcome anything",
  "Use the right tools",
  "Rules should apply to everyone",
  "Adapt to change",
  "Keep plans confidential",
  "People are limited by their experience",
  "Know yourself",
  "Know when to stop",
  "Everyone makes mistakes",
  "Prepare for risk before trouble",
  "Let your work speak for itself",
  "People do not understand my ambition",
  "Strategy wins before action",
  "Learn from the past",
  "It is not too late to fix it",
  "Do not rely on one plan",
  "Not knowing is normal",
  "Hard work needs reflection",
  "Talent needs to be recognized",
  "Leadership means responsibility",
  "Human life is brief",
  "When one road closes another opens",
  "Practice is better than theory",
  "Step back to see the whole picture",
  "Climb higher to see farther",
  "New life follows loss",
  "I have made it through the hard part",
  "Success must be earned the right way",
  "Help others do good",
  "Renew yourself every day",
  "Congratulations on your success",
  "Dream big",
  "A blessing for health and longevity",
  "Happy Chinese New Year",
  "A blessing for a new home"
] as const;

export const ENGLISH_TOPICS: EnglishTopic[] = [
  ...BASE_ENGLISH_TOPICS,
  ...EXTRA_ENGLISH_TOPICS
];

export const ENGLISH_CLASSICS: EnglishClassic[] = [
  ...BASE_ENGLISH_CLASSICS,
  ...EXTRA_ENGLISH_CLASSICS
];

export const ENGLISH_SEO_QUERIES = [
  ...BASE_ENGLISH_SEO_QUERIES,
  ...EXTRA_ENGLISH_SEO_QUERIES
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

  const scored = ENGLISH_CLASSICS.map((item) => {
    let score = 0;
    const matchedTopics = item.topicSlugs.filter((slug) => topicMatches.includes(slug));
    score += matchedTopics.length * 42;

    for (const term of item.searchTerms) {
      const normalizedTerm = normalizeEnglishQuery(term);
      if (query === normalizedTerm) score += 120;
      else if (phraseMatches(query, normalizedTerm)) score += 72;

      const termTokens = new Set(tokens(normalizedTerm));
      for (const token of queryTokens) {
        if (termTokens.has(token)) score += token.length >= 7 ? 15 : 10;
      }
    }

    const searchableText = normalizeEnglishQuery([
      item.naturalMeaning,
      item.literalTranslation,
      item.whyItFits,
      item.titleEn,
      item.authorEn,
      ...item.searchTerms
    ].join(" "));

    for (const token of queryTokens) {
      if (searchableText.includes(token)) score += token.length >= 7 ? 10 : 5;
    }

    if (score > 0) score += item.weight / 10;
    return { ...item, score, matchedTopics };
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
    .filter((item) => item.topicSlugs.includes(slug))
    .sort((a, b) => b.weight - a.weight)
    .slice(0, limit);
}

export function getEnglishClassicsByIds(ids: string[]) {
  const wanted = new Set(ids);
  return ENGLISH_CLASSICS.filter((item) => wanted.has(item.id));
}

export function shouldIndexEnglishQuery(query: string) {
  const normalized = normalizeEnglishQuery(query);
  return ENGLISH_SEO_QUERIES.some((item) => normalizeEnglishQuery(item) === normalized);
}
