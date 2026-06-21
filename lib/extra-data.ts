import type { QuoteRecord, SlangMapping } from "./types";

export const EXTRA_QUOTES: QuoteRecord[] = [
  {
    id: "zhuo-wenjun-baitou-love",
    quote: "愿得一心人，白头不相离。",
    title: "白头吟",
    author: "卓文君",
    dynasty: "汉",
    source: "玉台新咏",
    context: "皑如山上雪，皎若云间月。闻君有两意，故来相决绝。愿得一心人，白头不相离。",
    translation: "表达想与所爱之人一心相守、白头不离，比直说“我爱你”更含蓄郑重。",
    themes: ["爱情", "告白", "相守", "承诺"],
    modernMeanings: ["我爱你", "想和你在一起", "我想和你一辈子在一起", "白头偕老"],
    emotion: "love",
    scene: ["表白", "爱情", "承诺", "相守"],
    weight: 120
  },
  {
    id: "yue-ren-ge-love",
    quote: "山有木兮木有枝，心悦君兮君不知。",
    title: "越人歌",
    author: "佚名",
    dynasty: "先秦",
    source: "说苑",
    context: "山有木兮木有枝，心悦君兮君不知。",
    translation: "写心里喜欢一个人却未必说出口，适合对应含蓄的“我喜欢你”“我爱你”。",
    themes: ["爱情", "告白", "心动", "暗恋"],
    modernMeanings: ["我爱你", "我喜欢你", "暗恋", "心悦你", "我想表白但不敢说"],
    emotion: "love",
    scene: ["表白", "暗恋", "心动"],
    weight: 119
  },
  {
    id: "shijing-jigu-love",
    quote: "死生契阔，与子成说。执子之手，与子偕老。",
    title: "击鼓",
    author: "佚名",
    dynasty: "先秦",
    source: "诗经",
    context: "死生契阔，与子成说。执子之手，与子偕老。",
    translation: "表达无论生死离合都愿相守，是非常经典的相爱与承诺。",
    themes: ["爱情", "相守", "承诺"],
    modernMeanings: ["我爱你", "执子之手", "余生一起", "白头偕老", "我只想和你在一起"],
    emotion: "love",
    scene: ["表白", "婚礼", "承诺", "相守"],
    weight: 118
  },
  {
    id: "wen-tingyun-hongdou-love",
    quote: "玲珑骰子安红豆，入骨相思知不知。",
    title: "新添声杨柳枝词",
    author: "温庭筠",
    dynasty: "唐",
    source: "全唐诗",
    context: "井底点灯深烛伊，共郎长行莫围棋。玲珑骰子安红豆，入骨相思知不知。",
    translation: "写相思入骨，适合表达“我很想你”“我很爱你”。",
    themes: ["爱情", "相思", "深情"],
    modernMeanings: ["我想你", "我爱你", "入骨相思", "很爱很爱你", "对你念念不忘"],
    emotion: "love",
    scene: ["表白", "思念", "爱情", "相思"],
    weight: 117
  },
  {
    id: "li-zhiyi-busuanzi-love",
    quote: "只愿君心似我心，定不负相思意。",
    title: "卜算子·我住长江头",
    author: "李之仪",
    dynasty: "北宋",
    source: "姑溪词",
    context: "我住长江头，君住长江尾。日日思君不见君，共饮长江水。只愿君心似我心，定不负相思意。",
    translation: "希望对方心意与自己相同，不辜负彼此相思，适合表达深情与想念。",
    themes: ["爱情", "相思", "深情"],
    modernMeanings: ["我想你", "我爱你", "希望你也喜欢我", "不负相思"],
    emotion: "love",
    scene: ["思念", "爱情", "表白"],
    weight: 116
  },
  {
    id: "qin-guan-queshen-love",
    quote: "两情若是久长时，又岂在朝朝暮暮。",
    title: "鹊桥仙·纤云弄巧",
    author: "秦观",
    dynasty: "北宋",
    source: "淮海词",
    context: "金风玉露一相逢，便胜却人间无数。两情若是久长时，又岂在朝朝暮暮。",
    translation: "表达真挚长久的感情不必拘泥于日日相守，适合异地恋和长久爱情。",
    themes: ["爱情", "长久", "相守"],
    modernMeanings: ["异地恋", "长久的爱", "只要相爱就够了", "我们会一直在一起"],
    emotion: "love",
    scene: ["爱情", "异地", "承诺"],
    weight: 112
  },
  {
    id: "shiji-zixu-appearance-judgement",
    quote: "以貌取人，失之子羽。",
    title: "仲尼弟子列传",
    author: "司马迁",
    dynasty: "西汉",
    source: "史记",
    context: "孔子曰：吾以言取人，失之宰予；以貌取人，失之子羽。",
    translation: "提醒人不能只凭外貌判断，适合把“你真丑”“不好看”这类外貌评价转成更有分寸的反讽。",
    themes: ["外貌", "判断", "反讽", "负向外貌"],
    modernMeanings: ["你真丑", "不好看", "难看", "别以貌取人", "不要只看脸"],
    emotion: "critical",
    scene: ["外貌", "吐槽", "反思"],
    weight: 118
  },
  {
    id: "shijing-xiangshu-insult",
    quote: "相鼠有皮，人而无仪。",
    title: "相鼠",
    author: "佚名",
    dynasty: "先秦",
    source: "诗经",
    context: "相鼠有皮，人而无仪；人而无仪，不死何为？",
    translation: "用鼠尚有皮来反衬人若无礼无仪，语气很重，适合表达对“丑态”“没礼貌”的讽刺。",
    themes: ["讽刺", "失礼", "吐槽", "负向外貌"],
    modernMeanings: ["人品丑", "丑态百出", "没礼貌", "太不像话", "你真丑"],
    emotion: "critical",
    scene: ["吐槽", "讽刺", "吵架"],
    weight: 110
  }
];

export const EXTRA_SLANG_MAPPINGS: SlangMapping[] = [
  {
    id: "love-confession",
    patterns: ["我爱你", "爱你", "我喜欢你", "喜欢你", "表白", "告白", "心悦", "暗恋", "想你", "我想你", "一辈子", "白头", "余生", "在一起", "念念不忘"],
    keywords: ["爱情", "告白", "相思", "相守", "承诺", "心悦", "愿得一心人", "白头不相离", "执子之手", "与子偕老", "入骨相思", "只愿君心似我心"],
    themes: ["爱情", "告白", "相思", "相守", "承诺"],
    emotion: "love",
    explanation: "表达喜欢、表白、想念、相守或长期承诺。"
  },
  {
    id: "appearance-negative",
    patterns: ["你真丑", "真丑", "丑", "难看", "不好看", "不漂亮", "不美", "不帅", "丑爆", "长得丑", "颜值低", "磕碜", "ugly"],
    keywords: ["外貌", "反讽", "讽刺", "吐槽", "以貌取人", "失之子羽", "相鼠", "无仪", "妍媸"],
    themes: ["外貌", "反讽", "讽刺", "吐槽", "负向外貌"],
    emotion: "critical",
    explanation: "表达对外貌、难看、丑或以貌取人的吐槽，不应匹配成夸好看。"
  }
];
