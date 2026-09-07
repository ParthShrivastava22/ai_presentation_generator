import { cn } from "@/lib/utils";
import type { TitleSlide as TitleSlideData } from "@/types/presentation";
import type { ThemeConfig } from "../themes/theme-config";

interface TitleSlideProps {
  slide: TitleSlideData;
  theme: ThemeConfig;
}

export function TitleSlide({ slide, theme }: TitleSlideProps) {
  return (
    <div
      className={cn(
        "flex h-full w-full flex-col",
        theme.titleSlideAlign,
        theme.titleSlideGapClass,
      )}
    >
      {theme.titleSlideAccentClass && (
        <span aria-hidden="true" className={theme.titleSlideAccentClass} />
      )}
      <h1 className={theme.titleSlideTitleClass}>{slide.title}</h1>
      {slide.subtitle && (
        <p className={theme.titleSlideSubtitleClass}>{slide.subtitle}</p>
      )}
    </div>
  );
}
