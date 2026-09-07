"use client";

import { useState } from "react";
import { usePresentation } from "@/components/presentation/presentation-context";
import { SlideRenderer } from "@/components/presentation/slide-renderer";
import { SlideSidebar } from "@/components/editor/slide-sidebar";
import { EditorToolbar } from "@/components/editor/editor-toolbar";
import { PropertiesPanel } from "@/components/editor/properties-panel";
import type { Slide } from "@/types/presentation";

export default function EditorPage() {
  const { presentation, updatePresentation } = usePresentation();
  const [selectedSlideIndex, setSelectedSlideIndex] = useState(0);

  if (!presentation) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-2 bg-paper text-center">
        <p className="text-base font-medium text-ink">
          No presentation loaded.
        </p>
        <p className="max-w-sm text-sm text-muted">
          Generate a presentation from the create page to open it here.
        </p>
      </div>
    );
  }

  const selectedSlide = presentation.slides[selectedSlideIndex];

  const handleSlideChange = (updatedSlide: Slide) => {
    updatePresentation((current) => ({
      ...current,
      slides: current.slides.map((slide, index) =>
        index === selectedSlideIndex ? updatedSlide : slide,
      ),
    }));
  };

  return (
    <div className="flex h-screen flex-col bg-paper">
      <EditorToolbar
        title={presentation.title}
        currentSlide={selectedSlideIndex + 1}
        totalSlides={presentation.slides.length}
      />

      <div className="flex min-h-0 flex-1">
        <SlideSidebar
          presentation={presentation}
          selectedSlideIndex={selectedSlideIndex}
          onSelectSlide={setSelectedSlideIndex}
        />

        <main className="flex flex-1 items-center justify-center overflow-auto p-10">
          <div className="w-full max-w-4xl">
            <SlideRenderer slide={selectedSlide} theme={presentation.theme} />
          </div>
        </main>

        <PropertiesPanel slide={selectedSlide} onChange={handleSlideChange} />
      </div>
    </div>
  );
}
