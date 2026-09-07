export type Audience =
  | "general"
  | "school-students"
  | "college-students"
  | "professionals"
  | "business-executives";

export type PresentationTheme =
  | "modern"
  | "professional"
  | "minimal"
  | "academic"
  | "creative";

export type SlideCount = 5 | 8 | 10 | 12 | 15;

export interface GenerationRequest {
  topic: string;
  description: string;
  audience: Audience;
  slideCount: SlideCount;
  style: PresentationTheme;
  instructions?: string | null;
}

export interface Column {
  heading: string;
  bullets: string[];
}

export interface Image {
  prompt: string;
  alt: string;
  url: string | null;
}

export interface TitleSlide {
  type: "title";
  title: string;
  subtitle?: string | null;
}

export interface ContentSlide {
  type: "content";
  title: string;
  bullets: string[];
}

export interface TwoColumnSlide {
  type: "two-column";
  title: string;
  left: Column;
  right: Column;
}

export interface ImageContentSlide {
  type: "image-content";
  title: string;
  image: Image;
  bullets: string[];
}

export type Slide =
  | TitleSlide
  | ContentSlide
  | TwoColumnSlide
  | ImageContentSlide;

export interface Presentation {
  title: string;
  theme: PresentationTheme;
  slides: Slide[];
}
