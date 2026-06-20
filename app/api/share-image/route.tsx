import { ImageResponse } from "next/og";

export const runtime = "edge";

function readParam(url: URL, key: string, fallback = "") {
  return (url.searchParams.get(key) || fallback).slice(0, 120);
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
  const persona = readParam(url, "persona", "古人嘴替：把 emo 说得有文化");
  const slogan = readParam(url, "slogan", "你的破防，古人早就替你押过韵。");
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
            background: "rgba(255,250,242,0.88)",
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
              古人嘴替生成器
            </div>
          </div>

          <div style={{ marginTop: 34, fontSize: 38, color: "#8b6042", fontWeight: 800 }}>现代人说：{query}</div>
          <div style={{ marginTop: 30, fontSize: 50, color: "#b65d42", fontWeight: 900 }}>{persona}</div>
          <div style={{ marginTop: 14, fontSize: 30, color: "#7b614d" }}>{slogan}</div>

          <div style={{ marginTop: 48, display: "flex", flexDirection: "column", gap: 10 }}>
            {quoteLines.map((line) => (
              <div key={line} style={{ fontSize: 60, lineHeight: 1.18, fontWeight: 900, letterSpacing: 2 }}>{line}</div>
            ))}
          </div>

          <div style={{ marginTop: 32, fontSize: 30, color: "#6c4b35", fontWeight: 800 }}>——{dynasty}·{author}《{title}》</div>
          <div style={{ flex: 1 }} />
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", color: "#9b897a", fontSize: 22, letterSpacing: 2 }}>
            <span>GURENSAID.COM · 每句都有出处</span>
            <span>把你的现代话换成古人说法</span>
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
