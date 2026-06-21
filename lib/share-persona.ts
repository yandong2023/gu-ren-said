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
    if (hasTheme(result, ["相守", "承诺"])) return { name: "古人嘴替：把喜欢说成一生相守", slogan: "别只说“我爱你”，古人一开口就是白头不离。", tag: "深情" };
    if (hasTheme(result, ["暗恋", "心动"])) return { name: "古人嘴替：把暗恋说到心里去", slogan: "嘴上没说出口，古人已经替你写成诗。", tag: "暗恋" };
    if (hasTheme(result, ["相思", "深情"])) return { name: "古人嘴替：把想念写到入骨", slogan: "别只说“我想你”，古人说相思可以入骨。", tag: "相思" };
    return { name: "古人嘴替：把爱说得更重", slogan: "一句现代话，换成古人说法，突然就有了分量。", tag: "爱情" };
  }

  if (result.emotion === "critical" || hasTheme(result, ["负向外貌", "反讽", "讽刺", "失礼"])) {
    return { name: "古人嘴替：把吐槽说得更有分寸", slogan: "别只说难听话，古人会把话锋藏进典故里。", tag: "反讽" };
  }

  if (result.emotion === "beauty" || hasTheme(result, ["美貌", "惊艳", "容貌"])) {
    return { name: "古人嘴替：把好看夸得更高级", slogan: "别只说“真好看”，古人夸人连眼神都有画面。", tag: "夸夸" };
  }

  if (result.emotion === "sad" || hasTheme(result, ["忧愁", "失意", "烦闷", "孤独"])) {
    return { name: "古人嘴替：把 emo 说得有文化", slogan: "你的破防，古人早就替你押过韵。", tag: "emo" };
  }

  if (result.emotion === "positive" || hasTheme(result, ["希望", "信心", "成功"])) {
    return { name: "古人嘴替：把稳了说得更燃", slogan: "别只说“这事包的”，古人说长风破浪会有时。", tag: "稳了" };
  }

  if (result.emotion === "calm" || hasTheme(result, ["松弛", "归隐", "自由", "不争"])) {
    return { name: "古人嘴替：把躺平说成松弛感", slogan: "别只说“想躺平”，古人已经在东篱下看南山。", tag: "松弛" };
  }

  if (result.emotion === "admire" || hasTheme(result, ["赞美", "才华", "震撼"])) {
    return { name: "古人嘴替：把太牛了说到封神", slogan: "一句“666”不够，古人直接写到惊风雨、泣鬼神。", tag: "封神" };
  }

  if (result.emotion === "homesick" || hasTheme(result, ["思乡", "漂泊", "亲情"])) {
    return { name: "古人嘴替：把想家说得更戳心", slogan: "人在异乡突然想家，古人最懂那一下。", tag: "想家" };
  }

  if (result.emotion === "relieved" || hasTheme(result, ["释怀", "豁达", "通透"])) {
    return { name: "古人嘴替：把不内耗说得更通透", slogan: "别只说“算了”，古人说也无风雨也无晴。", tag: "释怀" };
  }

  if (result.emotion === "driven" || hasTheme(result, ["坚持", "逆境", "韧性", "努力", "成长"])) {
    return { name: "古人嘴替：把扛住说得更有劲", slogan: "别只说“坚持住”，古人写的是千磨万击还坚劲。", tag: "硬抗" };
  }

  if (result.emotion === "speechless" || hasTheme(result, ["无语", "荒诞", "复杂", "无奈"])) {
    return { name: "古人嘴替：把离谱说得更有梗", slogan: "不是你看不懂，是这事本来就扑朔迷离。", tag: "无语" };
  }

  if (result.emotion === "warm" || hasTheme(result, ["友情", "知己", "陪伴"])) {
    return { name: "古人嘴替：把同频说得更温暖", slogan: "真正同频的人，古人说天涯也像比邻。", tag: "同频" };
  }

  return { name: "古人嘴替：把现代话换成古文", slogan: "你的这句话，古人已经替你说过。", tag: "古人说" };
}
