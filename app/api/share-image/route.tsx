import { ImageResponse } from "next/og";

export const runtime = "edge";

function readParam(url: URL, key: string, fallback = "") {
  return (url.searchParams.get(key) || fallback).slice(0, 140);
}

function splitText(value: string, max = 11) {
  const chars = Array.from(value);
  const lines: string[] = [];
  for (let i = 0; i < chars.length; i += max) {
    lines.push(chars.slice(i, i + max).join(""));
  }
  return lines.slice(0, 3);
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const query = readParam(url, "q", "我 emo 了");
  const quote = readParam(url, "quote", "抽刀断水水更流，举杯消愁愁更愁。");
  const author = readParam(url, "author", "李白");
  const dynasty = readParam(url, "dynasty", "唐");
  const title = readParam(url, "title", "宣州谢朓楼饯别校书叔云");
  const explain = readParam(url, "explain", "这句古诗文和现代话意思相近，且有真实出处可查。");
  const quoteLines = splitText(quote, 11);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(145deg, #f7ead8 0%, #fff7ed 55%, #efd5b7 100%)",
          color: "#2c1b12",
          padding: 46
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            borderRadius: 42,
            background: "rgba(255,250,242,0.9)",
            border: "2px solid rgba(82,50,30,0.12)",
            padding: 42
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div
              style={{
                display: "flex",
                padding: "12px 20px",
                borderRadius: 999,
                background: "#e9e5d7",
                color: "#586b46",
                fontSize: 24,
                fontWeight: 800
              }}
            >
              古诗文反查卡
            </div>
          </div>

          <div style={{ marginTop: 44, display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ fontSize: 24, color: "#9a765d", fontWeight: 800 }}>现代话</div>
            <div style={{ fontSize: 42, color: "#8b6042", fontWeight: 900 }}>{query}</div>
          </div>

          <div style={{ marginTop: 54, display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ fontSize: 24, color: "#9a765d", fontWeight: 800 }}>古诗文表达</div>
            {quoteLines.map((line) => (
              <div key={line} style={{ fontSize: 62, lineHeight: 1.18, fontWeight: 900, letterSpacing: 2 }}>{line}</div>
            ))}
          </div>

          <div style={{ marginTop: 32, fontSize: 31, color: "#6c4b35", fontWeight: 800 }}>出处：{dynasty}·{author}《{title}》</div>

          <div style={{ flex: 1 }} />

          <div style={{ display: "flex", flexDirection: "column", gap: 8, padding: 20, borderRadius: 24, background: "rgba(182,93,66,0.08)", color: "#7b614d" }}>
            <div style={{ fontSize: 23, fontWeight: 900, color: "#8b6042" }}>一句解释</div>
            <div style={{ fontSize: 26, lineHeight: 1.42 }}>{explain}</div>
          </div>

          <div style={{ marginTop: 24, display: "flex", alignItems: "center", justifyContent: "space-between", color: "#9b897a", fontSize: 22, letterSpacing: 2 }}>
            <span>GURENSAID.COM · 每句都有出处</span>
            <span>现代话反查古诗文原句</span>
          </div>
        </div>
      </div>
    ),
    {
      width: 900,
      height: 1200
    }
  );
}
