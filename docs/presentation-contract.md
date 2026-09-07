# Presentation Contract

Version: 1.0

This document is the source of truth for the data exchanged between the
Next.js frontend and FastAPI backend.

The contract contains two main schemas:

1. `GenerationRequest` — what the frontend sends to the backend when the user
   asks AI to create a presentation.
2. `Presentation` — the structured presentation returned by the backend and
   consumed by the frontend editor/renderer.

The JSON field names in this contract use camelCase.

---

## 1. GenerationRequest

`GenerationRequest` represents the user's presentation requirements.

It is sent from the Next.js frontend to the FastAPI backend.

### JSON shape

```json
{
  "topic": "Introduction to Cybersecurity",
  "description": "Explain common cyber attacks and how students can protect themselves.",
  "audience": "college-students",
  "slideCount": 8,
  "style": "modern",
  "instructions": "Use practical examples."
}
```

### Fields

| Field | Type | Required | Description |
|---|---|---|---|
| `topic` | string | Yes | Main subject of the presentation. |
| `description` | string | Yes | Basic content or requirements supplied by the user. |
| `audience` | `Audience` | Yes | Intended audience. |
| `slideCount` | integer | Yes | Requested number of slides. |
| `style` | `PresentationTheme` | Yes | Visual style requested by the user. |
| `instructions` | string | No | Additional instructions from the user. |

### Audience

The MVP supports these values:

```text
general
school-students
college-students
professionals
business-executives
```

### Presentation style

The MVP supports these values:

```text
modern
professional
minimal
academic
creative
```

### Slide count

The frontend currently offers:

```text
5
8
10
12
15
```

The backend should validate that the requested slide count is within the
supported range.

---

# 2. Presentation

`Presentation` represents the generated presentation.

It is returned by FastAPI and consumed by Next.js.

### JSON shape

```json
{
  "title": "Introduction to Cybersecurity",
  "theme": "modern",
  "slides": [
    {
      "type": "title",
      "title": "Introduction to Cybersecurity",
      "subtitle": "Understanding threats and staying safe online"
    },
    {
      "type": "content",
      "title": "What is Cybersecurity?",
      "bullets": [
        "Protects computer systems and networks",
        "Prevents unauthorized access",
        "Protects sensitive information"
      ]
    }
  ]
}
```

### Fields

| Field | Type | Required | Description |
|---|---|---|---|
| `title` | string | Yes | Title of the presentation. |
| `theme` | `PresentationTheme` | Yes | Theme used to render the presentation. |
| `slides` | `Slide[]` | Yes | Ordered list of slides. |

---

# 3. Presentation rules

The following rules apply to every generated presentation:

1. `slides` must contain the requested number of slides.
2. The first slide must always have `type: "title"`.
3. Remaining slides may use any supported non-title layout.
4. Slide types must be one of the four layouts defined below.
5. The LLM controls content and slide selection, but does not generate HTML,
   CSS, React code, or arbitrary positioning instructions.
6. The frontend owns the actual visual implementation of each slide layout.
7. Themes are predefined by the frontend. The LLM selects a theme but does not
   invent arbitrary colors, fonts, or CSS.
8. Content should remain concise enough to fit the selected layout.

---

# 4. Slide types

The MVP supports exactly four slide layouts:

```text
title
content
two-column
image-content
```

These are discriminated by the `type` field.

---

## 4.1 Title Slide

Used for the opening slide.

### JSON shape

```json
{
  "type": "title",
  "title": "Introduction to Cybersecurity",
  "subtitle": "Understanding threats and staying safe online"
}
```

### Fields

| Field | Type | Required |
|---|---|---|
| `type` | `"title"` | Yes |
| `title` | string | Yes |
| `subtitle` | string | No |

---

## 4.2 Content Slide

The general-purpose text slide.

### JSON shape

```json
{
  "type": "content",
  "title": "What is Cybersecurity?",
  "bullets": [
    "Protects computer systems and networks",
    "Prevents unauthorized access",
    "Protects sensitive information"
  ]
}
```

### Fields

| Field | Type | Required |
|---|---|---|
| `type` | `"content"` | Yes |
| `title` | string | Yes |
| `bullets` | string[] | Yes |

Guideline: prefer approximately 2–5 concise bullets.

---

## 4.3 Two-Column Slide

Used when content naturally divides into two related groups.

### JSON shape

```json
{
  "type": "two-column",
  "title": "Types of Cyber Attacks",
  "left": {
    "heading": "Social Engineering",
    "bullets": [
      "Phishing",
      "Baiting",
      "Pretexting"
    ]
  },
  "right": {
    "heading": "Technical Attacks",
    "bullets": [
      "Malware",
      "DDoS",
      "SQL Injection"
    ]
  }
}
```

### Fields

| Field | Type | Required |
|---|---|---|
| `type` | `"two-column"` | Yes |
| `title` | string | Yes |
| `left` | `Column` | Yes |
| `right` | `Column` | Yes |

### Column

```json
{
  "heading": "Social Engineering",
  "bullets": [
    "Phishing",
    "Baiting",
    "Pretexting"
  ]
}
```

| Field | Type | Required |
|---|---|---|
| `heading` | string | Yes |
| `bullets` | string[] | Yes |

Guideline: keep each column concise, preferably around 2–4 bullets.

---

## 4.4 Image-Content Slide

Used when a visual would meaningfully support the content.

### JSON shape

```json
{
  "type": "image-content",
  "title": "The Cybersecurity Landscape",
  "image": {
    "prompt": "A futuristic visualization of interconnected computer networks",
    "alt": "Illustration of interconnected computers representing a cybersecurity network",
    "url": null
  },
  "bullets": [
    "Connected devices increase the attack surface",
    "Modern attacks are increasingly sophisticated"
  ]
}
```

### Fields

| Field | Type | Required |
|---|---|---|
| `type` | `"image-content"` | Yes |
| `title` | string | Yes |
| `image` | `Image` | Yes |
| `bullets` | string[] | Yes |

### Image

| Field | Type | Required | Description |
|---|---|---|---|
| `prompt` | string | Yes | Description that can be used to generate/find the image. |
| `alt` | string | Yes | Accessibility description of the intended image. |
| `url` | string or null | Yes | Actual image URL. May be `null` before image generation/retrieval. |

The image-generation provider is intentionally not part of this contract.
The backend may later use a provider to turn `prompt` into an image and fill
`url`.

---

# 5. What is intentionally NOT part of the MVP contract

The following are explicitly out of scope for version 1:

- Speaker notes
- Charts and graphs
- Tables/data visualizations
- Audio
- Video
- Slide animations and transitions
- Arbitrary element positioning
- Arbitrary per-slide CSS
- Arbitrary fonts and colors generated by the LLM
- User/account IDs
- Database IDs
- Timestamps
- Persistence metadata

These can be added in a later contract version if the project requires them.

---

# 6. Responsibility boundary

The LLM generates:

- Presentation title
- Slide content
- Slide order
- Slide type selection
- Theme selection
- Image descriptions/prompts

The frontend controls:

- Actual slide layout
- Typography
- Colors
- Spacing
- Components
- Theme implementation
- Editing interactions
- Rendering

The backend controls:

- Request validation
- LLM interaction
- Structured output validation
- Presentation generation
- Later: image generation/retrieval and export processing

The LLM must never be asked to generate frontend code or arbitrary visual
instructions as part of the presentation JSON.

---

# 7. API direction

The intended flow is:

```text
Next.js
   |
   | GenerationRequest
   | POST /generate
   v
FastAPI
   |
   | LLM
   v
Presentation
   |
   | JSON response
   v
Next.js
```

The exact HTTP endpoint details may evolve, but the data structures defined
above are the source of truth for the request and response payloads.
