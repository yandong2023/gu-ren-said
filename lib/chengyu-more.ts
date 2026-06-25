import type { ChengyuRecord } from "./chengyu";

type MoreGroup = {
  key: string;
  meaning: string;
  tone: "褒义" | "贬义" | "中性";
  scenes: string[];
  modernMeanings: string[];
  idioms: string[];
  antonyms?: string[];
};

function list(value: string) {
  return value.split("、").map((item) => item.trim()).filter(Boolean);
}

const GROUPS: MoreGroup[] = [
  { key: "food-health", meaning: "饮食、健康、养生和身体状态", tone: "中性", scenes: ["饮食", "健康", "生活", "养生"], modernMeanings: ["吃得好身体好", "身体更健康", "养好身体", "注意饮食", "吃饭很重要"], idioms: list("民以食为天、食不厌精、脍不厌细、饱食终日、食指大动、津津有味、大快朵颐、狼吞虎咽、细嚼慢咽、病从口入、药食同源、强身健体、身强力壮、精神饱满、龙精虎猛"), antonyms: ["弱不禁风", "病入膏肓"] },
  { key: "office-pressure", meaning: "上班累、压力大、职场消耗", tone: "中性", scenes: ["职场", "压力", "加班", "吐槽"], modernMeanings: ["上班太累", "压力很大", "天天加班", "被工作压垮", "职场很累"], idioms: list("疲于奔命、焦头烂额、心力交瘁、身心俱疲、焦头烂额、案牍劳形、积劳成疾、席不暇暖、日理万机、分身乏术、马不停蹄、夜以继日、夙兴夜寐、殚精竭虑、劳心劳力"), antonyms: ["游刃有余", "从容不迫"] },
  { key: "money", meaning: "赚钱、花钱、收益和成本", tone: "中性", scenes: ["钱", "消费", "生意", "财务"], modernMeanings: ["赚钱不容易", "成本太高", "很划算", "收益很好", "花钱太多"], idioms: list("开源节流、日进斗金、财源广进、一本万利、薄利多销、入不敷出、捉襟见肘、囊中羞涩、精打细算、挥金如土、一掷千金、物有所值、得不偿失、积少成多、细水长流"), antonyms: ["挥霍无度", "坐吃山空"] },
  { key: "children-education", meaning: "教育孩子、学习成长和启发", tone: "褒义", scenes: ["教育", "孩子", "学习", "家庭"], modernMeanings: ["教育孩子", "孩子要努力", "培养习惯", "学习进步", "慢慢成长"], idioms: list("循循善诱、因材施教、寓教于乐、言传身教、诲人不倦、耳濡目染、潜移默化、教学相长、春风化雨、孟母三迁、青出于蓝、孺子可教、玉不琢不成器、循序渐进、勤能补拙"), antonyms: ["揠苗助长", "放任自流"] },
  { key: "relationship-break", meaning: "关系破裂、分开、失去联系", tone: "中性", scenes: ["关系", "朋友", "爱情", "离别"], modernMeanings: ["关系淡了", "分开了", "不联系了", "感情破裂", "各走各的路"], idioms: list("分道扬镳、形同陌路、劳燕分飞、恩断义绝、一刀两断、渐行渐远、各奔东西、天各一方、貌合神离、同床异梦、割席断交、不欢而散、曲终人散、物是人非、旧情难续"), antonyms: ["情同手足", "白头偕老"] },
  { key: "relationship-good", meaning: "关系亲近、感情很好、彼此支持", tone: "褒义", scenes: ["关系", "朋友", "爱情", "家庭"], modernMeanings: ["关系很好", "感情很深", "彼此支持", "很亲近", "相处舒服"], idioms: list("情同手足、亲密无间、相亲相爱、形影不离、如胶似漆、心心相印、相濡以沫、同甘共苦、患难与共、肝胆相照、莫逆之交、情深义重、亲如一家、琴瑟和鸣、举案齐眉"), antonyms: ["形同陌路", "貌合神离"] },
  { key: "internet-slang", meaning: "网络热梗、吐槽和夸张表达", tone: "中性", scenes: ["网络", "吐槽", "热梗", "表达"], modernMeanings: ["我真的会谢", "破防了", "这事离谱", "太上头了", "绷不住了"], idioms: list("啼笑皆非、哭笑不得、匪夷所思、不可思议、荒诞不经、离奇古怪、拍案惊奇、叹为观止、目瞪口呆、瞠目结舌、百感交集、心潮澎湃、欲言又止、无言以对、难以置信"), antonyms: ["不足为奇", "司空见惯"] },
  { key: "marketing", meaning: "宣传推广、吸引注意和出圈", tone: "中性", scenes: ["营销", "传播", "产品", "内容"], modernMeanings: ["宣传很猛", "推广出圈", "吸引眼球", "卖点很强", "流量很大"], idioms: list("广而告之、家喻户晓、名声大噪、声名鹊起、众口相传、口口相传、妇孺皆知、如雷贯耳、炙手可热、风靡一时、万人空巷、引人注目、夺人眼球、独树一帜、别开生面"), antonyms: ["无人问津", "默默无闻"] },
  { key: "bad-marketing", meaning: "夸大宣传、包装过度、名不副实", tone: "贬义", scenes: ["营销", "产品", "吐槽", "评价"], modernMeanings: ["营销过度", "虚假宣传", "包装太狠", "吹得太过", "货不对板"], idioms: list("夸大其词、言过其实、名不副实、华而不实、徒有虚名、虚有其表、挂羊头卖狗肉、鱼目混珠、以次充好、弄虚作假、哗众取宠、欺世盗名、招摇撞骗、金玉其外败絮其中"), antonyms: ["货真价实", "名副其实"] },
  { key: "decision", meaning: "做决定、犹豫、选择困难", tone: "中性", scenes: ["决策", "选择", "工作", "生活"], modernMeanings: ["不知道怎么选", "很纠结", "犹豫不决", "选择困难", "下不了决心"], idioms: list("犹豫不决、举棋不定、左右为难、进退两难、瞻前顾后、优柔寡断、首鼠两端、踌躇不前、难以取舍、当断不断、迟疑不决、摇摆不定、骑虎难下、权衡利弊"), antonyms: ["当机立断", "斩钉截铁"] },
  { key: "execute", meaning: "执行力强、说干就干", tone: "褒义", scenes: ["行动", "执行", "创业", "工作"], modernMeanings: ["说干就干", "执行力强", "立刻行动", "不拖延", "马上落实"], idioms: list("雷厉风行、当机立断、说干就干、立说立行、身体力行、事必躬亲、亲力亲为、马上行动、一鼓作气、趁热打铁、奋起直追、披荆斩棘、勇往直前、令行禁止"), antonyms: ["拖泥带水", "优柔寡断"] },
  { key: "delay", meaning: "拖延、不行动、迟迟不做", tone: "贬义", scenes: ["拖延", "工作", "学习", "批评"], modernMeanings: ["一直拖", "不行动", "迟迟不做", "拖延症", "磨蹭"], idioms: list("拖泥带水、迟迟不决、按兵不动、裹足不前、磨磨蹭蹭、犹豫不决、踌躇不前、迁延不决、拖拖拉拉、坐失良机、缓不济急、迟疑观望、贻误时机"), antonyms: ["雷厉风行", "当机立断"] },
  { key: "quality", meaning: "质量好、品质高、值得信赖", tone: "褒义", scenes: ["产品", "服务", "作品", "评价"], modernMeanings: ["质量很好", "品质高", "很靠谱", "值得买", "做得很扎实"], idioms: list("精益求精、货真价实、名副其实、真材实料、匠心独运、精雕细琢、实至名归、童叟无欺、有口皆碑、经久耐用、物有所值、精美绝伦、品质卓越、可圈可点"), antonyms: ["粗制滥造", "偷工减料"] },
  { key: "bad-quality", meaning: "质量差、粗糙、不靠谱", tone: "贬义", scenes: ["产品", "服务", "吐槽", "评价"], modernMeanings: ["质量很差", "很粗糙", "不靠谱", "偷工减料", "做得很烂"], idioms: list("粗制滥造、偷工减料、滥竽充数、华而不实、徒有虚名、漏洞百出、千疮百孔、不堪入目、劣迹斑斑、破绽百出、名不副实、粗枝大叶、敷衍了事"), antonyms: ["精益求精", "货真价实"] },
  { key: "beauty-scene", meaning: "景色好看、风景优美", tone: "褒义", scenes: ["风景", "旅行", "审美", "写作"], modernMeanings: ["风景很好看", "景色太美了", "适合拍照", "美得不像话", "环境很好"], idioms: list("山清水秀、风景如画、鸟语花香、湖光山色、如诗如画、美不胜收、赏心悦目、春暖花开、绿水青山、花团锦簇、层峦叠嶂、云蒸霞蔚、碧空如洗、风和日丽"), antonyms: ["荒凉破败", "满目疮痍"] },
  { key: "bad-scene", meaning: "环境差、景象破败或混乱", tone: "中性", scenes: ["环境", "城市", "旅行", "吐槽"], modernMeanings: ["环境很差", "景象很乱", "到处破败", "看着很糟", "一片狼藉"], idioms: list("满目疮痍、一片狼藉、荒无人烟、断壁残垣、破败不堪、乌烟瘴气、杂乱无章、尘土飞扬、鸡犬不宁、寸草不生、荒凉萧瑟、乱七八糟"), antonyms: ["山清水秀", "鸟语花香"] },
  { key: "weather", meaning: "天气、环境和气候变化", tone: "中性", scenes: ["天气", "生活", "出行", "写作"], modernMeanings: ["天气很好", "天气很差", "风很大", "下雨了", "天很热"], idioms: list("风和日丽、晴空万里、碧空如洗、春暖花开、秋高气爽、风雨交加、狂风暴雨、电闪雷鸣、瓢泼大雨、烈日炎炎、寒风刺骨、冰天雪地、云开雾散、阴云密布"), antonyms: ["风和日丽", "狂风暴雨"] },
  { key: "travel", meaning: "出远门、旅行、路途和见识", tone: "中性", scenes: ["旅行", "出行", "见识", "生活"], modernMeanings: ["想出去玩", "旅行见世面", "路途遥远", "到处看看", "出门在外"], idioms: list("走南闯北、跋山涉水、风尘仆仆、舟车劳顿、千里迢迢、远走高飞、见多识广、开阔眼界、游山玩水、四海为家、背井离乡、翻山越岭、长途跋涉"), antonyms: ["足不出户", "闭门不出"] },
  { key: "home-life", meaning: "日常生活、柴米油盐、平淡安稳", tone: "中性", scenes: ["生活", "家庭", "日常", "情绪"], modernMeanings: ["普通日子", "柴米油盐", "平淡生活", "踏实过日子", "生活安稳"], idioms: list("柴米油盐、安居乐业、平平淡淡、粗茶淡饭、其乐融融、家长里短、衣食住行、细水长流、岁月静好、怡然自得、自给自足、安身立命、丰衣足食"), antonyms: ["颠沛流离", "居无定所"] },
  { key: "family", meaning: "家庭亲情、父母子女和亲人关系", tone: "褒义", scenes: ["家庭", "亲情", "父母", "孩子"], modernMeanings: ["家人很好", "亲情很深", "父母不容易", "一家人团聚", "家庭温暖"], idioms: list("骨肉相连、血浓于水、舐犊情深、寸草春晖、天伦之乐、其乐融融、承欢膝下、阖家欢乐、父慈子孝、兄友弟恭、相亲相爱、母慈子孝、骨肉团圆"), antonyms: ["骨肉分离", "六亲不认"] },
  { key: "exam", meaning: "考试、备考、成绩和发挥", tone: "中性", scenes: ["考试", "学习", "学生", "信心"], modernMeanings: ["考试稳了", "准备考试", "成绩很好", "发挥失常", "临时抱佛脚"], idioms: list("胸有成竹、十拿九稳、金榜题名、名列前茅、独占鳌头、临阵磨枪、厚积薄发、一举成名、旗开得胜、功夫不负有心人、马到成功、蟾宫折桂、学有所成"), antonyms: ["名落孙山", "一败涂地"] },
  { key: "exam-fail", meaning: "考试失败、成绩不理想", tone: "中性", scenes: ["考试", "学习", "失落", "反思"], modernMeanings: ["考试没考好", "发挥失常", "成绩很差", "失败了", "名落孙山"], idioms: list("名落孙山、一败涂地、铩羽而归、功亏一篑、失之交臂、差之毫厘谬以千里、马失前蹄、大失所望、前功尽弃、悔不当初、痛定思痛、再接再厉"), antonyms: ["金榜题名", "独占鳌头"] }
];

function makeId(groupKey: string, idiom: string, index: number) {
  const code = Array.from(idiom).map((char) => char.codePointAt(0)?.toString(16)).join("-");
  return `more-${groupKey}-${index + 1}-${code}`;
}

export const MORE_CHENGYU_RECORDS: ChengyuRecord[] = GROUPS.flatMap((group) => group.idioms.map((idiom, index) => ({
  id: makeId(group.key, idiom, index),
  idiom,
  pinyin: "",
  meaning: `常用来表示${group.meaning}。`,
  tone: group.tone,
  modernMeanings: Array.from(new Set([...group.modernMeanings, group.meaning])),
  scenes: group.scenes,
  synonyms: group.idioms.filter((item) => item !== idiom).slice(0, 6),
  antonyms: group.antonyms ?? [],
  example: `这个意思可以用“${idiom}”来表达。`,
  note: "扩展词库条目；适合先判断语气和场景，再结合上下文使用。"
})));

export const MORE_CHENGYU_RECORD_COUNT = MORE_CHENGYU_RECORDS.length;
