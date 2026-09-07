import { Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type {
  Image as ImageData,
  ImageContentSlide as ImageContentSlideData,
} from "@/types/presentation";
import type { ThemeConfig } from "../themes/theme-config";
import { SlideHeading } from "./slide-heading";
import { BulletList } from "./bullet-list";

interface ImageContentSlideProps {
  slide: ImageContentSlideData;
  theme: ThemeConfig;
}

export function ImageContentSlide({ slide, theme }: ImageContentSlideProps) {
  return (
    <div className="flex h-full w-full flex-col gap-6 md:gap-8">
      <SlideHeading title={slide.title} theme={theme} />
      <div className="grid min-h-0 flex-1 grid-cols-2 items-stretch gap-6 md:gap-8">
        <div className="min-w-0">
          <BulletList items={slide.bullets} theme={theme} />
        </div>
        <SlideImage image={slide.image} theme={theme} />
      </div>
    </div>
  );
}

function SlideImage({
  image,
  theme,
}: {
  image: ImageData;
  theme: ThemeConfig;
}) {
  if (image.url) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={image.url}
        alt={image.alt}
        className={cn(
          "h-full w-full rounded-md object-cover",
          theme.imagePlaceholderClass,
        )}
      />
    );
  }

  return (
    <div
      role="img"
      aria-label={image.alt}
      className={cn(
        "flex h-full w-full flex-col items-center justify-center gap-2 rounded-md p-6 text-center",
        theme.imagePlaceholderClass,
      )}
    >
      <ImageIcon
        className={cn("h-6 w-6", theme.mutedClass)}
        aria-hidden="true"
      />
      <p className={cn("text-sm text-pretty", theme.mutedClass)}>{image.alt}</p>
    </div>
  );
}
