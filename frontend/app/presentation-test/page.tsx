"use client";

import { useState } from "react";
import { SlideRenderer } from "@/components/presentation/slide-renderer";
import type { Presentation, PresentationTheme } from "@/types/presentation";

const samplePresentation: Presentation = {
  title: "The Future of Artificial Intelligence",
  theme: "modern",
  slides: [
    {
      type: "title",
      title:
        "How Artificial Intelligence Is Transforming Modern Software Development",
      subtitle:
        "From automated coding assistance to intelligent software systems",
    },
    {
      type: "content",
      title:
        "How Artificial Intelligence Is Transforming Modern Software Development",
      bullets: [
        "AI-powered coding assistants can generate, explain, refactor, and debug software while reducing the amount of repetitive work developers need to perform.",
        "Machine learning models are increasingly integrated into development tools to identify bugs, suggest improvements, analyze codebases, and automate routine engineering workflows.",
        "Large language models have changed how developers interact with software by allowing them to describe desired behavior in natural language rather than manually writing every implementation detail.",
        "AI-assisted development can improve developer productivity, but generated code still requires careful review because models can produce incorrect, insecure, or inefficient solutions.",
        "The role of software engineers is gradually shifting toward system design, problem solving, verification, and effective collaboration with increasingly capable AI development tools.",
      ],
    },
    {
      type: "two-column",
      title: "The Benefits and Challenges of AI-Assisted Development",
      left: {
        heading: "Benefits of AI-Assisted Development",
        bullets: [
          "Faster implementation of repetitive tasks",
          "Assistance with debugging and code explanation",
          "Rapid exploration of alternative solutions",
          "Lower barrier to learning unfamiliar technologies",
          "Improved productivity across the software lifecycle",
        ],
      },
      right: {
        heading: "Challenges and Considerations",
        bullets: [
          "Generated code may contain subtle bugs",
          "Security and privacy risks require careful consideration",
          "Developers can become overly dependent on generated solutions",
          "Model outputs may reflect incomplete or outdated information",
          "Human judgment remains essential for important engineering decisions",
        ],
      },
    },
    {
      type: "image-content",
      title: "What the Future of Software Development Could Look Like",
      image: {
        prompt:
          "A sophisticated editorial illustration showing a software engineer collaborating with an AI system, with code, system architecture diagrams, and intelligent automation surrounding them",
        alt: "Illustration of a software engineer collaborating with an artificial intelligence system",
        url: null,
      },
      bullets: [
        "AI agents may increasingly handle multi-step development tasks from requirements through implementation and testing.",
        "Software engineers may spend more time defining systems, validating AI-generated work, and making architectural decisions.",
        "Development environments could become highly personalized assistants that understand an entire codebase and its underlying architecture.",
        "Human creativity and judgment will remain important as software development moves toward deeper collaboration between people and intelligent tools.",
        "The most effective engineers will likely learn to combine strong technical fundamentals with the ability to work effectively alongside AI systems.",
      ],
    },
  ],
};

const themes: PresentationTheme[] = [
  "modern",
  "professional",
  "minimal",
  "academic",
  "creative",
];

export default function PresentationTestPage() {
  const [theme, setTheme] = useState<PresentationTheme>("modern");
  const [currentSlide, setCurrentSlide] = useState(0);

  const slide = samplePresentation.slides[currentSlide];

  return (
    <main className="min-h-screen bg-paper px-6 py-10">
      <div className="mx-auto max-w-6xl">
        {/* Test page header */}
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-muted">
              Development Preview
            </p>

            <h1 className="text-2xl font-semibold tracking-tight text-ink">
              Presentation Renderer
            </h1>

            <p className="mt-1 text-sm text-muted">
              Preview the same presentation across all Slate themes.
            </p>
          </div>

          {/* Theme selector */}
          <div className="flex items-center gap-3">
            <label htmlFor="theme" className="text-sm font-medium text-ink">
              Theme
            </label>

            <select
              id="theme"
              value={theme}
              onChange={(event) =>
                setTheme(event.target.value as PresentationTheme)
              }
              className="rounded-md border border-line bg-white px-3 py-2 text-sm text-ink outline-none focus:ring-2 focus:ring-ink/20"
            >
              {themes.map((themeOption) => (
                <option key={themeOption} value={themeOption}>
                  {themeOption.charAt(0).toUpperCase() + themeOption.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Slide */}
        <div className="mx-auto w-full max-w-5xl">
          <SlideRenderer slide={slide} theme={theme} />
        </div>

        {/* Controls */}
        <div className="mt-6 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() =>
              setCurrentSlide((current) => Math.max(0, current - 1))
            }
            disabled={currentSlide === 0}
            className="rounded-md border border-line bg-white px-4 py-2 text-sm font-medium text-ink transition hover:bg-paper disabled:cursor-not-allowed disabled:opacity-40"
          >
            Previous
          </button>

          <span className="min-w-20 text-center text-sm text-muted">
            Slide {currentSlide + 1} of {samplePresentation.slides.length}
          </span>

          <button
            type="button"
            onClick={() =>
              setCurrentSlide((current) =>
                Math.min(samplePresentation.slides.length - 1, current + 1),
              )
            }
            disabled={currentSlide === samplePresentation.slides.length - 1}
            className="rounded-md border border-line bg-white px-4 py-2 text-sm font-medium text-ink transition hover:bg-paper disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </main>
  );
}
