import type { PresentationTheme } from "@/types/presentation";

export type BulletStyle = "chip" | "dash" | "tick" | "number" | "mark";
export type ColumnStyle = "card" | "divider" | "plain";

export interface ThemeConfig {
  id: PresentationTheme;

  // Canvas
  fontFamilyClass: string;
  canvasClass: string;
  paddingClass: string;
  containerClass?: string;
  topBarClass?: string;

  // Title slide
  titleSlideAlign: string;
  titleSlideGapClass: string;
  titleSlideAccentClass?: string;
  titleSlideTitleClass: string;
  titleSlideSubtitleClass: string;

  // Section heading (content / two-column / image-content)
  headingClass: string;
  headingWrapClass: string;
  headingAccentClass?: string;
  headingRuleClass?: string;

  // Body text
  bodyClass: string;
  mutedClass: string;

  // Two-column
  columnStyle: ColumnStyle;
  columnHeadingClass: string;
  columnSurfaceClass: string;

  // Image placeholder
  imagePlaceholderClass: string;

  // Bullets
  bulletStyle: BulletStyle;
  bulletMarkerClass: string;
  bulletGapClass: string;
}

const SANS = "[font-family:var(--font-geist-sans)]";

const themes: Record<PresentationTheme, ThemeConfig> = {
  modern: {
    id: "modern",
    fontFamilyClass: SANS,
    canvasClass: "bg-white text-ink",
    paddingClass: "p-10 md:p-12",
    titleSlideAlign: "items-start text-left",
    titleSlideGapClass: "gap-5",
    titleSlideAccentClass: "h-2.5 w-2.5 rounded-sm bg-accent",
    titleSlideTitleClass:
      "text-[clamp(1.875rem,4.6cqw,3.25rem)] font-semibold leading-[1.08] tracking-tight text-ink text-balance",
    titleSlideSubtitleClass:
      "max-w-[38ch] text-[clamp(1rem,1.6cqw,1.25rem)] leading-relaxed text-muted text-pretty",
    headingClass:
      "text-[clamp(1.375rem,3cqw,2rem)] font-semibold tracking-tight text-ink text-balance",
    headingWrapClass: "items-center gap-3",
    headingAccentClass: "h-2.5 w-2.5 shrink-0 rounded-sm bg-accent",
    headingRuleClass: "mt-4 h-px w-full bg-line",
    bodyClass:
      "text-[clamp(0.95rem,1.5cqw,1.125rem)] leading-snug text-ink text-pretty",
    mutedClass: "text-muted",
    columnStyle: "card",
    columnHeadingClass: "text-sm font-semibold text-ink",
    columnSurfaceClass: "rounded-md border border-line p-6",
    imagePlaceholderClass: "bg-paper border border-line",
    bulletStyle: "chip",
    bulletMarkerClass: "bg-accent/10 text-accent",
    bulletGapClass: "gap-3",
  },

  professional: {
    id: "professional",
    fontFamilyClass: SANS,
    canvasClass: "bg-white text-ink",
    paddingClass: "p-12 md:p-14",
    topBarClass: "bg-ink",
    titleSlideAlign: "items-center text-center",
    titleSlideGapClass: "gap-4",
    titleSlideAccentClass: "h-[3px] w-16 bg-ink",
    titleSlideTitleClass:
      "text-[clamp(1.75rem,4cqw,2.75rem)] font-semibold tracking-tight text-ink text-balance",
    titleSlideSubtitleClass:
      "max-w-[34ch] text-[clamp(0.95rem,1.4cqw,1.0625rem)] leading-relaxed text-muted text-pretty",
    headingClass:
      "text-[clamp(1.25rem,2.6cqw,1.75rem)] font-semibold text-ink text-balance",
    headingWrapClass:
      "w-full flex-col items-start gap-3 border-b border-line pb-4",
    bodyClass:
      "text-[clamp(0.9rem,1.4cqw,1.0625rem)] leading-relaxed text-ink text-pretty",
    mutedClass: "text-muted",
    columnStyle: "divider",
    columnHeadingClass: "text-sm font-semibold text-ink",
    columnSurfaceClass: "border-l border-line pl-8",
    imagePlaceholderClass: "bg-paper border border-line",
    bulletStyle: "dash",
    bulletMarkerClass: "text-ink/70",
    bulletGapClass: "gap-3",
  },

  minimal: {
    id: "minimal",
    fontFamilyClass: `${SANS} font-light`,
    canvasClass: "bg-white text-ink",
    paddingClass: "p-14 md:p-16",
    containerClass: "justify-center",
    titleSlideAlign: "items-start text-left",
    titleSlideGapClass: "gap-4",
    titleSlideTitleClass:
      "text-[clamp(1.75rem,4cqw,2.75rem)] font-light tracking-tight text-ink text-balance",
    titleSlideSubtitleClass:
      "max-w-[36ch] text-[clamp(0.95rem,1.4cqw,1.125rem)] font-light leading-relaxed text-muted text-pretty",
    headingClass:
      "text-[clamp(1.125rem,2.2cqw,1.5rem)] font-normal tracking-tight text-ink text-balance",
    headingWrapClass: "items-start",
    bodyClass:
      "text-[clamp(0.9rem,1.4cqw,1.0625rem)] font-light leading-relaxed text-ink text-pretty",
    mutedClass: "text-muted",
    columnStyle: "plain",
    columnHeadingClass: "text-sm font-normal text-muted",
    columnSurfaceClass: "border-l border-line/60 pl-10",
    imagePlaceholderClass: "bg-paper",
    bulletStyle: "tick",
    bulletMarkerClass: "bg-line",
    bulletGapClass: "gap-4",
  },

  academic: {
    id: "academic",
    fontFamilyClass: "font-serif",
    canvasClass: "bg-paper text-ink",
    paddingClass: "p-12 md:p-14",
    titleSlideAlign: "items-center text-center",
    titleSlideGapClass: "gap-4",
    titleSlideAccentClass: "h-px w-20 bg-line",
    titleSlideTitleClass:
      "text-[clamp(1.75rem,4cqw,2.75rem)] font-semibold text-ink text-balance",
    titleSlideSubtitleClass:
      "max-w-[34ch] text-[clamp(0.95rem,1.4cqw,1.0625rem)] italic leading-relaxed text-muted text-pretty",
    headingClass:
      "text-[clamp(1.25rem,2.6cqw,1.75rem)] font-semibold text-ink text-balance",
    headingWrapClass:
      "w-full flex-col items-start gap-3 border-b border-line pb-3",
    bodyClass:
      "text-[clamp(0.95rem,1.4cqw,1.0625rem)] leading-relaxed text-ink text-pretty",
    mutedClass: "text-muted",
    columnStyle: "card",
    columnHeadingClass: "font-semibold text-sm text-ink",
    columnSurfaceClass: "rounded-sm border border-line p-6",
    imagePlaceholderClass: "bg-white border border-line",
    bulletStyle: "number",
    bulletMarkerClass: "text-muted",
    bulletGapClass: "gap-3",
  },

  creative: {
    id: "creative",
    fontFamilyClass: SANS,
    canvasClass: "bg-ink text-white",
    paddingClass: "p-12 md:p-14",
    titleSlideAlign: "items-start text-left",
    titleSlideGapClass: "gap-5",
    titleSlideAccentClass: "h-2.5 w-10 rounded-full bg-accent-warm",
    titleSlideTitleClass:
      "text-[clamp(2rem,5cqw,3.5rem)] font-semibold leading-[1.05] tracking-tight text-white text-balance",
    titleSlideSubtitleClass:
      "max-w-[38ch] text-[clamp(1rem,1.6cqw,1.25rem)] leading-relaxed text-white/70 text-pretty",
    headingClass:
      "text-[clamp(1.5rem,3.2cqw,2.25rem)] font-semibold tracking-tight text-white text-balance",
    headingWrapClass: "items-center gap-3",
    headingAccentClass: "h-8 w-1.5 shrink-0 rounded-full bg-accent-warm",
    bodyClass:
      "text-[clamp(0.95rem,1.5cqw,1.125rem)] leading-snug text-white/90 text-pretty",
    mutedClass: "text-white/60",
    columnStyle: "card",
    columnHeadingClass: "text-sm font-medium text-white/70",
    columnSurfaceClass: "rounded-lg border border-white/15 bg-white/5 p-6",
    imagePlaceholderClass: "bg-white/5 border border-white/15",
    bulletStyle: "mark",
    bulletMarkerClass: "bg-accent-warm",
    bulletGapClass: "gap-3",
  },
};

export function getThemeConfig(theme: PresentationTheme): ThemeConfig {
  return themes[theme];
}
