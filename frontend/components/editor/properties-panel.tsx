"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type {
  ContentSlide,
  ImageContentSlide,
  Slide,
  TitleSlide,
  TwoColumnSlide,
} from "@/types/presentation";

interface PropertiesPanelProps {
  slide: Slide;
  onChange: (slide: Slide) => void;
}

/**
 * Right-side editing panel. Renders a form specific to the selected
 * slide's type and reports the fully-updated slide back via `onChange`
 * on every keystroke. It has no knowledge of the wider Presentation or
 * of slide position — EditorPage owns splicing the updated slide back
 * into the presentation's `slides` array.
 */
export function PropertiesPanel({ slide, onChange }: PropertiesPanelProps) {
  return (
    <aside className="flex w-80 shrink-0 flex-col border-l border-line bg-paper">
      <div className="border-b border-line px-4 py-3">
        <p className="text-xs font-medium text-muted">Slide properties</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {slide.type === "title" && (
          <TitleFields slide={slide} onChange={onChange} />
        )}
        {slide.type === "content" && (
          <ContentFields slide={slide} onChange={onChange} />
        )}
        {slide.type === "two-column" && (
          <TwoColumnFields slide={slide} onChange={onChange} />
        )}
        {slide.type === "image-content" && (
          <ImageContentFields slide={slide} onChange={onChange} />
        )}
      </div>
    </aside>
  );
}

// ---------------------------------------------------------------------------
// Shared field wrapper
// ---------------------------------------------------------------------------

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
    </div>
  );
}

function BulletsField({
  legend,
  bullets,
  onChangeBullet,
}: {
  legend: string;
  bullets: string[];
  onChangeBullet: (index: number, value: string) => void;
}) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs font-medium text-muted">{legend}</p>
      <div className="flex flex-col gap-2">
        {bullets.map((bullet, index) => (
          <Textarea
            key={index}
            value={bullet}
            onChange={(e) => onChangeBullet(index, e.target.value)}
            rows={2}
            aria-label={`${legend} ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Title slide
// ---------------------------------------------------------------------------

function TitleFields({
  slide,
  onChange,
}: {
  slide: TitleSlide;
  onChange: (slide: TitleSlide) => void;
}) {
  return (
    <div className="flex flex-col gap-5">
      <Field label="Title" htmlFor="title-slide-title">
        <Input
          id="title-slide-title"
          value={slide.title}
          onChange={(e) => onChange({ ...slide, title: e.target.value })}
        />
      </Field>
      <Field label="Subtitle" htmlFor="title-slide-subtitle">
        <Textarea
          id="title-slide-subtitle"
          value={slide.subtitle ?? ""}
          onChange={(e) => onChange({ ...slide, subtitle: e.target.value })}
          rows={3}
        />
      </Field>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Content slide
// ---------------------------------------------------------------------------

function ContentFields({
  slide,
  onChange,
}: {
  slide: ContentSlide;
  onChange: (slide: ContentSlide) => void;
}) {
  const updateBullet = (index: number, value: string) => {
    const bullets = slide.bullets.map((bullet, i) =>
      i === index ? value : bullet,
    );
    onChange({ ...slide, bullets });
  };

  return (
    <div className="flex flex-col gap-5">
      <Field label="Title" htmlFor="content-slide-title">
        <Input
          id="content-slide-title"
          value={slide.title}
          onChange={(e) => onChange({ ...slide, title: e.target.value })}
        />
      </Field>
      <BulletsField
        legend="Bullets"
        bullets={slide.bullets}
        onChangeBullet={updateBullet}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Two-column slide
// ---------------------------------------------------------------------------

function TwoColumnFields({
  slide,
  onChange,
}: {
  slide: TwoColumnSlide;
  onChange: (slide: TwoColumnSlide) => void;
}) {
  const updateColumnBullet = (
    side: "left" | "right",
    index: number,
    value: string,
  ) => {
    const column = slide[side];
    const bullets = column.bullets.map((bullet, i) =>
      i === index ? value : bullet,
    );
    onChange({ ...slide, [side]: { ...column, bullets } });
  };

  return (
    <div className="flex flex-col gap-6">
      <Field label="Title" htmlFor="two-column-title">
        <Input
          id="two-column-title"
          value={slide.title}
          onChange={(e) => onChange({ ...slide, title: e.target.value })}
        />
      </Field>

      <div className="flex flex-col gap-4 border-t border-line pt-4">
        <Field label="Left heading" htmlFor="two-column-left-heading">
          <Input
            id="two-column-left-heading"
            value={slide.left.heading}
            onChange={(e) =>
              onChange({
                ...slide,
                left: { ...slide.left, heading: e.target.value },
              })
            }
          />
        </Field>
        <BulletsField
          legend="Left bullets"
          bullets={slide.left.bullets}
          onChangeBullet={(index, value) =>
            updateColumnBullet("left", index, value)
          }
        />
      </div>

      <div className="flex flex-col gap-4 border-t border-line pt-4">
        <Field label="Right heading" htmlFor="two-column-right-heading">
          <Input
            id="two-column-right-heading"
            value={slide.right.heading}
            onChange={(e) =>
              onChange({
                ...slide,
                right: { ...slide.right, heading: e.target.value },
              })
            }
          />
        </Field>
        <BulletsField
          legend="Right bullets"
          bullets={slide.right.bullets}
          onChangeBullet={(index, value) =>
            updateColumnBullet("right", index, value)
          }
        />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Image-content slide
// ---------------------------------------------------------------------------

function ImageContentFields({
  slide,
  onChange,
}: {
  slide: ImageContentSlide;
  onChange: (slide: ImageContentSlide) => void;
}) {
  const updateBullet = (index: number, value: string) => {
    const bullets = slide.bullets.map((bullet, i) =>
      i === index ? value : bullet,
    );
    onChange({ ...slide, bullets });
  };

  return (
    <div className="flex flex-col gap-6">
      <Field label="Title" htmlFor="image-content-title">
        <Input
          id="image-content-title"
          value={slide.title}
          onChange={(e) => onChange({ ...slide, title: e.target.value })}
        />
      </Field>

      <div className="flex flex-col gap-4 border-t border-line pt-4">
        <Field label="Image prompt" htmlFor="image-content-prompt">
          <Textarea
            id="image-content-prompt"
            value={slide.image.prompt}
            onChange={(e) =>
              onChange({
                ...slide,
                image: { ...slide.image, prompt: e.target.value },
              })
            }
            rows={2}
          />
        </Field>
        <Field label="Image alt text" htmlFor="image-content-alt">
          <Input
            id="image-content-alt"
            value={slide.image.alt}
            onChange={(e) =>
              onChange({
                ...slide,
                image: { ...slide.image, alt: e.target.value },
              })
            }
          />
        </Field>
      </div>

      <BulletsField
        legend="Bullets"
        bullets={slide.bullets}
        onChangeBullet={updateBullet}
      />
    </div>
  );
}
