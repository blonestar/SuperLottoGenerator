// Shared artwork for the generated icons / share images (mirrors the header band, logo and flat balls in globals.css).
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

const INK = "#1b1530";
const RED = "#b33735";
const GOLD = "#ffba00";
const NAVY = "#22447a";

/** App mark: red + gold balls on the ink tile. viewBox 0 0 64 64. Keep in sync with src/app/icon.svg. */
export const markSvg =
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">` +
  `<rect width="64" height="64" rx="12" fill="${INK}"/>` +
  `<circle cx="24" cy="32" r="14" fill="${RED}"/>` +
  `<circle cx="40" cy="32" r="14" fill="${GOLD}" stroke="${INK}" stroke-width="4"/>` +
  `</svg>`;

export const svgDataUri = (svg: string) => `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;

const shareSize = { width: 1200, height: 630 };

function Ball({ n, mega = false }: { n: number; mega?: boolean }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 92,
        height: 92,
        marginRight: 18,
        borderRadius: 9999,
        fontFamily: "Geist Mono",
        fontSize: 38,
        color: mega ? INK : "#fff",
        background: mega ? GOLD : RED,
        boxShadow: `inset 0 -6px 0 ${mega ? "rgba(140,80,0,0.25)" : "rgba(0,0,0,0.18)"}`,
      }}
    >
      {n}
    </div>
  );
}

export async function shareImage() {
  const [sans, mono] = await Promise.all([
    readFile(join(process.cwd(), "src/assets/Geist-SemiBold.ttf")),
    readFile(join(process.cwd(), "src/assets/GeistMono-SemiBold.ttf")),
  ]);

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", fontFamily: "Geist", color: "#f4f1fa", background: INK }}>
        <div style={{ display: "flex", flexDirection: "column", flex: 1, justifyContent: "center", padding: "0 80px" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            {/* eslint-disable-next-line @next/next/no-img-element -- rendered by ImageResponse, not the browser */}
            <img src={svgDataUri(markSvg)} width={64} height={64} alt="" />
            <div style={{ fontSize: 26, color: "#a79fbb", marginLeft: 20 }}>Unofficial · just for fun</div>
          </div>
          <div style={{ fontSize: 88, lineHeight: 1.05, letterSpacing: -3, marginTop: 36 }}>SuperLotto Plus Generator</div>
          <div style={{ fontSize: 34, lineHeight: 1.3, marginTop: 20, color: "#a79fbb" }}>Number generator &amp; stats for California SuperLotto Plus</div>
          <div style={{ display: "flex", alignItems: "center", marginTop: 56 }}>
            {[11, 23, 34, 41, 47].map((n) => (
              <Ball key={n} n={n} />
            ))}
            <div style={{ width: 14 }} />
            <Ball n={7} mega />
          </div>
        </div>
        <div style={{ display: "flex", height: 12, background: `linear-gradient(90deg, ${RED} 0%, ${RED} 40%, ${NAVY} 100%)` }} />
      </div>
    ),
    {
      ...shareSize,
      fonts: [
        { name: "Geist", data: sans, weight: 600, style: "normal" },
        { name: "Geist Mono", data: mono, weight: 600, style: "normal" },
      ],
    },
  );
}
