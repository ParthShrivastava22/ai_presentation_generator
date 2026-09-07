import { cn } from "@/lib/utils";
import type { ThemeConfig } from "../themes/theme-config";

interface SlideHeadingProps {
  title: string;
  theme: ThemeConfig;
}

/** Shared title treatment for content, two-column, and image-content slides. */
export function SlideHeading({ title, theme }: SlideHeadingProps) {
  return (
    <div className={cn("flex shrink-0", theme.headingWrapClass)}>
      {theme.headingAccentClass && (
        <span aria-hidden="true" className={theme.headingAccentClass} />
      )}
      <div className="flex min-w-0 flex-1 flex-col">
        <h2 className={theme.headingClass}>{title}</h2>
        {theme.headingRuleClass && (
          <span aria-hidden="true" className={theme.headingRuleClass} />
        )}
      </div>
    </div>
  );
}
