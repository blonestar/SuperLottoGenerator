import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { blueBallSvg, sunSvg, svgDataUri } from "@/lib/og-art";

export const alt = "SuperLotto Plus Generator: number generator & stats for California SuperLotto Plus";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const font = await readFile(join(process.cwd(), "src/assets/Nunito-ExtraBold.ttf"));
  const sun = svgDataUri(sunSvg({ id: "o" }));
  const balls = [11, 23, 34, 41, 47].map((n, i) => ({ n, src: svgDataUri(blueBallSvg(`b${i}`)) }));

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          padding: "0 80px",
          fontFamily: "Nunito",
          color: "#0b2a44",
          background: "linear-gradient(180deg, #8fd6ff 0%, #d6f0ff 62%, #eef9ff 100%)",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", flex: 1, paddingRight: 40 }}>
          <div style={{ fontSize: 84, fontWeight: 800, lineHeight: 1.05, letterSpacing: -2 }}>SuperLotto Plus Generator</div>
          <div style={{ fontSize: 36, fontWeight: 800, lineHeight: 1.25, marginTop: 26, color: "#2a5a82" }}>
            Number generator &amp; stats for California SuperLotto Plus
          </div>
          <div style={{ display: "flex", alignItems: "center", marginTop: 56 }}>
            {balls.map(({ n, src }) => (
              <div key={n} style={{ display: "flex", position: "relative", width: 84, height: 84, marginRight: 16 }}>
                <img src={src} width={84} height={84} alt="" style={{ position: "absolute", top: 0, left: 0 }} />
                <div style={{ display: "flex", width: 84, height: 84, alignItems: "center", justifyContent: "center", fontSize: 36, color: "#fff" }}>{n}</div>
              </div>
            ))}
            <img src={svgDataUri(sunSvg({ star: false, id: "d" }))} width={112} height={112} alt="" style={{ marginLeft: 8 }} />
          </div>
        </div>
        <img src={sun} width={400} height={400} alt="" />
      </div>
    ),
    { ...size, fonts: [{ name: "Nunito", data: font, weight: 800, style: "normal" }] },
  );
}
