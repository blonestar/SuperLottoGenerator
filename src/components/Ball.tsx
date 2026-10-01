import type { CSSProperties } from "react";

interface BallProps {
  n?: number;
  mega?: boolean;
  size?: "sm" | "md" | "lg";
  drop?: boolean;
  delay?: number; // ms
  label?: string;
}

export function Ball({ n, mega = false, size = "md", drop = false, delay = 0, label }: BallProps) {
  const cls = [
    "ball",
    mega ? "ball-mega" : "",
    n === undefined ? "ball-empty" : "",
    size === "sm" ? "ball-sm" : size === "lg" ? "ball-lg" : "",
    drop ? "ball-drop" : "",
  ]
    .filter(Boolean)
    .join(" ");
  const style: CSSProperties | undefined = drop ? { animationDelay: `${delay}ms` } : undefined;
  return (
    <span className={cls} style={style} aria-label={label} role={label ? "img" : undefined}>
      {n === undefined ? "?" : n}
    </span>
  );
}
