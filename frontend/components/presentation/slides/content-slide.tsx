import type { ContentSlide as ContentSlideData } from "@/types/presentation";
import type { ThemeConfig } from "../themes/theme-config";
import { SlideHeading } from "./slide-heading";
import { BulletList } from "./bullet-list";

interface ContentSlideProps {
  slide: ContentSlideData;
  theme: ThemeConfig;
}

export function ContentSlide({ slide, theme }: ContentSlideProps) {
  return (
    <div className="flex h-full w-full flex-col gap-6 md:gap-8">
      <SlideHeading title={slide.title} theme={theme} />
      <div className="min-h-0 flex-1">
        <BulletList items={slide.bullets} theme={theme} />
      </div>
    </div>
  );
}
