export type ChengyuRecord = {
  id: string;
  idiom: string;
  pinyin: string;
  meaning: string;
  source?: string;
  tone: "褒义" | "贬义" | "中性";
  modernMeanings: string[];
  scenes: string[];
  synonyms: string[];
  antonyms: string[];
  example: string;
  note?: string;
};

export type ChengyuResult = ChengyuRecord & {
  score: number;
  matchedBy: string[];
  reason: string;
};

export const CHENGYU_RECORDS: ChengyuRecord[] = [
  {
    id: "yang-feng-yin-wei",
    idiom: "阳奉阴违",
    pinyin: "yáng fèng yīn wéi",
    meaning: "表面上遵从，暗地里违背。",
    source: "明·范景文《革大户行召募疏》",
    tone: "贬义",
    modernMeanings: ["表面一套背后一套", "当面答应背后不做", "表面顺从暗地违背", "嘴上答应实际不做"],
    scenes: ["职场", "人际", "批评", "虚伪"],
    synonyms: ["口是心非", "两面三刀", "表里不一"],
    antonyms: ["言行一致", "表里如一"],
    example: "他表面支持方案，实际处处拖延，实在是阳奉阴违。",
    note: "多用于批评他人态度不诚、执行不真。"
  },
  {
    id: "kou-shi-xin-fei",
    idiom: "口是心非",
    pinyin: "kǒu shì xīn fēi",
    meaning: "嘴上说的是一套，心里想的是另一套。",
    tone: "贬义",
    modernMeanings: ["嘴上一套心里一套", "说的和想的不一样", "表面答应心里反对", "说话不真诚"],
    scenes: ["人际", "虚伪", "批评"],
    synonyms: ["阳奉阴违", "言不由衷"],
    antonyms: ["心口如一", "言行一致"],
    example: "你若真的不同意，就直接说，别口是心非。"
  },
  {
    id: "liang-mian-san-dao",
    idiom: "两面三刀",
    pinyin: "liǎng miàn sān dāo",
    meaning: "比喻居心不良，当面一套，背后一套。",
    tone: "贬义",
    modernMeanings: ["当面一套背后一套", "背后捅刀", "表面友好背后使坏", "人很阴险"],
    scenes: ["人际", "职场", "批评", "虚伪"],
    synonyms: ["阳奉阴违", "口是心非"],
    antonyms: ["光明磊落", "表里如一"],
    example: "这种两面三刀的人，很难让人信任。"
  },
  {
    id: "zi-xiang-mao-dun",
    idiom: "自相矛盾",
    pinyin: "zì xiāng máo dùn",
    meaning: "自己的言行或说法前后互相抵触。",
    source: "《韩非子·难一》",
    tone: "中性",
    modernMeanings: ["说话前后矛盾", "自己打自己脸", "前后说法不一致", "逻辑冲突"],
    scenes: ["辩论", "写作", "逻辑", "批评"],
    synonyms: ["前后不一", "相互抵触"],
    antonyms: ["言之成理", "前后一致"],
    example: "这段论证前后自相矛盾，需要重新梳理。"
  },
  {
    id: "yan-xing-bu-yi",
    idiom: "言行不一",
    pinyin: "yán xíng bù yī",
    meaning: "说的和做的不一致。",
    tone: "贬义",
    modernMeanings: ["说一套做一套", "嘴上说得好听实际不做", "说的和做的不一样", "前后不一致"],
    scenes: ["职场", "人际", "批评"],
    synonyms: ["口是心非", "表里不一"],
    antonyms: ["言行一致", "表里如一"],
    example: "管理者如果言行不一，很难让团队信服。"
  },
  {
    id: "zhuang-qiang-zuo-shi",
    idiom: "装腔作势",
    pinyin: "zhuāng qiāng zuò shì",
    meaning: "故意装出某种腔调或姿态，以引人注意或吓唬人。",
    tone: "贬义",
    modernMeanings: ["很会装", "装得很厉害", "故意摆姿态", "装模作样", "太能装了"],
    scenes: ["吐槽", "批评", "人际"],
    synonyms: ["装模作样", "故弄玄虚"],
    antonyms: ["朴实无华", "落落大方"],
    example: "他说话总是装腔作势，反而显得不自然。"
  },
  {
    id: "dao-mao-an-ran",
    idiom: "道貌岸然",
    pinyin: "dào mào àn rán",
    meaning: "形容神态庄重严肃，常用来讽刺表面正经、内心虚伪。",
    tone: "贬义",
    modernMeanings: ["装正经", "表面很正派其实虚伪", "假装道德很高", "一本正经地装"],
    scenes: ["讽刺", "批评", "人设"],
    synonyms: ["一本正经", "装腔作势"],
    antonyms: ["真诚坦荡", "光明磊落"],
    example: "他道貌岸然地批评别人，自己却做得更过分。",
    note: "常带讽刺意味，不适合用来单纯夸人庄重。"
  },
  {
    id: "gu-nong-xuan-xu",
    idiom: "故弄玄虚",
    pinyin: "gù nòng xuán xū",
    meaning: "故意把事情说得神秘难懂，让人摸不着头脑。",
    tone: "贬义",
    modernMeanings: ["故意装神秘", "把简单事情说复杂", "卖关子", "故意让人看不懂"],
    scenes: ["吐槽", "表达", "职场", "写作"],
    synonyms: ["装腔作势", "故作高深"],
    antonyms: ["开诚布公", "直截了当"],
    example: "这个方案本来很简单，没必要故弄玄虚。"
  },
  {
    id: "zhi-yi-xing-nan",
    idiom: "知易行难",
    pinyin: "zhī yì xíng nán",
    meaning: "知道道理容易，真正做起来困难。",
    tone: "中性",
    modernMeanings: ["说起来容易做起来难", "看起来简单其实很难", "懂道理但做不到", "知道容易行动难"],
    scenes: ["学习", "成长", "职场", "自律"],
    synonyms: ["说易行难", "纸上谈兵"],
    antonyms: ["知行合一"],
    example: "减肥这件事知易行难，关键在长期坚持。"
  },
  {
    id: "ji-zhuan-zhi-xia",
    idiom: "急转直下",
    pinyin: "jí zhuǎn zhí xià",
    meaning: "形势突然迅速变坏。",
    tone: "中性",
    modernMeanings: ["事情突然变坏", "局势突然崩了", "情况一下子变差", "突然急剧下降"],
    scenes: ["局势", "工作", "比赛", "市场"],
    synonyms: ["一落千丈", "每况愈下"],
    antonyms: ["柳暗花明", "峰回路转"],
    example: "项目原本推进顺利，没想到客户变卦后形势急转直下。"
  },
  {
    id: "liu-an-hua-ming",
    idiom: "柳暗花明",
    pinyin: "liǔ àn huā míng",
    meaning: "比喻在困境中出现新的转机或希望。",
    source: "宋·陆游《游山西村》",
    tone: "褒义",
    modernMeanings: ["突然有转机", "事情突然变好", "绝望中看到希望", "山重水复之后有出路"],
    scenes: ["困境", "希望", "转机", "鼓励"],
    synonyms: ["峰回路转", "否极泰来"],
    antonyms: ["急转直下", "山穷水尽"],
    example: "本以为没机会了，没想到最后柳暗花明。"
  },
  {
    id: "feng-hui-lu-zhuan",
    idiom: "峰回路转",
    pinyin: "fēng huí lù zhuǎn",
    meaning: "形容事情出现新的变化和转机。",
    tone: "中性",
    modernMeanings: ["事情出现转机", "剧情反转", "突然有希望", "局面变好了"],
    scenes: ["转机", "剧情", "工作", "希望"],
    synonyms: ["柳暗花明", "否极泰来"],
    antonyms: ["急转直下", "走投无路"],
    example: "谈判一度陷入僵局，后来峰回路转，双方终于达成一致。"
  },
  {
    id: "qi-ren-you-tian",
    idiom: "杞人忧天",
    pinyin: "qǐ rén yōu tiān",
    meaning: "比喻不必要或缺乏根据的忧虑。",
    source: "《列子·天瑞》",
    tone: "贬义",
    modernMeanings: ["想太多", "担心没必要的事", "过度焦虑", "没事瞎担心"],
    scenes: ["焦虑", "劝慰", "吐槽"],
    synonyms: ["庸人自扰", "多虑"],
    antonyms: ["高枕无忧", "泰然处之"],
    example: "这件事还没有发生，你现在担心得睡不着，有点杞人忧天。"
  },
  {
    id: "yong-ren-zi-rao",
    idiom: "庸人自扰",
    pinyin: "yōng rén zì rǎo",
    meaning: "本来没有问题，却自己找麻烦、徒增烦恼。",
    tone: "贬义",
    modernMeanings: ["自己吓自己", "没事找事", "想太多给自己添堵", "自己给自己制造焦虑"],
    scenes: ["焦虑", "劝慰", "自我调节"],
    synonyms: ["杞人忧天", "自寻烦恼"],
    antonyms: ["泰然处之", "从容不迫"],
    example: "事情还没到那一步，别庸人自扰。"
  },
  {
    id: "wu-ke-nai-he",
    idiom: "无可奈何",
    pinyin: "wú kě nài hé",
    meaning: "没有办法，只能这样。",
    tone: "中性",
    modernMeanings: ["没有办法", "没办法了", "只能接受", "很无奈"],
    scenes: ["无奈", "生活", "工作", "情绪"],
    synonyms: ["无能为力", "迫不得已"],
    antonyms: ["得心应手", "游刃有余"],
    example: "计划赶不上变化，我们也只能无可奈何地调整安排。"
  },
  {
    id: "wu-neng-wei-li",
    idiom: "无能为力",
    pinyin: "wú néng wéi lì",
    meaning: "用不上力量，帮不上忙或没有能力解决。",
    tone: "中性",
    modernMeanings: ["帮不上忙", "做不了什么", "没有能力解决", "有心无力"],
    scenes: ["无奈", "困难", "帮助"],
    synonyms: ["无可奈何", "力不从心"],
    antonyms: ["力所能及", "得心应手"],
    example: "面对突发状况，他虽然着急，却也无能为力。"
  },
  {
    id: "li-bu-cong-xin",
    idiom: "力不从心",
    pinyin: "lì bù cóng xīn",
    meaning: "心里想做，但力量或能力不够。",
    tone: "中性",
    modernMeanings: ["有心无力", "想做但做不到", "精力不够", "能力跟不上"],
    scenes: ["工作", "疲惫", "能力", "无奈"],
    synonyms: ["无能为力", "心有余而力不足"],
    antonyms: ["得心应手", "游刃有余"],
    example: "事情太多，他渐渐感到力不从心。"
  },
  {
    id: "xin-zhao-bu-xuan",
    idiom: "心照不宣",
    pinyin: "xīn zhào bù xuān",
    meaning: "彼此心里明白，不用明说。",
    tone: "中性",
    modernMeanings: ["不用说都懂", "彼此都明白", "心里明白不说破", "默契"],
    scenes: ["默契", "朋友", "人际", "关系"],
    synonyms: ["心领神会", "心心相印"],
    antonyms: ["一无所知", "毫不知情"],
    example: "这件事大家心照不宣，没人再追问。"
  },
  {
    id: "xin-ling-shen-hui",
    idiom: "心领神会",
    pinyin: "xīn lǐng shén huì",
    meaning: "不用明说，就能领会对方的意思。",
    tone: "中性",
    modernMeanings: ["一听就懂", "秒懂", "不用解释就明白", "很有默契"],
    scenes: ["沟通", "默契", "朋友", "协作"],
    synonyms: ["心照不宣", "心领意会"],
    antonyms: ["茫然不解", "一头雾水"],
    example: "他一个眼神，队友就心领神会地调整了位置。"
  },
  {
    id: "bu-mou-er-he",
    idiom: "不谋而合",
    pinyin: "bù móu ér hé",
    meaning: "事先没有商量，意见或行动却完全一致。",
    tone: "中性",
    modernMeanings: ["想法一样", "没商量但一致", "我们想到一块去了", "同频"],
    scenes: ["合作", "朋友", "默契", "观点"],
    synonyms: ["殊途同归", "异口同声"],
    antonyms: ["众说纷纭", "各执一词"],
    example: "两个人的方案不谋而合，说明方向是对的。"
  },
  {
    id: "yi-kou-tong-sheng",
    idiom: "异口同声",
    pinyin: "yì kǒu tóng shēng",
    meaning: "不同的人说出同样的话，表示意见一致。",
    tone: "中性",
    modernMeanings: ["大家都这么说", "所有人意见一致", "一起说同一句话", "统一口径"],
    scenes: ["群体", "意见", "会议"],
    synonyms: ["不约而同", "众口一词"],
    antonyms: ["众说纷纭", "各执一词"],
    example: "大家异口同声地推荐他负责这个项目。"
  },
  {
    id: "cu-bu-ji-fang",
    idiom: "猝不及防",
    pinyin: "cù bù jí fáng",
    meaning: "事情来得突然，来不及防备。",
    tone: "中性",
    modernMeanings: ["来得太突然", "突然被打了个措手不及", "没反应过来", "突然发生"],
    scenes: ["突发", "意外", "生活", "工作"],
    synonyms: ["措手不及", "突如其来"],
    antonyms: ["早有准备", "有备无患"],
    example: "这次调整来得太突然，大家都有些猝不及防。"
  },
  {
    id: "ku-xiao-bu-de",
    idiom: "哭笑不得",
    pinyin: "kū xiào bù dé",
    meaning: "哭也不是，笑也不是，形容处境尴尬或令人无奈。",
    tone: "中性",
    modernMeanings: ["很尴尬", "又好笑又无奈", "不知道该哭还是该笑", "让人无语"],
    scenes: ["尴尬", "无奈", "吐槽", "生活"],
    synonyms: ["啼笑皆非", "左右为难"],
    antonyms: ["泰然自若", "从容不迫"],
    example: "他把文件发错群了，大家看得哭笑不得。"
  },
  {
    id: "ti-xiao-jie-fei",
    idiom: "啼笑皆非",
    pinyin: "tí xiào jiē fēi",
    meaning: "哭也不是，笑也不是，形容处境尴尬可笑。",
    tone: "中性",
    modernMeanings: ["又尴尬又好笑", "让人无语", "哭笑不得", "很荒唐"],
    scenes: ["尴尬", "荒唐", "吐槽"],
    synonyms: ["哭笑不得", "令人无语"],
    antonyms: ["泰然处之"],
    example: "这个乌龙结果让人啼笑皆非。"
  },
  {
    id: "xi-chu-wang-wai",
    idiom: "喜出望外",
    pinyin: "xǐ chū wàng wài",
    meaning: "遇到出乎意料的喜事而特别高兴。",
    tone: "褒义",
    modernMeanings: ["开心到飞起", "特别惊喜", "没想到这么好", "意外地开心"],
    scenes: ["惊喜", "开心", "好消息"],
    synonyms: ["心花怒放", "欣喜若狂"],
    antonyms: ["大失所望", "心灰意冷"],
    example: "收到录取通知时，他喜出望外。"
  },
  {
    id: "xin-hua-nu-fang",
    idiom: "心花怒放",
    pinyin: "xīn huā nù fàng",
    meaning: "心里高兴得像花儿盛开一样。",
    tone: "褒义",
    modernMeanings: ["开心到飞起", "非常开心", "高兴坏了", "心情特别好"],
    scenes: ["开心", "表扬", "好消息"],
    synonyms: ["喜出望外", "欣喜若狂"],
    antonyms: ["愁眉苦脸", "心灰意冷"],
    example: "听到这个好消息，她心花怒放。"
  },
  {
    id: "chu-lei-ba-cui",
    idiom: "出类拔萃",
    pinyin: "chū lèi bá cuì",
    meaning: "超出同类之上，形容人或事物很优秀。",
    tone: "褒义",
    modernMeanings: ["很厉害", "特别优秀", "能力很强", "在人群里很突出"],
    scenes: ["夸人", "能力", "成绩", "职场"],
    synonyms: ["鹤立鸡群", "卓尔不群"],
    antonyms: ["平平无奇", "碌碌无为"],
    example: "他在同龄人中出类拔萃，很早就独当一面。"
  },
  {
    id: "he-li-ji-qun",
    idiom: "鹤立鸡群",
    pinyin: "hè lì jī qún",
    meaning: "比喻一个人的才能或仪表在一群人中很突出。",
    tone: "褒义",
    modernMeanings: ["在人群中特别突出", "很显眼", "明显比别人强", "气质出众"],
    scenes: ["夸人", "外貌", "能力", "气质"],
    synonyms: ["出类拔萃", "卓尔不群"],
    antonyms: ["泯然众人", "平平无奇"],
    example: "他站在人群中鹤立鸡群，很难不被注意。"
  },
  {
    id: "deng-feng-zao-ji",
    idiom: "登峰造极",
    pinyin: "dēng fēng zào jí",
    meaning: "比喻学问、技能等达到最高境界。",
    tone: "褒义",
    modernMeanings: ["厉害到极致", "水平非常高", "技术顶级", "做到极致"],
    scenes: ["技术", "艺术", "夸赞", "能力"],
    synonyms: ["炉火纯青", "出神入化"],
    antonyms: ["初出茅庐", "半途而废"],
    example: "他的书法已经到了登峰造极的境界。"
  },
  {
    id: "shou-zhu-dai-tu",
    idiom: "守株待兔",
    pinyin: "shǒu zhū dài tù",
    meaning: "比喻不主动努力，只想侥幸得到成功。",
    source: "《韩非子·五蠹》",
    tone: "贬义",
    modernMeanings: ["不努力只等结果", "天天等好运", "想靠运气成功", "不主动行动"],
    scenes: ["学习", "工作", "批评", "行动"],
    synonyms: ["坐享其成", "不劳而获"],
    antonyms: ["脚踏实地", "主动出击"],
    example: "想做成产品不能守株待兔，要主动找用户反馈。"
  },
  {
    id: "zuo-xiang-qi-cheng",
    idiom: "坐享其成",
    pinyin: "zuò xiǎng qí chéng",
    meaning: "自己不出力，却享受别人努力的成果。",
    tone: "贬义",
    modernMeanings: ["自己不干活还想拿成果", "等着别人干完自己享受", "不劳而获", "躺着拿结果"],
    scenes: ["职场", "合作", "批评"],
    synonyms: ["不劳而获", "守株待兔"],
    antonyms: ["自力更生", "亲力亲为"],
    example: "团队合作不能有人只想坐享其成。"
  },
  {
    id: "yi-mao-qu-ren",
    idiom: "以貌取人",
    pinyin: "yǐ mào qǔ rén",
    meaning: "只根据外貌判断一个人。",
    source: "《史记·仲尼弟子列传》",
    tone: "贬义",
    modernMeanings: ["只看脸", "看外表判断人", "只看颜值", "外貌歧视"],
    scenes: ["外貌", "评价", "偏见", "批评"],
    synonyms: ["以偏概全", "先入为主"],
    antonyms: ["知人善任", "慧眼识人"],
    example: "评价一个人不能以貌取人，更要看他的能力和品格。"
  },
  {
    id: "yi-pian-gai-quan",
    idiom: "以偏概全",
    pinyin: "yǐ piān gài quán",
    meaning: "用片面的情况代表整体。",
    tone: "贬义",
    modernMeanings: ["只看一部分就下结论", "拿个例代表全部", "太片面", "凭一点判断整体"],
    scenes: ["讨论", "逻辑", "批评", "观点"],
    synonyms: ["管中窥豹", "一叶障目"],
    antonyms: ["全面客观", "实事求是"],
    example: "不能因为一次失败就以偏概全，否定整个方向。"
  },
  {
    id: "qian-yi-fa-dong-quan-shen",
    idiom: "牵一发而动全身",
    pinyin: "qiān yī fà ér dòng quán shēn",
    meaning: "比喻小处一动，会影响整体。",
    tone: "中性",
    modernMeanings: ["小变化影响全局", "一点改动影响很大", "事情小但影响大", "动一个地方全局都变"],
    scenes: ["系统", "项目", "管理", "复杂问题"],
    synonyms: ["环环相扣", "息息相关"],
    antonyms: ["互不相干"],
    example: "这个系统牵一发而动全身，不能随便改核心逻辑。"
  },
  {
    id: "jian-feng-shi-duo",
    idiom: "见风使舵",
    pinyin: "jiàn fēng shǐ duò",
    meaning: "看风向转舵，比喻看形势或别人态度改变立场。",
    tone: "贬义",
    modernMeanings: ["看风向说话", "谁强跟谁", "立场变来变去", "很会看形势"],
    scenes: ["职场", "人际", "批评", "立场"],
    synonyms: ["随机应变", "随波逐流"],
    antonyms: ["坚定不移", "刚正不阿"],
    example: "他总是见风使舵，很少表达真正的立场。",
    note: "与“随机应变”不同，这个词常带贬义。"
  },
  {
    id: "ming-zhi-gu-fan",
    idiom: "明知故犯",
    pinyin: "míng zhī gù fàn",
    meaning: "明明知道不对，却故意去做。",
    tone: "贬义",
    modernMeanings: ["明知道不对还做", "故意犯错", "知道违规还要做", "明知不行还做"],
    scenes: ["规则", "批评", "教育", "职场"],
    synonyms: ["知法犯法", "有意为之"],
    antonyms: ["知错就改", "防微杜渐"],
    example: "已经提醒过很多次，他这次属于明知故犯。"
  },
  {
    id: "ren-zhong-dao-yuan",
    idiom: "任重道远",
    pinyin: "rèn zhòng dào yuǎn",
    meaning: "责任重大，道路遥远，比喻任务艰巨，需要长期努力。",
    source: "《论语·泰伯》",
    tone: "中性",
    modernMeanings: ["路还很长", "任务很重", "还要继续努力", "长期主义", "很难但要坚持"],
    scenes: ["创业", "学习", "工作", "坚持"],
    synonyms: ["道阻且长", "负重致远"],
    antonyms: ["轻而易举", "一蹴而就"],
    example: "这个产品刚开始有起色，但要真正做起来仍然任重道远。"
  },
  {
    id: "zi-zi-bu-juan",
    idiom: "孜孜不倦",
    pinyin: "zī zī bù juàn",
    meaning: "勤奋努力，不知疲倦。",
    tone: "褒义",
    modernMeanings: ["一直努力", "很勤奋", "努力但不放弃", "认真坚持"],
    scenes: ["学习", "工作", "成长", "夸赞"],
    synonyms: ["勤勤恳恳", "废寝忘食"],
    antonyms: ["三天打鱼两天晒网", "半途而废"],
    example: "他孜孜不倦地打磨产品，终于看到了增长。"
  },
  {
    id: "fei-qin-wang-shi",
    idiom: "废寝忘食",
    pinyin: "fèi qǐn wàng shí",
    meaning: "顾不得睡觉，忘记吃饭，形容非常专心努力。",
    tone: "褒义",
    modernMeanings: ["拼命努力", "忙到忘记吃饭", "非常投入", "努力到停不下来"],
    scenes: ["学习", "工作", "创业", "专注"],
    synonyms: ["孜孜不倦", "夜以继日"],
    antonyms: ["敷衍了事", "无所事事"],
    example: "为了赶完这个版本，团队几乎废寝忘食。"
  },
  {
    id: "ye-yi-ji-ri",
    idiom: "夜以继日",
    pinyin: "yè yǐ jì rì",
    meaning: "晚上接着白天干，形容加紧工作或学习。",
    tone: "中性",
    modernMeanings: ["日夜不停", "连续加班", "一直忙", "没日没夜地干"],
    scenes: ["工作", "学习", "赶进度", "努力"],
    synonyms: ["废寝忘食", "通宵达旦"],
    antonyms: ["无所事事", "游手好闲"],
    example: "项目上线前，大家夜以继日地排查问题。"
  },
  {
    id: "yi-chou-mo-zhan",
    idiom: "一筹莫展",
    pinyin: "yī chóu mò zhǎn",
    meaning: "一点计策也施展不出，形容没有办法。",
    tone: "中性",
    modernMeanings: ["完全没办法", "不知道怎么办", "束手无策", "毫无头绪"],
    scenes: ["困境", "工作", "问题", "焦虑"],
    synonyms: ["束手无策", "无计可施"],
    antonyms: ["胸有成竹", "得心应手"],
    example: "面对突然出现的故障，他一时一筹莫展。"
  },
  {
    id: "shu-shou-wu-ce",
    idiom: "束手无策",
    pinyin: "shù shǒu wú cè",
    meaning: "像手被捆住一样没有办法。",
    tone: "中性",
    modernMeanings: ["没办法解决", "不知道该怎么办", "完全无计可施", "被难住了"],
    scenes: ["问题", "困境", "工作", "焦虑"],
    synonyms: ["一筹莫展", "无计可施"],
    antonyms: ["得心应手", "胸有成竹"],
    example: "系统突然报错，大家一时间束手无策。"
  },
  {
    id: "xiong-you-cheng-zhu",
    idiom: "胸有成竹",
    pinyin: "xiōng yǒu chéng zhú",
    meaning: "做事之前已经有完整打算或把握。",
    tone: "褒义",
    modernMeanings: ["心里有底", "很有把握", "早有计划", "已经想好了"],
    scenes: ["计划", "考试", "工作", "信心"],
    synonyms: ["成竹在胸", "胜券在握"],
    antonyms: ["一筹莫展", "心中无数"],
    example: "他对这次答辩胸有成竹，发挥得很稳定。"
  },
  {
    id: "sheng-quan-zai-wo",
    idiom: "胜券在握",
    pinyin: "shèng quàn zài wò",
    meaning: "比喻很有把握取得胜利。",
    tone: "褒义",
    modernMeanings: ["稳了", "这把能赢", "很有把握", "拿下没问题"],
    scenes: ["比赛", "考试", "工作", "信心"],
    synonyms: ["胸有成竹", "十拿九稳"],
    antonyms: ["胜负难料", "前途未卜"],
    example: "准备充分之后，他对这场比赛已是胜券在握。"
  },
  {
    id: "shi-na-jiu-wen",
    idiom: "十拿九稳",
    pinyin: "shí ná jiǔ wěn",
    meaning: "比喻很有把握。",
    tone: "中性",
    modernMeanings: ["稳了", "基本没问题", "很有把握", "几乎一定成功"],
    scenes: ["考试", "比赛", "工作", "信心"],
    synonyms: ["胜券在握", "万无一失"],
    antonyms: ["毫无把握", "胜负难料"],
    example: "这次准备这么充分，拿下应该十拿九稳。"
  },
  {
    id: "yi-wu-suo-huo",
    idiom: "一无所获",
    pinyin: "yī wú suǒ huò",
    meaning: "什么收获也没有。",
    tone: "中性",
    modernMeanings: ["啥也没得到", "白忙活", "没有收获", "忙了一场没结果"],
    scenes: ["失望", "工作", "学习", "总结"],
    synonyms: ["徒劳无功", "竹篮打水"],
    antonyms: ["满载而归", "收获颇丰"],
    example: "忙了一整天，最后却一无所获。"
  },
  {
    id: "tu-lao-wu-gong",
    idiom: "徒劳无功",
    pinyin: "tú láo wú gōng",
    meaning: "白白付出劳动，没有成效。",
    tone: "中性",
    modernMeanings: ["白忙活", "努力没结果", "做了也没用", "没有效果"],
    scenes: ["工作", "失望", "努力", "结果"],
    synonyms: ["一无所获", "劳而无功"],
    antonyms: ["事半功倍", "卓有成效"],
    example: "方向错了，再努力也可能徒劳无功。"
  },
  {
    id: "shi-ban-gong-bei",
    idiom: "事半功倍",
    pinyin: "shì bàn gōng bèi",
    meaning: "花较少的力气，取得较大的成效。",
    tone: "褒义",
    modernMeanings: ["效率很高", "花小力气有大效果", "效果很好", "投入少回报高"],
    scenes: ["学习", "工作", "方法", "效率"],
    synonyms: ["一举两得", "卓有成效"],
    antonyms: ["事倍功半", "徒劳无功"],
    example: "找到正确方法后，学习效率明显事半功倍。"
  },
  {
    id: "shi-bei-gong-ban",
    idiom: "事倍功半",
    pinyin: "shì bèi gōng bàn",
    meaning: "费力大，收效小。",
    tone: "贬义",
    modernMeanings: ["效率很低", "很费劲但效果差", "投入多回报少", "越干越累还没效果"],
    scenes: ["工作", "学习", "方法", "效率"],
    synonyms: ["费力不讨好", "劳而少功"],
    antonyms: ["事半功倍", "卓有成效"],
    example: "方法不对，再努力也容易事倍功半。"
  }
];

const STOP_WORDS = new Set(["我", "你", "他", "她", "它", "的", "了", "啊", "呀", "吧", "吗", "呢", "很", "太", "真", "真的", "有点", "一个", "这个", "那个"]);
const LOW_SIGNAL_CHARS = new Set(["好", "说", "想", "人", "事", "不", "有", "没", "真", "太", "这", "那", "很", "更", "多", "少"]);

function normalize(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, "");
}

function tokenize(input: string) {
  const compact = normalize(input);
  const terms = new Set<string>();
  input.split(/[\s,，。！？!?.、/\\]+/).map((item) => item.trim()).filter(Boolean).forEach((item) => {
    if (!STOP_WORDS.has(item)) terms.add(item);
  });

  if (/^[\u4e00-\u9fa5]+$/.test(compact) && compact.length <= 24) {
    for (let size = 2; size <= 5; size += 1) {
      for (let i = 0; i <= compact.length - size; i += 1) {
        const phrase = compact.slice(i, i + size);
        if (Array.from(phrase).every((char) => STOP_WORDS.has(char) || LOW_SIGNAL_CHARS.has(char))) continue;
        terms.add(phrase);
      }
    }
  }

  return Array.from(terms).slice(0, 48);
}

function recordBlob(record: ChengyuRecord) {
  return normalize([
    record.id,
    record.idiom,
    record.pinyin,
    record.meaning,
    record.source ?? "",
    record.tone,
    record.modernMeanings.join(" "),
    record.scenes.join(" "),
    record.synonyms.join(" "),
    record.antonyms.join(" "),
    record.example,
    record.note ?? ""
  ].join(" "));
}

function scoreRecord(record: ChengyuRecord, query: string): ChengyuResult {
  const normalizedQuery = normalize(query);
  const terms = tokenize(query);
  const blob = recordBlob(record);
  const matchedBy = new Set<string>();
  let score = 0;

  if (normalizedQuery && normalize(record.idiom) === normalizedQuery) {
    score += 100;
    matchedBy.add("idiom-exact");
  }

  if (normalizedQuery && record.modernMeanings.some((meaning) => normalize(meaning).includes(normalizedQuery) || normalizedQuery.includes(normalize(meaning)))) {
    score += 72;
    matchedBy.add("modern-exact");
  }

  for (const term of terms) {
    const normalizedTerm = normalize(term);
    if (!normalizedTerm) continue;
    if (record.modernMeanings.some((meaning) => normalize(meaning).includes(normalizedTerm))) {
      score += 18;
      matchedBy.add("modern-term");
    }
    if (record.scenes.some((scene) => normalize(scene).includes(normalizedTerm))) {
      score += 10;
      matchedBy.add("scene");
    }
    if (record.meaning && normalize(record.meaning).includes(normalizedTerm)) {
      score += 10;
      matchedBy.add("meaning");
    }
    if (record.synonyms.some((item) => normalize(item).includes(normalizedTerm)) || record.antonyms.some((item) => normalize(item).includes(normalizedTerm))) {
      score += 8;
      matchedBy.add("related");
    }
    if (blob.includes(normalizedTerm)) {
      score += normalizedTerm.length >= 2 ? 4 : 0;
      matchedBy.add("keyword");
    }
  }

  const hasStrongSignal = ["idiom-exact", "modern-exact", "modern-term", "scene", "meaning"].some((type) => matchedBy.has(type));
  if (!hasStrongSignal) score = Math.min(score, 20);

  const reason = matchedBy.has("idiom-exact")
    ? `你输入的是成语“${record.idiom}”，它的意思是：${record.meaning}`
    : `“${record.idiom}”可以表达“${record.modernMeanings.slice(0, 2).join(" / ")}”这类意思，语气为${record.tone}。`;

  return { ...record, score: Number(score.toFixed(2)), matchedBy: Array.from(matchedBy), reason };
}

export function searchChengyu(query: string, limit = 8): ChengyuResult[] {
  const value = query.trim();
  if (!value) return [];
  return CHENGYU_RECORDS
    .map((record) => scoreRecord(record, value))
    .filter((result) => result.score >= 28)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

export function chengyuToSlug(query: string) {
  return encodeURIComponent(
    query.trim().toLowerCase()
      .replace(/[，。！？!?.,、/\\]+/g, " ")
      .replace(/\s+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 80)
  );
}

export function slugToChengyuQuery(slug: string) {
  try {
    return decodeURIComponent(slug).replace(/-/g, " ").trim();
  } catch {
    return slug.replace(/-/g, " ").trim();
  }
}

export function chengyuHref(query: string) {
  return `/chengyu/q/${chengyuToSlug(query)}`;
}
