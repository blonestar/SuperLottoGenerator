// Shared artwork for the generated icons / share images (mirrors the sun Mega ball + blue balls in globals.css).

const STAR = "M32 20l2.9 6.3 6.9.8-5.1 4.7 1.3 6.8L32 35.2l-6 3.4 1.3-6.8-5.1-4.7 6.9-.8z";

/** Golden sun ball with rays. viewBox 0 0 64 64. */
export function sunSvg({ star = true, id = "s" }: { star?: boolean; id?: string } = {}): string {
  const rays = Array.from({ length: 12 }, (_, i) => `<path d="M32 1.5l4 8.5h-8z" transform="rotate(${i * 30} 32 32)"/>`).join("");
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">` +
    `<defs>` +
    `<radialGradient id="${id}b" cx="0.32" cy="0.26" r="0.85"><stop offset="0" stop-color="#fff6a8"/><stop offset="0.32" stop-color="#ffd400"/><stop offset="0.78" stop-color="#f7941d"/><stop offset="1" stop-color="#d9700a"/></radialGradient>` +
    `<linearGradient id="${id}h" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0.8"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>` +
    `</defs>` +
    `<g fill="#ffb81c">${rays}</g>` +
    `<circle cx="32" cy="32" r="20" fill="url(#${id}b)"/>` +
    `<ellipse cx="25" cy="19.5" rx="8" ry="4.6" transform="rotate(-24 25 19.5)" fill="url(#${id}h)"/>` +
    (star ? `<path d="${STAR}" fill="#fff8d0" stroke="#c76a05" stroke-opacity="0.35" stroke-width="0.8" stroke-linejoin="round"/>` : "") +
    `</svg>`
  );
}

/** Glossy blue lottery ball. viewBox 0 0 64 64. */
export function blueBallSvg(id = "b"): string {
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">` +
    `<defs>` +
    `<radialGradient id="${id}b" cx="0.32" cy="0.26" r="0.85"><stop offset="0" stop-color="#6fd3ff"/><stop offset="0.3" stop-color="#12a4ee"/><stop offset="0.68" stop-color="#0a7cc4"/><stop offset="1" stop-color="#05568f"/></radialGradient>` +
    `<linearGradient id="${id}h" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0.75"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>` +
    `</defs>` +
    `<circle cx="32" cy="32" r="30" fill="url(#${id}b)"/>` +
    `<ellipse cx="22" cy="14" rx="12" ry="7" transform="rotate(-24 22 14)" fill="url(#${id}h)"/>` +
    `</svg>`
  );
}

export const svgDataUri = (svg: string) => `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
