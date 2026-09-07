import Link from "next/link";
import { exportToPptx } from "@/lib/export/pptx";
import { usePresentation } from "../presentation/presentation-context";

interface EditorToolbarProps {
  title: string;
  currentSlide: number;
  totalSlides: number;
}

export function EditorToolbar({
  title,
  currentSlide,
  totalSlides,
}: EditorToolbarProps) {
  const { presentation } = usePresentation();
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-line bg-white px-4">
      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="text-sm font-semibold tracking-tight text-ink"
        >
          Slate
        </Link>
        <span className="text-line">/</span>
        <span className="max-w-xs truncate text-sm text-muted">{title}</span>
      </div>

      <p className="text-xs tabular-nums text-muted">
        Slide {currentSlide} of {totalSlides}
      </p>

      <button
        type="button"
        onClick={() => {
          if (presentation) {
            exportToPptx(presentation);
          }
        }}
        className="rounded-md bg-black px-4 py-2 text-sm text-white"
      >
        Download PPTX
      </button>
    </header>
  );
}
