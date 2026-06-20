import type { SearchResult } from "./types";

export type SharePersona = {
  name: string;
  slogan: string;
  tag: string;
};

function hasTheme(result: SearchResult, themes: string[]) {
  return result.themes.some((theme) => themes.includes(theme));
}

export function getSharePersona(result: SearchResult): SharePersona {
  if (result.emotion === "love" || hasTheme(result, ["爱情", "告白", "相思", "相守", "暗恋", "深情"])) {
    if (hasTheme(result, ["相守", "承诺"])) return { name: "白头吟型深情人", slogan: "不是恋爱脑，是古典长期主义。", tag: "深情" };
    if (hasTheme(result, ["暗恋", "心动"])) return { name: "越人歌型暗恋人", slogan: "嘴上没说，古人已经替你说穿了。", tag: "暗恋" };
    if (hasTheme(result, ["相思", "深情"])) return { name: "红豆型想念人", slogan: "不是想太多，是相思已经入骨。", tag: "相思" };
    return { name: "古典深情人", slogan: "一句我爱你，古人替你说得更重。", tag: "爱情" };
  }

  if (result.emotion === "beauty" || hasTheme(result, ["美貌", "惊艳", "容貌"])) {
    return { name: "诗经式夸夸机", slogan: "你以为你在夸好看，其实古人已经写到封神。", tag: "夸夸" };
  }

  if (result.emotion === "sad" || hasTheme(result, ["忧愁", "失意", "烦闷", "孤独"])) {
    return { name: "李白式 emo 人", slogan: "你的破防，李白早就替你押过韵。", tag: "emo" };
  }

  if (result.emotion === "positive" || hasTheme(result, ["希望", "信心", "成功"])) {
    return { name: "长风破浪型稳拿人", slogan: "不是盲目自信，是古人认证的会有时。", tag: "稳了" };
  }

  if (result.emotion === "calm" || hasTheme(result, ["松弛", "归隐", "自由", "不争"])) {
    return { name: "东篱躺平型松弛人", slogan: "不是摆烂，是提前进入陶渊明赛道。", tag: "松弛" };
  }

  if (result.emotion === "admire" || hasTheme(result, ["赞美", "才华", "震撼"])) {
    return { name: "杜甫认证夸夸王", slogan: "一句太牛了不够，得让风雨和鬼神都知道。", tag: "封神" };
  }

  if (result.emotion === "homesick" || hasTheme(result, ["思乡", "漂泊", "亲情"])) {
    return { name: "王维式想家人", slogan: "人在异乡，古人最懂突然想家的那一下。", tag: "想家" };
  }

  if (result.emotion === "relieved" || hasTheme(result, ["释怀", "豁达", "通透"])) {
    return { name: "苏轼式不内耗人", slogan: "不是算了，是也无风雨也无晴。", tag: "释怀" };
  }

  if (result.emotion === "driven" || hasTheme(result, ["坚持", "逆境", "韧性", "努力", "成长"])) {
    return { name: "竹石型硬抗人", slogan: "嘴上说扛住，身体里住着一根竹石。", tag: "硬抗" };
  }

  if (result.emotion === "speechless" || hasTheme(result, ["无语", "荒诞", "复杂", "无奈"])) {
    return { name: "木兰式看不懂人", slogan: "不是你理解不了，是这事本来就扑朔迷离。", tag: "无语" };
  }

  if (result.emotion === "warm" || hasTheme(result, ["友情", "知己", "陪伴"])) {
    return { name: "天涯若比邻型同频人", slogan: "真正同频的人，隔多远都像在旁边。", tag: "同频" };
  }

  return { name: "古人嘴替体验卡", slogan: "你的现代话，古人已经替你说过。", tag: "古人说" };
}
