import { ImageResponse } from "next/og";
import { markSvg, svgDataUri } from "@/lib/og-image";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// Full-bleed: iOS applies its own corner mask.
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#1b1530" }}>
        <img src={svgDataUri(markSvg)} width={180} height={180} alt="" />
      </div>
    ),
    size,
  );
}
