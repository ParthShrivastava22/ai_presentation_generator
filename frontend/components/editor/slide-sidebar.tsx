"use client";

import type { Presentation } from "@/types/presentation";
import { SlideThumbnail } from "./slide-thumbnail";

interface SlideSidebarProps {
  presentation: Presentation;
  selectedSlideIndex: number;
  onSelectSlide: (index: number) => void;
}

export function SlideSidebar({
  presentation,
  selectedSlideIndex,
  onSelectSlide,
}: SlideSidebarProps) {
  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-line bg-paper">
      <div className="border-b border-line px-4 py-3">
        <p className="text-xs font-medium text-muted">
          {presentation.slides.length} slides
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        <div className="flex flex-col gap-2">
          {presentation.slides.map((slide, index) => (
            <SlideThumbnail
              key={index}
              slide={slide}
              theme={presentation.theme}
              index={index}
              isSelected={index === selectedSlideIndex}
              onSelect={() => onSelectSlide(index)}
            />
          ))}
        </div>
      </div>
    </aside>
  );
}
