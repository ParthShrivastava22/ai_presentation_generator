import { cn } from "@/lib/utils";
import type { TwoColumnSlide as TwoColumnSlideData } from "@/types/presentation";
import type { ThemeConfig } from "../themes/theme-config";
import { SlideHeading } from "./slide-heading";
import { BulletList } from "./bullet-list";

interface TwoColumnSlideProps {
  slide: TwoColumnSlideData;
  theme: ThemeConfig;
}

export function TwoColumnSlide({ slide, theme }: TwoColumnSlideProps) {
  return (
    <div className="flex h-full w-full flex-col gap-6 md:gap-8">
      <SlideHeading title={slide.title} theme={theme} />
      <div className="grid min-h-0 flex-1 grid-cols-2 gap-6 md:gap-8">
        <Column
          heading={slide.left.heading}
          bullets={slide.left.bullets}
          theme={theme}
          first
        />
        <Column
          heading={slide.right.heading}
          bullets={slide.right.bullets}
          theme={theme}
        />
      </div>
    </div>
  );
}

function Column({
  heading,
  bullets,
  theme,
  first,
}: {
  heading: string;
  bullets: string[];
  theme: ThemeConfig;
  first?: boolean;
}) {
  const surfaceClass =
    theme.columnStyle === "card"
      ? theme.columnSurfaceClass
      : first
        ? undefined
        : theme.columnSurfaceClass;

  return (
    <div className={cn("flex min-w-0 flex-col gap-4", surfaceClass)}>
      <h3 className={cn("break-words", theme.columnHeadingClass)}>{heading}</h3>
      <BulletList items={bullets} theme={theme} />
    </div>
  );
}
