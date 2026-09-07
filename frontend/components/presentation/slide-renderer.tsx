import type { Slide, PresentationTheme } from "@/types/presentation";
import { getThemeConfig, type ThemeConfig } from "./themes/theme-config";
import { SlideCanvas } from "./slide-canvas";
import { TitleSlide } from "./slides/title-slide";
import { ContentSlide } from "./slides/content-slide";
import { TwoColumnSlide } from "./slides/two-column-slide";
import { ImageContentSlide } from "./slides/image-content-slide";

interface SlideRendererProps {
  slide: Slide;
  theme: PresentationTheme;
}

/**
 * Central entry point for rendering a single slide.
 *
 * Slide type decides structure/layout; `theme` decides appearance.
 * The same slide renders differently only because `getThemeConfig`
 * returns different values — no per-theme component branching.
 */
export function SlideRenderer({ slide, theme }: SlideRendererProps) {
  const config = getThemeConfig(theme);

  return (
    <SlideCanvas theme={config}>{renderSlideBody(slide, config)}</SlideCanvas>
  );
}

function renderSlideBody(slide: Slide, theme: ThemeConfig) {
  switch (slide.type) {
    case "title":
      return <TitleSlide slide={slide} theme={theme} />;
    case "content":
      return <ContentSlide slide={slide} theme={theme} />;
    case "two-column":
      return <TwoColumnSlide slide={slide} theme={theme} />;
    case "image-content":
      return <ImageContentSlide slide={slide} theme={theme} />;
    default: {
      const exhaustiveCheck: never = slide;
      return exhaustiveCheck;
    }
  }
}
