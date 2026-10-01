import type { ReactNode } from "react";

export function SectionHead({ id, index, title, subtitle, aside }: { id: string; index: string; title: string; subtitle?: string; aside?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
      <div>
        <div className="flex items-baseline gap-3">
          <span className="font-mono text-sm text-accent" aria-hidden>
            {index}
          </span>
          <h2 id={id} className="text-2xl sm:text-3xl font-semibold tracking-tight">
            {title}
          </h2>
        </div>
        {subtitle && <p className="mt-1.5 text-muted">{subtitle}</p>}
      </div>
      {aside}
    </div>
  );
}
