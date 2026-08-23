export type EnglishAuthorProfile = {
  slug: string;
  name: string;
  chineseName: string;
  era: string;
  role: string;
  description: string;
  intro: string;
  authorNames: readonly string[];
};

export type EnglishWorkProfile = {
  slug: string;
  name: string;
  chineseName: string;
  kind: string;
  description: string;
  intro: string;
  sourceNames?: readonly string[];
  sourcePrefixes?: readonly string[];
};

export const ENGLISH_AUTHOR_PROFILES: readonly EnglishAuthorProfile[] = [
  {
    slug: "li-bai",
    name: "Li Bai",
    chineseName: "李白",
    era: "Tang dynasty",
    role: "Poet",
    description: "Moonlight, homesickness, friendship, ambition, beauty, release, and celebration in some of the most recognizable lines of Tang poetry.",
    intro: "This collection brings together the Li Bai lines currently verified in Gu Ren Said. Read the original Chinese beside pinyin, a close English rendering, plain meaning, work, collection, and source context.",
    authorNames: ["Li Bai"]
  },
  {
    slug: "su-shi",
    name: "Su Shi",
    chineseName: "苏轼",
    era: "Northern Song dynasty",
    role: "Poet and prose writer",
    description: "Moonlight, separation, imperfection, perspective, hardship, and emotional steadiness expressed with unusual breadth and clarity.",
    intro: "Su Shi's lines in this corpus move between intimate feeling and a much wider view of life. Each quotation remains tied to its poem or prose work rather than being detached as a generic slogan.",
    authorNames: ["Su Shi"]
  },
  {
    slug: "wang-wei",
    name: "Wang Wei",
    chineseName: "王维",
    era: "Tang dynasty",
    role: "Poet",
    description: "Quiet mountains, moonlit solitude, travel, family longing, and landscape poems where stillness carries emotional meaning.",
    intro: "Wang Wei's verified lines show how sparse natural images can hold homesickness, solitude, calm, and attention. The bilingual cards preserve both the scene and the source.",
    authorNames: ["Wang Wei"]
  },
  {
    slug: "du-fu",
    name: "Du Fu",
    chineseName: "杜甫",
    era: "Tang dynasty",
    role: "Poet",
    description: "Family separation, moonlit remembrance, aspiration, praise, and moral seriousness grounded in lived difficulty.",
    intro: "The Du Fu lines collected here connect private feeling with a larger historical and ethical world. English explanations are reading aids; the Chinese text and source remain primary.",
    authorNames: ["Du Fu"]
  },
  {
    slug: "confucius",
    name: "Confucius",
    chineseName: "孔子",
    era: "Pre-Qin China",
    role: "Teacher and thinker",
    description: "Learning, friendship, self-reflection, fairness, proper conduct, patience, and empathy from source-linked passages in the Analects.",
    intro: "These entries return familiar sayings to their chapters in the Analects. They are organized around modern questions while keeping the original wording and attribution visible.",
    authorNames: ["Confucius"]
  },
  {
    slug: "laozi",
    name: "Laozi",
    chineseName: "老子",
    era: "Spring and Autumn period",
    role: "Thinker",
    description: "Beginnings, self-knowledge, limits, contentment, and durable action in concise passages from the Tao Te Ching.",
    intro: "The Laozi collection focuses on compact statements that are often quoted without context. Each page keeps the chapter, original Chinese, and an explanatory rather than definitive English rendering.",
    authorNames: ["Laozi"]
  },
  {
    slug: "mencius",
    name: "Mencius",
    chineseName: "孟子",
    era: "Warring States period",
    role: "Thinker",
    description: "Human cooperation, hardship, integrity, ambition, and independent judgment in arguments that remain practical today.",
    intro: "These passages from Mencius are presented as source-linked arguments, not decorative quotations. Their surrounding ideas help distinguish encouragement, criticism, and ethical principle.",
    authorNames: ["Mencius"]
  },
  {
    slug: "xunzi",
    name: "Xunzi",
    chineseName: "荀子",
    era: "Warring States period",
    role: "Thinker",
    description: "Learning, accumulation, persistence, transformation, and the intelligent use of tools and conditions.",
    intro: "Xunzi's strongest lines in this corpus treat growth as a process: study, practice, persistence, and leverage. They are especially useful for modern questions about learning and work.",
    authorNames: ["Xunzi"]
  },
  {
    slug: "zhuangzi",
    name: "Zhuangzi",
    chineseName: "庄子",
    era: "Warring States period",
    role: "Thinker and writer",
    description: "Freedom from judgment, limits of perspective, letting go, and the difference between survival and genuine ease.",
    intro: "Zhuangzi's images are easy to oversimplify. These entries keep cultural notes where a modern motivational reading could erase the original argument or story.",
    authorNames: ["Zhuangzi"]
  },
  {
    slug: "han-yu",
    name: "Han Yu",
    chineseName: "韩愈",
    era: "Tang dynasty",
    role: "Prose writer and poet",
    description: "Teachers, students, practice, diligence, talent, recognition, and the first signs of spring.",
    intro: "The Han Yu collection joins essays on learning and talent with poetry. It makes a useful bridge between literary expression and practical questions about education and work.",
    authorNames: ["Han Yu"]
  }
] as const;

export const ENGLISH_WORK_PROFILES: readonly EnglishWorkProfile[] = [
  {
    slug: "book-of-songs",
    name: "The Book of Songs",
    chineseName: "《诗经》",
    kind: "Classical anthology",
    description: "Early Chinese songs of love, marriage, longing, family, ritual, beauty, and social feeling.",
    intro: "This page gathers source-linked lines from the Book of Songs that are already used by the English search. Each entry keeps its poem title, original Chinese, pinyin, and explanatory translation.",
    sourceNames: ["The Book of Songs"]
  },
  {
    slug: "analects",
    name: "The Analects",
    chineseName: "《论语》",
    kind: "Classical philosophical text",
    description: "Teachings on learning, conduct, friendship, empathy, patience, integrity, and self-correction.",
    intro: "These passages are grouped by their source in the Analects rather than by a modern quote list. Chapter labels and attribution remain visible on every card.",
    sourceNames: ["The Analects"]
  },
  {
    slug: "tao-te-ching",
    name: "Tao Te Ching",
    chineseName: "《道德经》",
    kind: "Classical philosophical text",
    description: "Concise teachings on beginnings, self-knowledge, limits, contentment, and lasting action.",
    intro: "The English wording here is designed to clarify the selected Chinese lines, not replace the many possible literary and philosophical translations of the Tao Te Ching.",
    sourceNames: ["Tao Te Ching"]
  },
  {
    slug: "mencius",
    name: "Mencius",
    chineseName: "《孟子》",
    kind: "Classical philosophical text",
    description: "Arguments about human cooperation, adversity, moral courage, judgment, and responsibility.",
    intro: "This collection keeps short passages connected to the larger argumentative text of Mencius and marks their modern use without pretending they are context-free slogans.",
    sourceNames: ["Mencius"]
  },
  {
    slug: "xunzi",
    name: "Xunzi",
    chineseName: "《荀子》",
    kind: "Classical philosophical text",
    description: "Systematic teachings on learning, persistence, transformation, method, and the use of tools.",
    intro: "These selected passages show why Xunzi remains especially useful for questions about education, disciplined practice, and compounding effort.",
    sourceNames: ["Xunzi"]
  },
  {
    slug: "zhuangzi",
    name: "Zhuangzi",
    chineseName: "《庄子》",
    kind: "Classical philosophical and literary text",
    description: "Stories and arguments about freedom, perspective, judgment, limitation, and letting go.",
    intro: "Because Zhuangzi often reasons through stories and paradox, this page preserves explanatory notes where a single line can otherwise be misunderstood.",
    sourceNames: ["Zhuangzi"]
  },
  {
    slug: "complete-tang-poems",
    name: "Complete Tang Poems",
    chineseName: "《全唐诗》",
    kind: "Poetry collection",
    description: "The largest source collection in the English corpus, spanning love, farewell, moonlight, nature, ambition, solitude, travel, and resilience.",
    intro: "This is a curated view of Tang lines already verified for the product, not a machine-translated dump of the whole anthology. Each item has an English intent, source, and explanatory translation.",
    sourceNames: ["Complete Tang Poems"]
  },
  {
    slug: "records-of-the-grand-historian",
    name: "Records of the Grand Historian",
    chineseName: "《史记》",
    kind: "Historical work",
    description: "Historical scenes and judgments about reputation, ambition, strategy, character, and leadership.",
    intro: "These lines come from biographical and annalistic passages in the Records of the Grand Historian. Their source context matters as much as their modern application.",
    sourceNames: ["Records of the Grand Historian"]
  },
  {
    slug: "strategies-of-the-warring-states",
    name: "Strategies of the Warring States",
    chineseName: "《战国策》",
    kind: "Historical and rhetorical collection",
    description: "Practical images for learning from the past, repairing mistakes, managing risk, and keeping alternatives.",
    intro: "This collection groups verified passages from the Strategies of the Warring States around decision-making and recovery while keeping the original source divisions visible.",
    sourceNames: ["Strategies of the Warring States"]
  },
  {
    slug: "book-of-rites",
    name: "Book of Rites",
    chineseName: "《礼记》",
    kind: "Classical ritual and educational text",
    description: "Passages from the Great Learning, Doctrine of the Mean, Record of Learning, and related chapters on attention, preparation, practice, and teaching.",
    intro: "The Book of Rites collection brings together several distinct chapters. Each card shows its own chapter title so the broader source does not flatten their differences.",
    sourcePrefixes: ["Book of Rites"]
  },
  {
    slug: "guwen-guanzhi",
    name: "Guwen Guanzhi",
    chineseName: "《古文观止》",
    kind: "Classical prose anthology",
    description: "Selected prose on teachers, talent, responsibility, cosmic perspective, and disciplined learning.",
    intro: "The source labels on this page identify the individual prose work within Guwen Guanzhi, allowing modern readers to move from a famous line back to its essay.",
    sourcePrefixes: ["Guwen Guanzhi"]
  },
  {
    slug: "dongpo-yuefu",
    name: "Dongpo Yuefu",
    chineseName: "《东坡乐府》",
    kind: "Poetry collection",
    description: "Su Shi's lyric poetry on moonlight, distance, imperfection, weather, and emotional freedom.",
    intro: "These selected lyrics show how Su Shi turns weather and moonlight into reflections on separation, resilience, and a life that cannot be perfectly complete.",
    sourceNames: ["Dongpo Yuefu"]
  }
] as const;

function matchesWork(profile: EnglishWorkProfile, sourceEn: string) {
  if (profile.sourceNames?.includes(sourceEn)) return true;
  return profile.sourcePrefixes?.some((prefix) => sourceEn.startsWith(prefix)) ?? false;
}

export function getEnglishAuthorProfile(slug: string) {
  return ENGLISH_AUTHOR_PROFILES.find((profile) => profile.slug === slug);
}

export function getEnglishAuthorProfileByName(authorEn: string) {
  return ENGLISH_AUTHOR_PROFILES.find((profile) => profile.authorNames.includes(authorEn));
}

export function getEnglishWorkProfile(slug: string) {
  return ENGLISH_WORK_PROFILES.find((profile) => profile.slug === slug);
}

export function getEnglishWorkProfileBySource(sourceEn: string) {
  return ENGLISH_WORK_PROFILES.find((profile) => matchesWork(profile, sourceEn));
}

export function englishAuthorHref(authorEn: string) {
  const profile = getEnglishAuthorProfileByName(authorEn);
  return profile ? `/en/poets/${profile.slug}` : null;
}

export function englishWorkHref(sourceEn: string) {
  const profile = getEnglishWorkProfileBySource(sourceEn);
  return profile ? `/en/works/${profile.slug}` : null;
}

export function englishWorkMatches(profile: EnglishWorkProfile, sourceEn: string) {
  return matchesWork(profile, sourceEn);
}
