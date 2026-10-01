import { shareImage } from "@/lib/og-image";

export const alt = "SuperLotto Plus Generator: number generator & stats for California SuperLotto Plus";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return shareImage();
}
