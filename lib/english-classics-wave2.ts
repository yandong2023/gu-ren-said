import {
  ENGLISH_CLASSICS as PREVIOUS_ENGLISH_CLASSICS,
  ENGLISH_SEO_QUERIES as PREVIOUS_ENGLISH_SEO_QUERIES,
  ENGLISH_TOPICS as PREVIOUS_ENGLISH_TOPICS
} from "./english-classics-expanded";
import { normalizeEnglishQuery } from "./english-url";
import { ENGLISH_WAVE2_QUOTES } from "./english-wave2-corpus";
import type {
  EnglishClassic,
  EnglishSearchResult,
  EnglishTopic
} from "./english-classics";
import type { QuoteRecord } from "./types";

export type { EnglishClassic, EnglishSearchResult, EnglishTopic } from "./english-classics";

const QUOTE_BY_ID = new Map<string, QuoteRecord>(
  ENGLISH_WAVE2_QUOTES.map((quote) => [quote.id, quote])
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
  if (!chinese) throw new Error(`Wave-two English classic references a missing Chinese quote: ${id}`);

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

export const WAVE2_ENGLISH_TOPICS: EnglishTopic[] = [
  {
    slug: "moon-and-night",
    title: "Chinese Poems About the Moon and Night",
    shortTitle: "Moon & night",
    description: "Source-verified Chinese lines about moonlight, sleepless nights, shared distance, homesickness, and quiet companionship.",
    intro: "The moon can connect people across distance, awaken homesickness, accompany solitude, or make life's incompleteness easier to accept. These pages keep each line tied to its original poem and setting.",
    aliases: ["moon", "moonlight", "night", "midnight", "same moon", "sleepless night", "night sky", "full moon", "missing home at night"],
    exampleQueries: ["We are under the same moon", "Looking at the moon makes me miss home", "I cannot sleep on a cold night"]
  },
  {
    slug: "seasons-and-nature",
    title: "Chinese Poems About Seasons and Nature",
    shortTitle: "Seasons & nature",
    description: "Classical Chinese poems about spring rain, summer lotus, autumn skies, winter plum blossoms, mountains, birds, and changing light.",
    intro: "Nature in classical Chinese poetry is rarely decoration alone. Seasonal details can signal renewal, solitude, resilience, joy, or a change too subtle to notice up close.",
    aliases: ["nature", "season", "seasons", "spring", "summer", "autumn", "winter", "flowers", "rain", "mountain", "lotus", "maple"],
    exampleQueries: ["Spring is beginning quietly", "Autumn can still be hopeful", "Beauty can bloom in winter"]
  },
  {
    slug: "solitude-and-reflection",
    title: "Chinese Poems About Solitude and Reflection",
    shortTitle: "Solitude",
    description: "Verified lines about quiet mountains, chosen solitude, loneliness, self-possession, and reflection away from noise.",
    intro: "Solitude in the classics can be peaceful, defiant, painful, or clarifying. The source context helps distinguish chosen quiet from abandonment and grief.",
    aliases: ["solitude", "alone", "lonely", "quiet alone", "reflection", "silence", "remote place", "need space", "alone in nature"],
    exampleQueries: ["I want solitude in nature", "A lonely boat in the snow", "I would rather be alone than settle"]
  },
  {
    slug: "travel-and-journey",
    title: "Chinese Poems About Travel and the Journey Ahead",
    shortTitle: "Travel & journey",
    description: "Classical lines for departure, open roads, full sails, frontier landscapes, farewell, climbing, and the view from farther away.",
    intro: "Travel poetry holds movement and emotion together. A journey may feel promising, lonely, immense, or difficult, while a farewell can continue long after the boat disappears.",
    aliases: ["travel", "journey", "road", "sail", "departure", "trip", "voyage", "frontier", "climb", "path ahead"],
    exampleQueries: ["May your journey have fair wind", "I watched my friend sail away", "Climb to the highest peak"]
  },
  {
    slug: "parents-and-filial-love",
    title: "Chinese Poems and Quotes About Parents and Filial Love",
    shortTitle: "Parents",
    description: "Source-verified Chinese lines about a mother's care, parents' labor, gratitude, responsibility, distance, and looking after oneself for family.",
    intro: "These sources range from intimate poetry to ethical teaching. Cultural notes matter because gratitude, travel, duty, and care for the body carry historically specific meanings.",
    aliases: ["parents", "mother", "father", "mom", "mum", "family gratitude", "filial love", "parental love", "miss my mother", "care for parents"],
    exampleQueries: ["I miss my mother", "Parents work hard for their children", "Take care of yourself for your family"]
  },
  {
    slug: "teaching-and-mentorship",
    title: "Chinese Quotes About Teaching and Mentorship",
    shortTitle: "Teaching & mentorship",
    description: "Classical teachings about students surpassing teachers, patient instruction, review, mutual growth, and learning through teaching.",
    intro: "The Chinese classics do not treat teaching as one-way authority. Several of their strongest lines emphasize specialization, humility, review, and teachers learning through the act of teaching.",
    aliases: ["teaching", "teacher", "mentor", "mentorship", "student", "education", "review", "teach others", "learn together", "classroom"],
    exampleQueries: ["Students can surpass teachers", "Review the old to learn the new", "Teachers and students grow together"]
  },
  {
    slug: "critical-thinking-and-empathy",
    title: "Chinese Quotes About Critical Thinking and Empathy",
    shortTitle: "Thinking & empathy",
    description: "Source-verified teachings about questioning books, treating others with care, learning from examples, and avoiding excess.",
    intro: "Independent judgment and empathy are not opposites. These lines ask readers to question authority, examine themselves, respect others' boundaries, and maintain proportion.",
    aliases: ["critical thinking", "empathy", "question books", "independent judgment", "golden rule", "respect others", "self reflection", "moderation", "balance"],
    exampleQueries: ["Do not believe every book blindly", "Treat others as you wish to be treated", "Too much is as bad as too little"]
  },
  {
    slug: "aging-and-resilience",
    title: "Chinese Quotes About Aging and Resilience",
    shortTitle: "Aging & resilience",
    description: "Classical Chinese lines about keeping ambition, courage, and purpose through age, setbacks, and difficult circumstances.",
    intro: "These lines reject the idea that age or hardship automatically ends aspiration. Their emphasis is not denial of change, but the preservation of direction and spirit.",
    aliases: ["aging", "getting older", "old age", "still ambitious", "resilience with age", "never too old", "late life", "purpose", "old but strong"],
    exampleQueries: ["Stay ambitious as you grow older", "You are never too old to have a dream", "Hardship should not break your ambition"]
  }
];

export const WAVE2_ENGLISH_CLASSICS: EnglishClassic[] = [
  classic(
    "li-bai-jingyesi-moon-home",
    "Jǔ tóu wàng míng yuè, dī tóu sī gù xiāng.",
    "I raise my head and gaze at the bright moon; I lower it and think of home.",
    "Moonlight makes me miss my home.",
    "Quiet Night Thoughts",
    "Li Bai",
    "Tang dynasty",
    "Complete Tang Poems",
    "The movement from looking up to lowering the head turns moonlight directly into homesickness.",
    ["looking at the moon makes me miss home", "moonlight makes me homesick", "i miss my hometown at night", "the moon reminds me of home", "quiet night homesickness", "i am far from home", "thinking of home under the moon"],
    ["moon-and-night", "homesickness", "family-and-reunion"],
    126
  ),
  classic(
    "zhangjiuling-wangyue-shared-moon",
    "Hǎi shàng shēng míng yuè, tiān yá gòng cǐ shí.",
    "A bright moon rises over the sea; at the ends of the earth, we share this moment.",
    "Though far apart, we are connected beneath the same moon.",
    "Gazing at the Moon and Thinking of Someone Far Away",
    "Zhang Jiuling",
    "Tang dynasty",
    "Complete Tang Poems",
    "The moon creates a shared present for people separated by great distance.",
    ["we are under the same moon", "we share the same moon", "connected across distance", "far apart but together tonight", "thinking of you under the moon", "same sky different places", "long distance connection"],
    ["moon-and-night", "missing-someone", "farewell-and-distance", "family-and-reunion"],
    127
  ),
  classic(
    "dufu-yueye-moon-home",
    "Lù cóng jīn yè bái, yuè shì gù xiāng míng.",
    "From tonight the dew turns white; the moon is brightest in my homeland.",
    "Home always seems brighter when you are far away.",
    "Moonlit Night, Remembering My Younger Brothers",
    "Du Fu",
    "Tang dynasty",
    "Complete Tang Poems",
    "The claim is emotional rather than astronomical: distance makes the remembered moon of home feel brighter.",
    ["the moon is brighter at home", "home always feels better", "i miss my family tonight", "far away from my brothers", "the moon reminds me of home", "homesick under the moon", "nostalgia for home"],
    ["moon-and-night", "homesickness", "family-and-reunion"],
    125
  ),
  classic(
    "wangwei-zhuliguan-moon",
    "Shēn lín rén bù zhī, míng yuè lái xiāng zhào.",
    "No one knows me in the deep forest; the bright moon comes to shine upon me.",
    "Even in solitude, the moon can feel like quiet company.",
    "Bamboo Lodge",
    "Wang Wei",
    "Tang dynasty",
    "Complete Tang Poems",
    "The line gives companionship to moonlight without disturbing the stillness of being alone.",
    ["i enjoy being alone with the moon", "the moon keeps me company", "peaceful solitude at night", "alone but not lonely", "quiet night in nature", "moonlight companion", "solitude in the forest"],
    ["moon-and-night", "solitude-and-reflection", "inner-peace", "seasons-and-nature"],
    123
  ),
  classic(
    "zhangji-fengqiao-night",
    "Yuè luò wū tí shuāng mǎn tiān, jiāng fēng yú huǒ duì chóu mián.",
    "The moon sets, crows cry, and frost fills the sky; beside river maples and fishing lights, I lie awake in sorrow.",
    "I cannot sleep on this cold and lonely night.",
    "Mooring by Maple Bridge at Night",
    "Zhang Ji",
    "Tang dynasty",
    "Complete Tang Poems",
    "Sound, frost, dim lights, and the traveler's wakefulness combine into a vivid scene of nocturnal sorrow.",
    ["i cannot sleep on a cold night", "lonely sleepless night", "awake with sorrow", "night travel loneliness", "moonset and frost", "sad beside the river", "insomnia while traveling"],
    ["moon-and-night", "solitude-and-reflection", "sadness-and-loneliness", "travel-and-journey"],
    124
  ),
  classic(
    "sushi-shuidiao-imperfection",
    "Rén yǒu bēi huān lí hé, yuè yǒu yīn qíng yuán quē, cǐ shì gǔ nán quán.",
    "People have sorrow and joy, meeting and separation; the moon has brightness and shadow, fullness and loss. Such things have never been complete.",
    "Life cannot remain perfect or whole all the time.",
    "Prelude to Water Melody: When Will the Moon Be Clear and Bright?",
    "Su Shi",
    "Northern Song dynasty",
    "Dongpo Yuefu",
    "Human change and lunar change are placed side by side, making incompleteness a shared condition rather than a private failure.",
    ["life cannot be perfect", "accept imperfection", "people meet and separate", "nothing stays complete", "life has sorrow and joy", "the moon waxes and wanes", "accept what cannot be perfect"],
    ["moon-and-night", "time-and-impermanence", "letting-go", "life"],
    127
  ),

  classic(
    "menghaoran-chunxiao-spring",
    "Chūn mián bù jué xiǎo, chù chù wén tí niǎo.",
    "Sleeping in spring, I do not notice dawn; everywhere I hear birds calling.",
    "Spring arrives gently in light, sleep, and birdsong.",
    "Spring Dawn",
    "Meng Haoran",
    "Tang dynasty",
    "Complete Tang Poems",
    "The poem notices spring through the body and the ear rather than through a grand announcement.",
    ["spring morning birds", "spring has arrived", "waking to birdsong", "gentle spring morning", "beautiful spring dawn", "nature waking up", "peaceful morning"],
    ["seasons-and-nature", "inner-peace"],
    121
  ),
  classic(
    "wangwei-shanju-autumn",
    "Kōng shān xīn yǔ hòu, tiān qì wǎn lái qiū.",
    "After fresh rain in the empty mountains, the evening air turns autumnal.",
    "Rain clears the world and autumn quietly arrives.",
    "Mountain Dwelling on an Autumn Evening",
    "Wang Wei",
    "Tang dynasty",
    "Complete Tang Poems",
    "Fresh rain and evening coolness mark a seasonal change through atmosphere rather than statement.",
    ["autumn after rain", "quiet mountain evening", "fresh air after rain", "autumn is arriving", "peaceful nature", "mountain rain", "calm autumn evening"],
    ["seasons-and-nature", "inner-peace", "solitude-and-reflection"],
    124
  ),
  classic(
    "hanyu-early-spring",
    "Tiān jiē xiǎo yǔ rùn rú sū, cǎo sè yáo kàn jìn què wú.",
    "A fine rain softens the capital streets like cream; from afar the grass is green, yet up close it seems absent.",
    "Spring is beginning so quietly that change is easier to see from a distance.",
    "Early Spring, Presented to Zhang of the Water Ministry",
    "Han Yu",
    "Tang dynasty",
    "Complete Tang Poems",
    "The almost invisible grass makes early change feel delicate, real, and easy to overlook.",
    ["spring is beginning quietly", "small changes are happening", "early spring rain", "grass green from far away", "subtle new beginning", "new growth is barely visible", "gentle renewal"],
    ["seasons-and-nature", "mistakes-and-renewal", "time-and-impermanence"],
    125
  ),
  classic(
    "dumu-shanxing-maples",
    "Tíng chē zuò ài fēng lín wǎn, shuāng yè hóng yú èr yuè huā.",
    "I stop the carriage because I love the evening maple woods; frost-red leaves are brighter than flowers of the second month.",
    "Autumn can be as vivid and beautiful as spring.",
    "Mountain Journey",
    "Du Mu",
    "Tang dynasty",
    "Complete Tang Poems",
    "The speaker chooses to stop and look, overturning the assumption that spring flowers own all beauty.",
    ["autumn is beautiful", "red maple leaves", "stop and enjoy the view", "autumn brighter than spring", "fall colors", "frost red leaves", "beauty in later seasons"],
    ["seasons-and-nature", "life"],
    123
  ),
  classic(
    "yangwanli-lotus-summer",
    "Jiē tiān lián yè wú qióng bì, yìng rì hé huā bié yàng hóng.",
    "Lotus leaves reach the sky in endless green; beneath the sun, lotus flowers glow with an unmatched red.",
    "Summer opens into boundless green and radiant color.",
    "Leaving Jingci Temple at Dawn to See Lin Zifang Off",
    "Yang Wanli",
    "Southern Song dynasty",
    "Song poetry",
    "The scale of the leaves and intensity of the flowers make the scene feel larger than an ordinary summer garden.",
    ["summer lotus flowers", "endless green lotus leaves", "beautiful summer lake", "lotus under the sun", "radiant flowers", "summer scenery", "bright natural beauty"],
    ["seasons-and-nature", "beauty"],
    123
  ),
  classic(
    "liuyuxi-autumn-crane",
    "Qíng kōng yī hè pái yún shàng, biàn yǐn shī qíng dào bì xiāo.",
    "A crane rises through the clouds in the clear sky, carrying poetic feeling into the blue heights.",
    "Autumn can lift the spirit instead of making it fall.",
    "Autumn Song, No. 1",
    "Liu Yuxi",
    "Tang dynasty",
    "Complete Tang Poems",
    "The upward movement of the crane deliberately replaces conventional autumn sadness with energy and imagination.",
    ["autumn can still be hopeful", "rise above sadness", "a crane through the clouds", "hopeful autumn poem", "lift your spirit", "autumn inspiration", "look upward"],
    ["seasons-and-nature", "perseverance", "ambition-and-success"],
    126
  ),
  classic(
    "wanganshi-plum-fragrance",
    "Yáo zhī bù shì xuě, wèi yǒu àn xiāng lái.",
    "From afar I know it is not snow, because a hidden fragrance reaches me.",
    "Quiet beauty reveals itself even in winter.",
    "Plum Blossoms",
    "Wang Anshi",
    "Northern Song dynasty",
    "Collected Works of Wang Anshi",
    "The flower is recognized not by display but by fragrance, while blooming alone in the cold.",
    ["beauty can bloom in winter", "plum blossom fragrance", "quiet strength", "hidden beauty", "flowering in the cold", "subtle elegance", "winter resilience"],
    ["seasons-and-nature", "beauty", "perseverance"],
    124
  ),

  classic(
    "wangwei-luchai-empty-mountain",
    "Kōng shān bù jiàn rén, dàn wén rén yǔ xiǎng.",
    "In the empty mountains no person can be seen; only the echo of human voices is heard.",
    "The world can be quiet enough for a distant sound to become vivid.",
    "Deer Enclosure",
    "Wang Wei",
    "Tang dynasty",
    "Complete Tang Poems",
    "The unseen speaker and audible echo sharpen awareness rather than simply describing absence.",
    ["i want solitude in nature", "empty mountain silence", "quiet enough to hear echoes", "away from crowds", "peaceful isolation", "deep forest quiet", "listen in silence"],
    ["solitude-and-reflection", "seasons-and-nature", "inner-peace"],
    122
  ),
  classic(
    "libai-jingtingshan-companion",
    "Xiāng kàn liǎng bù yàn, zhǐ yǒu Jìng Tíng Shān.",
    "We look at each other without tiring—only Mount Jingting and I.",
    "Nature can be the companion that never exhausts you.",
    "Sitting Alone on Mount Jingting",
    "Li Bai",
    "Tang dynasty",
    "Complete Tang Poems",
    "The mountain is personified as a companion whose silent presence survives when birds and clouds have left.",
    ["nature is my companion", "i want to be alone with the mountains", "only the mountain understands me", "peaceful companionship", "alone without boredom", "silent friend", "solitude with nature"],
    ["solitude-and-reflection", "seasons-and-nature", "inner-peace"],
    124
  ),
  classic(
    "liuzongyuan-jiangxue-solitude",
    "Gū zhōu suō lì wēng, dú diào hán jiāng xuě.",
    "In a lone boat, an old man in a straw cape fishes alone in the snowy river cold.",
    "One person remains steady in a vast and empty winter world.",
    "River Snow",
    "Liu Zongyuan",
    "Tang dynasty",
    "Complete Tang Poems",
    "The isolated fisherman can suggest loneliness, endurance, independence, or refusal to yield, depending on the reader's situation.",
    ["a lonely boat in the snow", "alone but unbroken", "solitude in winter", "one person against the cold", "independent spirit", "fishing alone", "steadfast in isolation"],
    ["solitude-and-reflection", "seasons-and-nature", "courage-and-principles"],
    126
  ),
  classic(
    "chenziang-youzhou-solitude",
    "Niàn tiān dì zhī yōu yōu, dú chuàng rán ér tì xià.",
    "Thinking of the endlessness of heaven and earth, alone in sorrow I shed tears.",
    "The scale of time and the world can make one person's loneliness feel overwhelming.",
    "Song on Climbing Youzhou Terrace",
    "Chen Zi'ang",
    "Tang dynasty",
    "Complete Tang Poems",
    "The poem looks backward and forward through time and finds no answering figure, turning historical isolation into personal grief.",
    ["i feel alone beneath the sky", "no one understands me", "lonely in the vast world", "existential loneliness", "small beneath heaven", "alone across time", "overwhelmed by the universe"],
    ["solitude-and-reflection", "sadness-and-loneliness", "time-and-impermanence"],
    124
  ),
  classic(
    "sushi-busuanzi-lonely-sandbar",
    "Jiǎn jìn hán zhī bù kěn qī, jì mò shā zhōu lěng.",
    "After choosing through every cold branch, it still refuses to settle, alone on the chilly sandbar.",
    "I would rather remain alone than settle where I do not belong.",
    "Song of Divination: At Dinghui Temple in Huangzhou",
    "Su Shi",
    "Northern Song dynasty",
    "Dongpo Yuefu",
    "The solitary wild goose is often read as a figure of wounded pride and self-possession, not merely romantic loneliness.",
    ["i would rather be alone than settle", "do not settle for the wrong place", "lonely but principled", "refuse to compromise yourself", "cold sandbar", "self respect in solitude", "alone by choice"],
    ["solitude-and-reflection", "courage-and-principles", "sadness-and-loneliness"],
    125
  ),

  classic(
    "wangwan-beigushan-sail",
    "Cháo píng liǎng àn kuò, fēng zhèng yī fān xuán.",
    "The tide lies level and the two banks open wide; the wind is fair and a single sail hangs full.",
    "The way ahead is open and the wind is right for moving forward.",
    "Mooring Below Mount Beigu",
    "Wang Wan",
    "Tang dynasty",
    "Complete Tang Poems",
    "A full sail and widened river make favorable conditions visible without guaranteeing what comes next.",
    ["may your journey have fair wind", "the road ahead is open", "full sail forward", "good conditions for departure", "a wide river and fair wind", "start the journey", "smooth sailing"],
    ["travel-and-journey", "ambition-and-success", "celebrations-and-new-beginnings"],
    125
  ),
  classic(
    "libai-yellow-crane-farewell",
    "Gū fān yuǎn yǐng bì kōng jìn, wéi jiàn Cháng Jiāng tiān jì liú.",
    "The distant shadow of the lone sail disappears into the blue sky; only the Yangtze remains, flowing to the horizon.",
    "I keep watching long after my friend has sailed away.",
    "Seeing Meng Haoran Off to Guangling from Yellow Crane Tower",
    "Li Bai",
    "Tang dynasty",
    "Complete Tang Poems",
    "The speaker's sustained gaze makes farewell visible through the shrinking sail and the river that remains.",
    ["i watched my friend sail away", "farewell by the river", "hard to say goodbye", "friend leaving for far away", "watching someone disappear", "long goodbye", "miss a departing friend"],
    ["travel-and-journey", "farewell-and-distance", "friendship"],
    126
  ),
  classic(
    "wangwei-frontier-sunset",
    "Dà mò gū yān zhí, cháng hé luò rì yuán.",
    "In the great desert a lone column of smoke rises straight; over the long river the setting sun is round.",
    "The frontier landscape is immense, spare, and unforgettable.",
    "Sent to the Frontier",
    "Wang Wei",
    "Tang dynasty",
    "Complete Tang Poems",
    "Two simple vertical and circular forms create one of the most spacious visual scenes in Chinese poetry.",
    ["the desert sunset is vast", "frontier landscape", "lone smoke in the desert", "long river sunset", "immense travel scenery", "journey through the desert", "wide open landscape"],
    ["travel-and-journey", "seasons-and-nature", "solitude-and-reflection"],
    124
  ),
  classic(
    "dufu-wangyue-summit",
    "Huì dāng líng jué dǐng, yī lǎn zhòng shān xiǎo.",
    "I will surely climb to the highest summit and see all the other mountains become small.",
    "Aim for the summit and gain the wider view that effort makes possible.",
    "Gazing at Mount Tai",
    "Du Fu",
    "Tang dynasty",
    "Complete Tang Poems",
    "The future tense matters: the summit is a declared ambition, not an achievement already possessed.",
    ["climb to the highest peak", "reach the summit", "aim higher", "overcome the mountain", "gain a wider view", "ambitious journey", "challenge yourself"],
    ["travel-and-journey", "ambition-and-success", "perseverance"],
    126
  ),

  classic(
    "mengjiao-youziyin-mother",
    "Shuí yán cùn cǎo xīn, bào dé sān chūn huī.",
    "Who says the inch-long grass can repay the radiance of three spring months?",
    "A child's gratitude can never fully repay a mother's care.",
    "Song of the Traveling Son",
    "Meng Jiao",
    "Tang dynasty",
    "Complete Tang Poems",
    "The small grass and spring sunlight turn unequal scale into an image of a child's debt to maternal love.",
    ["i miss my mother", "thank you mom", "a mother's love cannot be repaid", "gratitude to parents", "mother cared for me", "chinese poem for mother", "parental love"],
    ["parents-and-filial-love", "family-and-reunion", "homesickness"],
    127
  ),
  classic(
    "shijing-liaoe-parents",
    "Āi āi fù mǔ, shēng wǒ qú láo.",
    "How sorrowful for my parents, who bore and raised me through such toil.",
    "I remember how much my parents endured to raise me.",
    "Liao E",
    "Anonymous",
    "Pre-Qin China",
    "The Book of Songs",
    "This is a grieving and retrospective poem, so it suits remembrance and gratitude more than a light celebratory caption.",
    ["parents work hard for their children", "gratitude for my parents", "remember my parents' sacrifices", "my parents raised me with hardship", "honor parents", "miss my parents", "parental sacrifice"],
    ["parents-and-filial-love", "family-and-reunion", "sadness-and-loneliness"],
    124
  ),
  classic(
    "lunyu-liren-travel-parents",
    "Fù mǔ zài, bù yuǎn yóu; yóu bì yǒu fāng.",
    "While one's parents are alive, do not travel far; if one must travel, have a definite destination.",
    "When you go far away, remain responsible to the family who worries about you.",
    "Analects 4: Li Ren",
    "Confucius",
    "Pre-Qin China",
    "The Analects",
    "The line reflects an ancient family structure; a modern reading can preserve its concern for communication and responsibility without treating all travel as wrong.",
    ["tell your family where you are going", "parents worry when you travel", "stay responsible while away", "do not disappear on your family", "travel with a clear plan", "care for parents from afar", "family responsibility"],
    ["parents-and-filial-love", "travel-and-journey", "family-and-reunion"],
    119
  ),
  classic(
    "xiaojing-body-parents",
    "Shēn tǐ fà fū, shòu zhī fù mǔ, bù gǎn huǐ shāng, xiào zhī shǐ yě.",
    "Body, hair, and skin are received from one's parents; not daring to injure them is the beginning of filial conduct.",
    "Taking care of yourself can also be a responsibility to those who love you.",
    "Classic of Filial Piety: Opening Explanation",
    "Traditionally transmitted through Zengzi",
    "Pre-Qin China",
    "Classic of Filial Piety",
    "This reflects an ancient account of filial duty. It is presented as historical ethical context, not as medical guidance or a judgment about illness and injury.",
    ["take care of yourself for your family", "protect your health", "your body matters to your parents", "self care is a responsibility", "cherish your life", "look after yourself", "family cares about your wellbeing"],
    ["parents-and-filial-love", "family-and-reunion", "critical-thinking-and-empathy"],
    119
  ),

  classic(
    "hanyu-shishuo-student-teacher",
    "Dì zǐ bù bì bù rú shī, shī bù bì xián yú dì zǐ.",
    "A student need not be inferior to the teacher, nor must a teacher be superior to the student.",
    "Students can surpass teachers, and expertise can differ by subject.",
    "On Teachers",
    "Han Yu",
    "Tang dynasty",
    "Guwen Guanzhi: On Teachers",
    "The following sentence explains that people encounter the Way at different times and specialize in different fields.",
    ["students can surpass teachers", "a teacher does not know everything", "expertise differs", "student becomes better than mentor", "learn from younger people", "teacher and student equality", "specialization matters"],
    ["teaching-and-mentorship", "learning-and-growth", "perspective-and-self-knowledge"],
    126
  ),
  classic(
    "lunyu-shuer-teach-tireless",
    "Xué ér bù yàn, huì rén bù juàn.",
    "Learn without weariness and teach others without tiring.",
    "Keep learning, and teach with patience.",
    "Analects 7: Shu Er",
    "Confucius",
    "Pre-Qin China",
    "The Analects",
    "Learning and teaching appear as parallel disciplines rather than separate identities.",
    ["teach without growing tired", "lifelong learning", "patient teacher", "keep learning and sharing", "love teaching", "never stop learning", "dedicated educator"],
    ["teaching-and-mentorship", "learning-and-growth"],
    124
  ),
  classic(
    "lunyu-weizheng-review-new",
    "Wēn gù ér zhī xīn, kě yǐ wéi shī yǐ.",
    "Review what is old and understand what is new; then one can serve as a teacher.",
    "Return to what you know until it yields a new understanding.",
    "Analects 2: Wei Zheng",
    "Confucius",
    "Pre-Qin China",
    "The Analects",
    "Review is valuable here because it creates insight, not because repetition alone is virtuous.",
    ["review the old to learn the new", "revision creates understanding", "learn something new from old knowledge", "study by reviewing", "what makes a good teacher", "return to the basics", "deeper understanding"],
    ["teaching-and-mentorship", "learning-and-growth", "wisdom"],
    126
  ),
  classic(
    "liji-xueji-teaching-learning",
    "Jiào xué xiāng zhǎng yě.",
    "Teaching and learning cause each other to grow.",
    "Teachers and students can improve through one another.",
    "Record of Learning",
    "Anonymous",
    "Pre-Qin China",
    "Book of Rites: Record of Learning",
    "The surrounding passage says learning reveals what one lacks, while teaching reveals where one is blocked.",
    ["teachers and students grow together", "teaching helps the teacher learn", "mutual learning", "learn by teaching", "education is two way", "teacher learns from students", "teaching and learning support each other"],
    ["teaching-and-mentorship", "learning-and-growth", "friendship"],
    127
  ),

  classic(
    "mengzi-jinxin-books-critical",
    "Jìn xìn shū, zé bù rú wú shū.",
    "To believe books completely is worse than having no books.",
    "Read seriously, but do not surrender your judgment to the page.",
    "Mencius: Jin Xin II",
    "Mencius",
    "Warring States period",
    "Mencius",
    "The statement occurs in a discussion of how historical texts should be interpreted rather than accepted without discrimination.",
    ["do not believe every book blindly", "question what you read", "books can be wrong", "critical reading", "use independent judgment", "do not trust authority blindly", "think for yourself"],
    ["critical-thinking-and-empathy", "wisdom", "learning-and-growth"],
    127
  ),
  classic(
    "lunyu-weilinggong-golden-rule",
    "Jǐ suǒ bù yù, wù shī yú rén.",
    "What you do not desire for yourself, do not impose upon others.",
    "Respect other people by refusing to force on them what you would reject yourself.",
    "Analects 15: Wei Ling Gong",
    "Confucius",
    "Pre-Qin China",
    "The Analects",
    "This is a restraint-based formulation of reciprocity: begin by limiting the harm or pressure you place on others.",
    ["treat others as you wish to be treated", "do not force others", "respect other people's boundaries", "golden rule", "show empathy", "do not do to others what you hate", "consider other people"],
    ["critical-thinking-and-empathy", "fairness-and-integrity", "friendship"],
    128
  ),
  classic(
    "lunyu-liren-reflect",
    "Jiàn xián sī qí yān, jiàn bù xián ér nèi zì xǐng yě.",
    "When you see a worthy person, think of becoming their equal; when you see someone unworthy, examine yourself within.",
    "Learn from good examples, and use bad examples to inspect yourself.",
    "Analects 4: Li Ren",
    "Confucius",
    "Pre-Qin China",
    "The Analects",
    "The second half turns criticism outward into a demand for self-examination.",
    ["learn from good people and reflect on bad examples", "use others as a mirror", "follow worthy examples", "look inward before judging", "self reflection", "improve by observing others", "learn from good and bad"],
    ["critical-thinking-and-empathy", "learning-and-growth", "perspective-and-self-knowledge"],
    126
  ),
  classic(
    "lunyu-xianjin-too-much",
    "Guò yóu bù jí.",
    "Going too far is no better than falling short.",
    "Excess and deficiency can both miss the right measure.",
    "Analects 11: Xian Jin",
    "Confucius",
    "Pre-Qin China",
    "The Analects",
    "This concise judgment is about proportion, not a claim that every dispute should be solved by choosing the numerical middle.",
    ["too much is as bad as too little", "do not overdo it", "find the right balance", "excess can be harmful", "avoid extremes", "use the right measure", "moderation matters"],
    ["critical-thinking-and-empathy", "inner-peace", "wisdom"],
    125
  ),

  classic(
    "caocao-guisu-old-steed",
    "Lǎo jì fú lì, zhì zài qiān lǐ; liè shì mù nián, zhuàng xīn bù yǐ.",
    "An old warhorse rests by the manger, yet its ambition remains a thousand miles; a person of spirit in later years does not let bold purpose cease.",
    "Age does not have to end ambition or purpose.",
    "Though the Tortoise Lives Long",
    "Cao Cao",
    "Eastern Han dynasty",
    "Yuefu Poetry Collection",
    "The image acknowledges age directly while separating physical stage from the continued reach of aspiration.",
    ["stay ambitious as you grow older", "you are never too old to dream", "purpose in later life", "old but still driven", "ambition does not retire", "keep your spirit alive", "dreams after retirement"],
    ["aging-and-resilience", "ambition-and-success", "perseverance"],
    128
  ),
  classic(
    "wangbo-old-stronger",
    "Lǎo dāng yì zhuàng, nǐng yí bái shǒu zhī xīn; qióng qiě yì jiān, bù zhuì qīng yún zhī zhì.",
    "In old age one should grow still stronger—how could a white-haired heart be changed? In hardship one should grow still firmer and never let high aspiration fall.",
    "Neither age nor hardship should make you abandon a worthy ambition.",
    "Preface to the Pavilion of Prince Teng",
    "Wang Bo",
    "Tang dynasty",
    "Guwen Guanzhi: Preface to the Pavilion of Prince Teng",
    "The paired clauses join aging and adversity as two pressures that can strengthen rather than erase resolve.",
    ["hardship should not break your ambition", "grow stronger with age", "do not abandon your ideals", "stay firm in difficult times", "old age and courage", "keep high aspirations", "resilience through hardship"],
    ["aging-and-resilience", "courage-and-principles", "perseverance", "ambition-and-success"],
    128
  )
];

export const WAVE2_ENGLISH_SEO_QUERIES = [
  "Looking at the moon makes me miss home",
  "We are under the same moon",
  "The moon is brighter at home",
  "I enjoy being alone with the moon",
  "I cannot sleep on a cold night",
  "Life cannot be perfect",
  "Spring is beginning quietly",
  "Autumn can still be hopeful",
  "Beauty can bloom in winter",
  "I want solitude in nature",
  "A lonely boat in the snow",
  "I would rather be alone than settle",
  "May your journey have fair wind",
  "I watched my friend sail away",
  "The desert sunset is vast",
  "Climb to the highest peak",
  "I miss my mother",
  "Parents work hard for their children",
  "Take care of yourself for your family",
  "Students can surpass teachers",
  "Teach without growing tired",
  "Review the old to learn the new",
  "Teachers and students grow together",
  "Do not believe every book blindly",
  "Treat others as you wish to be treated",
  "Learn from good people and reflect on bad examples",
  "Too much is as bad as too little",
  "Stay ambitious as you grow older",
  "Hardship should not break your ambition"
] as const;

function uniqueBy<T>(items: T[], key: (item: T) => string): T[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    const value = key(item);
    if (seen.has(value)) return false;
    seen.add(value);
    return true;
  });
}

export const ENGLISH_TOPICS: EnglishTopic[] = uniqueBy(
  [...PREVIOUS_ENGLISH_TOPICS, ...WAVE2_ENGLISH_TOPICS],
  (topic) => topic.slug
);

export const ENGLISH_CLASSICS: EnglishClassic[] = uniqueBy(
  [...PREVIOUS_ENGLISH_CLASSICS, ...WAVE2_ENGLISH_CLASSICS],
  (item) => item.id
);

export const ENGLISH_SEO_QUERIES = uniqueBy(
  [...PREVIOUS_ENGLISH_SEO_QUERIES, ...WAVE2_ENGLISH_SEO_QUERIES],
  (query) => normalizeEnglishQuery(query)
);

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
