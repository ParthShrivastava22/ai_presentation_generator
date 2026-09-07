import pptxgen from "pptxgenjs";
import type { Presentation } from "@/types/presentation";

interface PptxTheme {
  background: string;
  ink: string;
  body: string;
  accent: string;
  muted: string;

  font: string;

  divider: string;
  surface: string;
  surfaceBorder: string;
  markerBackground: string;

  titleFontSize: number;
  bodyFontSize: number;
  columnBodyFontSize: number;

  useAccentBar: boolean;
  useCards: boolean;

  bulletStyle: "numbered" | "dash" | "dot";
}

const MODERN: PptxTheme = {
  background: "FFFFFF",
  ink: "111111",
  body: "3F4650",
  accent: "2563EB",
  muted: "64748B",

  font: "Aptos",

  divider: "E2E8F0",
  surface: "F8FAFC",
  surfaceBorder: "E2E8F0",
  markerBackground: "EFF6FF",

  titleFontSize: 28,
  bodyFontSize: 19,
  columnBodyFontSize: 15,

  useAccentBar: true,
  useCards: true,

  bulletStyle: "numbered",
};

const PROFESSIONAL: PptxTheme = {
  background: "FFFFFF",
  ink: "172033",
  body: "3B4658",
  accent: "1E3A5F",
  muted: "64748B",

  font: "Aptos",

  divider: "CBD5E1",
  surface: "F8FAFC",
  surfaceBorder: "CBD5E1",
  markerBackground: "E2E8F0",

  titleFontSize: 28,
  bodyFontSize: 18,
  columnBodyFontSize: 14,

  useAccentBar: true,
  useCards: true,

  bulletStyle: "dash",
};

const MINIMAL: PptxTheme = {
  background: "FFFFFF",
  ink: "18181B",
  body: "52525B",
  accent: "52525B",
  muted: "A1A1AA",

  font: "Aptos",

  divider: "E4E4E7",
  surface: "FAFAFA",
  surfaceBorder: "E4E4E7",
  markerBackground: "F4F4F5",

  titleFontSize: 28,
  bodyFontSize: 18,
  columnBodyFontSize: 14,

  useAccentBar: false,
  useCards: false,

  bulletStyle: "dot",
};

const ACADEMIC: PptxTheme = {
  background: "FDFCF8",
  ink: "27272A",
  body: "52525B",
  accent: "334E68",
  muted: "7C8794",

  font: "Georgia",

  divider: "D6D3D1",
  surface: "F5F3EE",
  surfaceBorder: "D6D3D1",
  markerBackground: "E7E5E4",

  titleFontSize: 27,
  bodyFontSize: 18,
  columnBodyFontSize: 14,

  useAccentBar: false,
  useCards: true,

  bulletStyle: "numbered",
};

const CREATIVE: PptxTheme = {
  background: "18181B",
  ink: "FAFAFA",
  body: "D4D4D8",
  accent: "F59E0B",
  muted: "A1A1AA",

  font: "Aptos",

  divider: "3F3F46",
  surface: "27272A",
  surfaceBorder: "3F3F46",
  markerBackground: "3F3F46",

  titleFontSize: 30,
  bodyFontSize: 18,
  columnBodyFontSize: 14,

  useAccentBar: true,
  useCards: true,

  bulletStyle: "dot",
};

function addAccentBar(slide: pptxgen.Slide, pptx: pptxgen, theme: PptxTheme) {
  if (!theme.useAccentBar) {
    return;
  }

  slide.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 0,
    w: 0.12,
    h: 7.5,
    line: {
      color: theme.accent,
      transparency: 100,
    },
    fill: {
      color: theme.accent,
    },
  });
}

function addFooter(slide: pptxgen.Slide, theme: PptxTheme) {
  slide.addText("SLATE", {
    x: 11.35,
    y: 7.05,
    w: 1,
    h: 0.2,
    fontFace: theme.font,
    fontSize: 8,
    bold: true,
    color: theme.muted,
    align: "right",
    margin: 0,
  });
}

function addSlideTitle(
  slide: pptxgen.Slide,
  presentationSlide: {
    title: string;
  },
  theme: PptxTheme,
) {
  slide.addText(presentationSlide.title, {
    x: 0.75,
    y: 0.65,
    w: 11.8,
    h: 0.75,
    fontFace: theme.font,
    fontSize: theme.titleFontSize,
    bold: true,
    color: theme.ink,
    margin: 0,
    fit: "shrink",
  });
}

function addDivider(slide: pptxgen.Slide, pptx: pptxgen, theme: PptxTheme) {
  slide.addShape(pptx.ShapeType.line, {
    x: 0.75,
    y: 1.55,
    w: 11.5,
    h: 0,
    line: {
      color: theme.divider,
      width: 1,
    },
  });
}

function addBulletMarker(
  slide: pptxgen.Slide,
  pptx: pptxgen,
  index: number,
  x: number,
  y: number,
  theme: PptxTheme,
  size = 0.38,
) {
  if (theme.bulletStyle === "numbered") {
    slide.addShape(pptx.ShapeType.ellipse, {
      x,
      y: y + 0.03,
      w: size,
      h: size,
      line: {
        color: theme.accent,
        transparency: 100,
      },
      fill: {
        color: theme.markerBackground,
      },
    });

    slide.addText(String(index + 1), {
      x,
      y: y + size * 0.22,
      w: size,
      h: size * 0.55,
      fontFace: theme.font,
      fontSize: size <= 0.3 ? 8 : 10,
      bold: true,
      color: theme.accent,
      align: "center",
      margin: 0,
    });

    return;
  }

  const marker = theme.bulletStyle === "dash" ? "—" : "•";

  slide.addText(marker, {
    x,
    y: y - 0.01,
    w: size,
    h: size,
    fontFace: theme.font,
    fontSize: theme.bulletStyle === "dash" ? 14 : 12,
    bold: theme.bulletStyle === "dash",
    color: theme.accent,
    margin: 0,
    align: "center",
    valign: "middle",
  });
}

function addTitleSlide(
  pptx: pptxgen,
  presentationSlide: Extract<Presentation["slides"][number], { type: "title" }>,
  theme: PptxTheme,
) {
  const slide = pptx.addSlide();

  slide.background = {
    color: theme.background,
  };

  addAccentBar(slide, pptx, theme);

  slide.addText(presentationSlide.title, {
    x: 0.85,
    y: 2.15,
    w: 10.8,
    h: 1.35,
    fontFace: theme.font,
    fontSize: 38,
    bold: true,
    color: theme.ink,
    margin: 0,
    valign: "middle",
    fit: "shrink",
  });

  if (presentationSlide.subtitle) {
    slide.addText(presentationSlide.subtitle, {
      x: 0.9,
      y: 3.7,
      w: 9.8,
      h: 0.75,
      fontFace: theme.font,
      fontSize: 18,
      color: theme.muted,
      margin: 0,
      fit: "shrink",
    });
  }

  slide.addShape(pptx.ShapeType.line, {
    x: 0.9,
    y: 5.05,
    w: 1.0,
    h: 0,
    line: {
      color: theme.accent,
      width: 2.5,
    },
  });

  addFooter(slide, theme);

  return slide;
}

function addContentSlide(
  pptx: pptxgen,
  presentationSlide: Extract<
    Presentation["slides"][number],
    { type: "content" }
  >,
  theme: PptxTheme,
) {
  const slide = pptx.addSlide();

  slide.background = {
    color: theme.background,
  };

  addAccentBar(slide, pptx, theme);
  addSlideTitle(slide, presentationSlide, theme);
  addDivider(slide, pptx, theme);

  const startY = 2.0;
  const rowHeight = 0.82;

  presentationSlide.bullets.forEach((bullet, index) => {
    const y = startY + index * rowHeight;

    addBulletMarker(slide, pptx, index, 0.8, y, theme, 0.38);

    const textX = theme.bulletStyle === "numbered" ? 1.4 : 1.25;

    slide.addText(bullet, {
      x: textX,
      y,
      w: 10.8,
      h: 0.62,
      fontFace: theme.font,
      fontSize: theme.bodyFontSize,
      color: theme.body,
      margin: 0,
      valign: "middle",
      fit: "shrink",
      breakLine: false,
    });
  });

  addFooter(slide, theme);

  return slide;
}

function addTwoColumnSlide(
  pptx: pptxgen,
  presentationSlide: Extract<
    Presentation["slides"][number],
    { type: "two-column" }
  >,
  theme: PptxTheme,
) {
  const slide = pptx.addSlide();

  slide.background = {
    color: theme.background,
  };

  addAccentBar(slide, pptx, theme);
  addSlideTitle(slide, presentationSlide, theme);
  addDivider(slide, pptx, theme);

  const columnPositions = [
    {
      x: 0.75,
      data: presentationSlide.left,
    },
    {
      x: 6.65,
      data: presentationSlide.right,
    },
  ];

  if (theme.useCards) {
    for (const column of columnPositions) {
      slide.addShape(pptx.ShapeType.roundRect, {
        x: column.x,
        y: 1.9,
        w: 5.55,
        h: 4.55,
        rectRadius: 0.08,
        line: {
          color: theme.surfaceBorder,
          width: 1,
        },
        fill: {
          color: theme.surface,
        },
      });
    }
  }

  for (const column of columnPositions) {
    const contentX = theme.useCards ? column.x + 0.3 : column.x;

    slide.addText(column.data.heading, {
      x: contentX,
      y: 2.25,
      w: 4.95,
      h: 0.55,
      fontFace: theme.font,
      fontSize: 19,
      bold: true,
      color: theme.ink,
      margin: 0,
      fit: "shrink",
    });

    column.data.bullets.forEach((bullet, index) => {
      const y = 3.0 + index * 0.65;

      addBulletMarker(slide, pptx, index, contentX, y, theme, 0.3);

      const textX =
        theme.bulletStyle === "numbered" ? contentX + 0.45 : contentX + 0.35;

      slide.addText(bullet, {
        x: textX,
        y,
        w: 4.45,
        h: 0.5,
        fontFace: theme.font,
        fontSize: theme.columnBodyFontSize,
        color: theme.body,
        margin: 0,
        fit: "shrink",
      });
    });
  }

  addFooter(slide, theme);

  return slide;
}

function addImageContentSlide(
  pptx: pptxgen,
  presentationSlide: Extract<
    Presentation["slides"][number],
    { type: "image-content" }
  >,
  theme: PptxTheme,
) {
  const slide = pptx.addSlide();

  slide.background = {
    color: theme.background,
  };

  addAccentBar(slide, pptx, theme);
  addSlideTitle(slide, presentationSlide, theme);
  addDivider(slide, pptx, theme);

  if (presentationSlide.image.url) {
    slide.addImage({
      path: presentationSlide.image.url,
      x: 0.8,
      y: 2.0,
      w: 4.6,
      h: 3.9,
    });
  } else {
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 0.8,
      y: 2.0,
      w: 4.6,
      h: 3.9,
      rectRadius: 0.08,
      line: {
        color: theme.surfaceBorder,
        width: 1,
      },
      fill: {
        color: theme.surface,
      },
    });

    slide.addText("Image", {
      x: 1.5,
      y: 3.55,
      w: 3.2,
      h: 0.4,
      fontFace: theme.font,
      fontSize: 18,
      color: theme.muted,
      align: "center",
      margin: 0,
    });
  }

  presentationSlide.bullets.forEach((bullet, index) => {
    const y = 2.15 + index * 0.72;

    addBulletMarker(slide, pptx, index, 5.8, y, theme, 0.32);

    const textX = theme.bulletStyle === "numbered" ? 6.3 : 6.2;

    slide.addText(bullet, {
      x: textX,
      y,
      w: 5.55,
      h: 0.55,
      fontFace: theme.font,
      fontSize: 17,
      color: theme.body,
      margin: 0,
      fit: "shrink",
    });
  });

  addFooter(slide, theme);

  return slide;
}

export async function exportToPptx(presentation: Presentation): Promise<void> {
  const pptx = new pptxgen();

  pptx.layout = "LAYOUT_WIDE";
  pptx.author = "Slate";
  pptx.subject = presentation.title;
  pptx.title = presentation.title;

  let theme: PptxTheme;

  switch (presentation.theme) {
    case "modern":
      theme = MODERN;
      break;

    case "professional":
      theme = PROFESSIONAL;
      break;

    case "minimal":
      theme = MINIMAL;
      break;

    case "academic":
      theme = ACADEMIC;
      break;

    case "creative":
      theme = CREATIVE;
      break;

    default:
      theme = MODERN;
      break;
  }

  for (const slide of presentation.slides) {
    if (slide.type === "title") {
      addTitleSlide(pptx, slide, theme);
    }

    if (slide.type === "content") {
      addContentSlide(pptx, slide, theme);
    }

    if (slide.type === "two-column") {
      addTwoColumnSlide(pptx, slide, theme);
    }

    if (slide.type === "image-content") {
      addImageContentSlide(pptx, slide, theme);
    }
  }

  await pptx.writeFile({
    fileName: `${presentation.title}.pptx`,
  });
}
