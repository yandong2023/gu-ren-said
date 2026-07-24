type QueryGuardRule = {
  patterns: RegExp[];
  message: string;
};

const QUERY_GUARD_RULES: QueryGuardRule[] = [
  {
    patterns: [
      /(?:你|他|她|这人|那人)?(?:脑子|脑袋)(?:是不是|是否)?(?:有|有点|有些)?(?:问题|毛病|病)/,
      /(?:你|他|她|这人|那人)?(?:脑子|脑袋)(?:不好使|坏了|进水了?)/,
      /(?:你|他|她|这人|那人)?智商(?:有问题|不正常|欠费|下线)/
    ],
    message: "这句话含义不够明确：可能是在说想法不合逻辑、见识有限或行为荒唐，也可能是在描述真实的健康问题。请换成更具体的表达后再查，避免把不同含义硬配成古文。"
  }
];

function normalizeQuery(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, "").replace(/[，。！？!?.,、/\\]/g, "");
}

export function getQueryClarificationMessage(query: string): string | null {
  const normalized = normalizeQuery(query);
  if (!normalized) return null;

  for (const rule of QUERY_GUARD_RULES) {
    if (rule.patterns.some((pattern) => pattern.test(normalized))) return rule.message;
  }

  return null;
}
