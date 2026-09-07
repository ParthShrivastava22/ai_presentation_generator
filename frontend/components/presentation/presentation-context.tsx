"use client";

import { createContext, useContext, useState } from "react";
import type { Presentation } from "@/types/presentation";

interface PresentationContextValue {
  presentation: Presentation | null;
  setPresentation: (presentation: Presentation) => void;
  updatePresentation: (
    updater: (presentation: Presentation) => Presentation,
  ) => void;
}

const PresentationContext =
  createContext<PresentationContextValue | null>(null);

export function PresentationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [presentation, setPresentation] =
    useState<Presentation | null>(null);

  const updatePresentation = (
    updater: (presentation: Presentation) => Presentation,
  ) => {
    setPresentation((current) => {
      if (!current) {
        return current;
      }

      return updater(current);
    });
  };

  return (
    <PresentationContext.Provider
      value={{
        presentation,
        setPresentation,
        updatePresentation,
      }}
    >
      {children}
    </PresentationContext.Provider>
  );
}

export function usePresentation() {
  const context = useContext(PresentationContext);

  if (!context) {
    throw new Error(
      "usePresentation must be used inside a PresentationProvider",
    );
  }

  return context;
}