"use client";

import { cn } from "@/lib/utils";
import type { PresentationTheme, Slide } from "@/types/presentation";
import { SlideRenderer } from "@/components/presentation/slide-renderer";

interface SlideThumbnailProps {
  slide: Slide;
  theme: PresentationTheme;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
}

// SlideRenderer/SlideCanvas render at a fixed "native" width so that
// spacing, borders, and padding stay proportionally correct, then we
// shrink the whole thing with a CSS scale transform. The scale factor is
// computed from the OUTER box's real rendered width (a container-query
// length, in cqw) divided by the native width AS A LENGTH (960px, not
// the bare number 960) — dividing length-by-length cancels the units
// into the unitless ratio `scale()` actually requires. Dividing by a
// bare number instead produces an invalid `scale()` argument, which
// browsers silently drop, leaving the slide unscaled and clipped.
const NATIVE_WIDTH = 960;

export function SlideThumbnail({
  slide,
  theme,
  index,
  isSelected,
  onSelect,
}: SlideThumbnailProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-current={isSelected}
      aria-label={`Slide ${index + 1}`}
      className={cn(
        "group flex flex-col gap-1.5 rounded-md p-1.5 text-left transition-colors",
        isSelected ? "bg-ink/5" : "hover:bg-ink/[0.03]",
      )}
    >
      <div className="flex items-center gap-2 px-0.5">
        <span
          className={cn(
            "text-xs font-medium tabular-nums",
            isSelected ? "text-ink" : "text-muted",
          )}
        >
          {index + 1}
        </span>
      </div>

      {/*
        The real thumbnail box: sized by the sidebar layout, locked to
        16:9, clips overflow. @container makes `cqw` below measure
        against THIS element's width — the actual small thumbnail width.
      */}
      <div
        className={cn(
          "w-full overflow-hidden rounded-[4px] border @container",
          isSelected
            ? "border-accent ring-1 ring-accent"
            : "border-line group-hover:border-ink/20",
        )}
        style={{ aspectRatio: "16 / 9" }}
      >
        <div
          style={
            {
              width: NATIVE_WIDTH,
              transform: "scale(var(--thumb-scale))",
              transformOrigin: "top left",
              "--thumb-scale": `calc(100cqw / ${NATIVE_WIDTH}px)`,
            } as React.CSSProperties
          }
        >
          <SlideRenderer slide={slide} theme={theme} />
        </div>
      </div>
    </button>
  );
}
