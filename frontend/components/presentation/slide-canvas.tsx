import { cn } from "@/lib/utils";
import type { ThemeConfig } from "./themes/theme-config";

interface SlideCanvasProps {
  theme: ThemeConfig;
  children: React.ReactNode;
}

/**
 * Enforces the 16:9 presentation canvas and applies the theme's font
 * family. `@container` lets slide typography (theme-config's `cqw`
 * clamp() values) scale against the canvas's own rendered width rather
 * than the viewport — important since the same slide may render small
 * (thumbnail) or large (editor) later.
 */
export function SlideCanvas({ theme, children }: SlideCanvasProps) {
  return (
    <div
      className={cn(
        "relative w-full overflow-hidden @container",
        theme.canvasClass,
        theme.fontFamilyClass,
      )}
      style={{ aspectRatio: "16 / 9" }}
    >
      {theme.topBarClass && (
        <div
          aria-hidden="true"
          className={cn("absolute inset-x-0 top-0 h-1.5", theme.topBarClass)}
        />
      )}
      <div
        className={cn(
          "flex h-full w-full flex-col overflow-hidden",
          theme.paddingClass,
          theme.containerClass,
        )}
      >
        {children}
      </div>
    </div>
  );
}
