import { cn } from "@/lib/utils";
import type { BulletStyle, ThemeConfig } from "../themes/theme-config";

interface BulletListProps {
  items: string[];
  theme: ThemeConfig;
}

export function BulletList({ items, theme }: BulletListProps) {
  return (
    <ul className={cn("flex min-w-0 flex-col", theme.bulletGapClass)}>
      {items.map((item, index) => (
        <li
          key={index}
          className={cn("flex min-w-0 items-start gap-3", theme.bodyClass)}
        >
          <BulletMarker
            style={theme.bulletStyle}
            index={index}
            className={theme.bulletMarkerClass}
          />
          <span className="min-w-0">{item}</span>
        </li>
      ))}
    </ul>
  );
}

function BulletMarker({
  style,
  index,
  className,
}: {
  style: BulletStyle;
  index: number;
  className: string;
}) {
  switch (style) {
    case "chip":
      return (
        <span
          aria-hidden="true"
          className={cn(
            "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-medium tabular-nums",
            className,
          )}
        >
          {index + 1}
        </span>
      );
    case "dash":
      return (
        <span
          aria-hidden="true"
          className={cn("shrink-0 leading-[1.4]", className)}
        >
          –
        </span>
      );
    case "tick":
      return (
        <span
          aria-hidden="true"
          className={cn("mt-[0.65em] h-px w-3 shrink-0", className)}
        />
      );
    case "number":
      return (
        <span
          aria-hidden="true"
          className={cn("shrink-0 leading-[1.4] tabular-nums", className)}
        >
          {index + 1}.
        </span>
      );
    case "mark":
      return (
        <span
          aria-hidden="true"
          className={cn("mt-[0.45em] h-2 w-2 shrink-0 rotate-45", className)}
        />
      );
    default:
      return null;
  }
}
