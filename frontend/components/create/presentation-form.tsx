"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { usePresentation } from "@/components/presentation/presentation-context";

import type {
  Audience,
  GenerationRequest,
  Presentation,
  PresentationTheme,
  SlideCount,
} from "@/types/presentation";

const AUDIENCES = [
  "General Audience",
  "School Students",
  "College Students",
  "Professionals",
  "Business Executives",
];

const SLIDE_COUNTS = ["5", "8", "10", "12", "15"];

const STYLES = ["Modern", "Professional", "Minimal", "Academic", "Creative"];

export function PresentationForm() {
  const [topic, setTopic] = useState("");
  const [description, setDescription] = useState("");
  const [audience, setAudience] = useState("");
  const [slideCount, setSlideCount] = useState("8");
  const [style, setStyle] = useState("");
  const [instructions, setInstructions] = useState("");
  const router = useRouter();
  const { setPresentation } = usePresentation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const request: GenerationRequest = {
        topic,
        description,
        audience: audience.toLowerCase().replaceAll(" ", "-") as Audience,
        slideCount: Number(slideCount) as SlideCount,
        style: style.toLowerCase() as PresentationTheme,
        instructions: instructions || null,
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URI}/api/presentations/generate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(request),
        },
      );

      const responseText = await response.text();

      if (!response.ok) {
        let errorMessage = responseText;

        try {
          const errorData = JSON.parse(responseText);

          if (errorData.detail) {
            errorMessage = errorData.detail;
          }
        } catch {
          // Server response wasn't JSON.
        }

        throw new Error(
          `Presentation generation failed (${response.status} ${response.statusText}): ${
            errorMessage || "No error details were provided by the server."
          }`,
        );
      }

      const presentation: Presentation = JSON.parse(responseText);

      setPresentation(presentation);
      router.push("/editor");
    } catch (error) {
      if (error instanceof Error) {
        console.error("Failed to generate presentation:", error.message);
      } else {
        console.error("Failed to generate presentation:", error);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <Label htmlFor="topic">Topic</Label>
          <Input
            id="topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Introduction to Cybersecurity"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Explain common cyber attacks, their impact, and how students can protect themselves."
            rows={4}
          />
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-3">
        <div className="flex flex-col gap-2">
          <Label htmlFor="audience">Audience</Label>
          <Select
            value={audience}
            onValueChange={(value) => setAudience(value ?? "")}
          >
            <SelectTrigger id="audience">
              <SelectValue placeholder="Select audience" />
            </SelectTrigger>
            <SelectContent>
              {AUDIENCES.map((a) => (
                <SelectItem key={a} value={a}>
                  {a}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="slideCount">Number of Slides</Label>
          <Select
            value={slideCount}
            onValueChange={(value) => setSlideCount(value ?? "")}
          >
            <SelectTrigger id="slideCount">
              <SelectValue placeholder="Select slide count" />
            </SelectTrigger>
            <SelectContent>
              {SLIDE_COUNTS.map((count) => (
                <SelectItem key={count} value={count}>
                  {count}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="style">Presentation Style</Label>
          <Select
            value={style}
            onValueChange={(value) => setStyle(value ?? "")}
          >
            <SelectTrigger id="style">
              <SelectValue placeholder="Select style" />
            </SelectTrigger>
            <SelectContent>
              {STYLES.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="instructions">
          Additional Instructions{" "}
          <span className="font-normal text-muted">(optional)</span>
        </Label>
        <Textarea
          id="instructions"
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          placeholder="Focus more on practical examples and keep the language simple."
          rows={3}
        />
      </div>

      <div className="flex flex-col gap-2 border-t border-line pt-6">
        <Button type="submit" size="lg" className="w-full sm:w-fit">
          Generate Presentation
        </Button>
      </div>
    </form>
  );
}
