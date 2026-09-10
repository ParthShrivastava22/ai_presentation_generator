"""
Presentation generation service.

Responsible for:
- constructing the LLM messages/prompt for a GenerationRequest
- calling OpenRouter via the OpenAI SDK
- parsing the model's JSON response
- validating the generated content
- constructing the canonical Presentation contract

This module deliberately does NOT touch FastAPI.
It raises plain Python exceptions; the route layer translates
those into HTTP errors.
"""

import json
import os
from typing import Annotated, List, Literal, Optional, Union

from pydantic import BaseModel, ConfigDict, Field

from dotenv import load_dotenv
from openai import OpenAI

from app.schemas.presentation import (
    Column,
    ContentSlide,
    GenerationRequest,
    Image,
    ImageContentSlide,
    Presentation,
    TitleSlide,
    TwoColumnSlide,
)


load_dotenv()


OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1"
OPENROUTER_MODEL = "minimax/minimax-m3:free"


# ---------------------------------------------------------------------------
# Errors
# ---------------------------------------------------------------------------

class GenerationError(Exception):
    """Base class for all presentation-generation failures."""


class ConfigurationError(GenerationError):
    """Raised when required configuration is missing."""


class OpenRouterError(GenerationError):
    """Raised when the OpenRouter request fails."""


class InvalidGenerationOutputError(GenerationError):
    """Raised when the model returns invalid or unusable content."""


# ---------------------------------------------------------------------------
# AI-only output models
# ---------------------------------------------------------------------------

class GeneratedColumn(BaseModel):
    model_config = ConfigDict(extra="ignore")

    heading: str
    bullets: List[str]


class GeneratedImage(BaseModel):
    model_config = ConfigDict(extra="ignore")

    prompt: str
    alt: str


class GeneratedTitleSlide(BaseModel):
    model_config = ConfigDict(extra="ignore")

    type: Literal["title"]
    title: str
    subtitle: Optional[str] = None


class GeneratedContentSlide(BaseModel):
    model_config = ConfigDict(extra="ignore")

    type: Literal["content"]
    title: str
    bullets: List[str]


class GeneratedTwoColumnSlide(BaseModel):
    model_config = ConfigDict(extra="ignore")

    type: Literal["two-column"]
    title: str
    left: GeneratedColumn
    right: GeneratedColumn


class GeneratedImageContentSlide(BaseModel):
    model_config = ConfigDict(extra="ignore")

    type: Literal["image-content"]
    title: str
    image: GeneratedImage
    bullets: List[str]


GeneratedSlide = Annotated[
    Union[
        GeneratedTitleSlide,
        GeneratedContentSlide,
        GeneratedTwoColumnSlide,
        GeneratedImageContentSlide,
    ],
    Field(discriminator="type"),
]


class GeneratedPresentationContent(BaseModel):
    model_config = ConfigDict(extra="ignore")

    slides: List[GeneratedSlide]
# ---------------------------------------------------------------------------
# Client
# ---------------------------------------------------------------------------

def _get_client() -> OpenAI:
    api_key = os.getenv("OPENROUTER_API_KEY")

    if not api_key:
        raise ConfigurationError(
            "OPENROUTER_API_KEY is not set"
        )

    return OpenAI(
        base_url=OPENROUTER_BASE_URL,
        api_key=api_key,
        timeout=60.0,
    )


# ---------------------------------------------------------------------------
# Slide planning
# ---------------------------------------------------------------------------

def _build_slide_plan(request: GenerationRequest) -> list[dict]:
    """
    Build the slide structure controlled by the application.

    The planner uses the user's request to choose layouts that are
    appropriate for the topic while keeping the structure deterministic.

    Slide 1 is always a title slide.
    Remaining slides may use content, two-column, or image-content layouts.
    """

    text = " ".join(
        [
            request.topic,
            request.description,
            request.instructions or "",
        ]
    ).lower()

    slide_count = request.slide_count

    # Signals that a comparison-oriented slide may be useful.
    comparison_signals = [
    "compare",
    "compared",
    "comparing",
    "comparison",
    "versus",
    " vs ",
    "difference",
    "differences",
    "traditional vs",
    "traditional and ai-assisted",
    "pros and cons",
    "advantages and disadvantages",
    "before and after",
    "old vs new",
]

    # Signals that a visual/conceptual slide may be useful.
    visual_signals = [
        "history",
        "evolution",
        "process",
        "workflow",
        "architecture",
        "lifecycle",
        "how it works",
        "applications",
        "use cases",
        "components",
        "stages",
    ]

    wants_comparison = any(signal in text for signal in comparison_signals)
    wants_visual = any(signal in text for signal in visual_signals)

    # Start with the title slide.
    slide_plan = [
        {
            "slideNumber": 1,
            "type": "title",
            "purpose": "Introduce the presentation topic.",
        }
    ]

    # Available positions after the title slide.
    remaining_positions = list(range(2, slide_count + 1))

    # Reserve at most one comparison slide when the request suggests one.
    comparison_position = None

    if wants_comparison and remaining_positions:
        # Put comparison slightly after the introduction.
        comparison_index = min(2, len(remaining_positions) - 1)
        comparison_position = remaining_positions[comparison_index]

    # Reserve at most one visual slide when the request suggests one.
    visual_position = None

    if wants_visual:
        available_for_visual = [
            position
            for position in remaining_positions
            if position != comparison_position
        ]

        if available_for_visual:
            # Place the visual slide roughly in the middle.
            visual_position = available_for_visual[
                len(available_for_visual) // 2
            ]

    for slide_number in remaining_positions:
        if slide_number == comparison_position:
            slide_type = "two-column"
            purpose = (
                "Present a meaningful comparison, contrast, "
                "or two-sided view of the topic."
            )
        elif slide_number == visual_position:
            slide_type = "image-content"
            purpose = (
                "Explain an important concept using a visual "
                "alongside concise supporting points."
            )
        else:
            slide_type = "content"
            purpose = (
                "Explain an important aspect of the topic "
                "that contributes to the overall presentation."
            )

        slide_plan.append(
            {
                "slideNumber": slide_number,
                "type": slide_type,
                "purpose": purpose,
            }
        )

    return slide_plan

# ---------------------------------------------------------------------------
# Prompt construction
# ---------------------------------------------------------------------------

_SYSTEM_PROMPT = """
You generate presentation content for Slate.

The application has already decided:
- the number of slides
- the order of slides
- the type of every slide
- the presentation theme

You must NOT choose or change any slide type.

IMPORTANT OUTPUT FORMAT:

Do not wrap slide fields inside a "content" object.

Each slide must contain its fields directly.

For example, a content slide MUST look like:
{
  "type": "content",
  "title": "Slide title",
  "bullets": ["...", "..."]
}

NOT:
{
  "type": "content",
  "content": {
    "title": "Slide title",
    "bullets": ["...", "..."]
  }
}

Do not include slideNumber.
Do not include any fields that are not defined by the required structure.

A slide plan will be provided. For every slide, copy the
provided slide type exactly and generate content appropriate
for that structure.

Slide types:

1. title
- Provide a presentation title.
- Provide a concise subtitle.
- Do not include bullets.

2. content
- Provide a clear slide title.
- Provide 2 to 5 concise bullets.
- Each bullet should communicate one useful idea.

3. two-column
- Provide a clear slide title.
- Provide a meaningful heading for the left column.
- Provide 2 to 5 bullets for the left column.
- Provide a meaningful heading for the right column.
- Provide 2 to 5 bullets for the right column.
- The two columns should represent a meaningful comparison,
  contrast, categories, stages, or other two-sided structure.

4. image-content
- Provide a clear slide title.
- Provide 2 to 5 concise bullets.
- Provide an image prompt describing a useful visual for this slide.
- Provide concise alternative text for the image.
- Do not provide an image URL.

A two-column slide MUST look like:
{
  "type": "two-column",
  "title": "Comparison",
  "left": {
    "heading": "Traditional Development",
    "bullets": ["...", "..."]
  },
  "right": {
    "heading": "AI-Assisted Development",
    "bullets": ["...", "..."]
  }
}

An image-content slide MUST look like:
{
  "type": "image-content",
  "title": "Development Workflow",
  "image": {
    "prompt": "...",
    "alt": "..."
  },
  "bullets": ["...", "..."]
}

Content should be accurate, relevant to the requested audience,
and concise enough to fit naturally on a presentation slide.

Return JSON only.
"""


def _build_messages(
    request: GenerationRequest,
    slide_plan: list[dict],
) -> list[dict]:

    request_payload = request.model_dump(by_alias=True)

    user_prompt = f"""
Create presentation content for the following request:

{json.dumps(request_payload, indent=2)}

The application has already created the following slide plan:

{json.dumps(slide_plan, indent=2)}

Generate content for every slide in this exact order.
"""

    return [
        {
            "role": "system",
            "content": _SYSTEM_PROMPT,
        },
        {
            "role": "user",
            "content": user_prompt,
        },
    ]


# ---------------------------------------------------------------------------
# AI response schema
# ---------------------------------------------------------------------------
def _build_content_json_schema(slide_count: int) -> dict:
    return {
        "name": "presentation_content",
        "strict": True,
        "schema": {
            "type": "object",
            "additionalProperties": False,
            "properties": {
                "slides": {
                    "type": "array",
                    "items": {
                        "oneOf": [
                            {
                                "type": "object",
                                "additionalProperties": False,
                                "properties": {
                                    "type": {
                                        "type": "string",
                                        "enum": ["title"],
                                    },
                                    "title": {
                                        "type": "string",
                                    },
                                    "subtitle": {
                                        "type": ["string", "null"],
                                    },
                                },
                                "required": [
                                    "type",
                                    "title",
                                    "subtitle",
                                ],
                            },
                            {
                                "type": "object",
                                "additionalProperties": False,
                                "properties": {
                                    "type": {
                                        "type": "string",
                                        "enum": ["content"],
                                    },
                                    "title": {
                                        "type": "string",
                                    },
                                    "bullets": {
                                        "type": "array",
                                        "items": {
                                            "type": "string",
                                        },
                                        "minItems": 2,
                                        "maxItems": 5,
                                    },
                                },
                                "required": [
                                    "type",
                                    "title",
                                    "bullets",
                                ],
                            },
                            {
                                "type": "object",
                                "additionalProperties": False,
                                "properties": {
                                    "type": {
                                        "type": "string",
                                        "enum": ["two-column"],
                                    },
                                    "title": {
                                        "type": "string",
                                    },
                                    "left": {
                                        "type": "object",
                                        "additionalProperties": False,
                                        "properties": {
                                            "heading": {
                                                "type": "string",
                                            },
                                            "bullets": {
                                                "type": "array",
                                                "items": {
                                                    "type": "string",
                                                },
                                                "minItems": 2,
                                                "maxItems": 5,
                                            },
                                        },
                                        "required": [
                                            "heading",
                                            "bullets",
                                        ],
                                    },
                                    "right": {
                                        "type": "object",
                                        "additionalProperties": False,
                                        "properties": {
                                            "heading": {
                                                "type": "string",
                                            },
                                            "bullets": {
                                                "type": "array",
                                                "items": {
                                                    "type": "string",
                                                },
                                                "minItems": 2,
                                                "maxItems": 5,
                                            },
                                        },
                                        "required": [
                                            "heading",
                                            "bullets",
                                        ],
                                    },
                                },
                                "required": [
                                    "type",
                                    "title",
                                    "left",
                                    "right",
                                ],
                            },
                            {
                                "type": "object",
                                "additionalProperties": False,
                                "properties": {
                                    "type": {
                                        "type": "string",
                                        "enum": ["image-content"],
                                    },
                                    "title": {
                                        "type": "string",
                                    },
                                    "image": {
                                        "type": "object",
                                        "additionalProperties": False,
                                        "properties": {
                                            "prompt": {
                                                "type": "string",
                                            },
                                            "alt": {
                                                "type": "string",
                                            },
                                        },
                                        "required": [
                                            "prompt",
                                            "alt",
                                        ],
                                    },
                                    "bullets": {
                                        "type": "array",
                                        "items": {
                                            "type": "string",
                                        },
                                        "minItems": 2,
                                        "maxItems": 5,
                                    },
                                },
                                "required": [
                                    "type",
                                    "title",
                                    "image",
                                    "bullets",
                                ],
                            },
                        ]
                    },
                }
            },
            "required": ["slides"],
        },
    }

# ---------------------------------------------------------------------------
# AI response validation
# ---------------------------------------------------------------------------

def _validate_generated_content(
    raw_content: dict,
    request: GenerationRequest,
) -> GeneratedPresentationContent:
    """
    Validate and parse the raw AI response.

    The AI is allowed to return the slides either directly as
    a list or inside a {"slides": [...]} object. Normalize the
    outer structure before validating the generated slide data.
    """

    if isinstance(raw_content, list):
        raw_content = {"slides": raw_content}

    if not isinstance(raw_content, dict):
        raise InvalidGenerationOutputError(
            "OpenRouter response must be a JSON object or array."
        )

    try:
        generated = GeneratedPresentationContent.model_validate(
            raw_content
        )
    except Exception as exc:
        raise InvalidGenerationOutputError(
            f"Generated presentation content has invalid structure: {exc}"
        ) from exc

    slide_plan = _build_slide_plan(request)

    if len(generated.slides) != len(slide_plan):
        raise InvalidGenerationOutputError(
            f"Expected {len(slide_plan)} slides, "
            f"but received {len(generated.slides)}."
        )

    for index, (slide, planned_slide) in enumerate(
        zip(generated.slides, slide_plan),
        start=1,
    ):
        expected_type = planned_slide["type"]

        if slide.type != expected_type:
            raise InvalidGenerationOutputError(
                f"Slide {index} has type '{slide.type}', "
                f"but the application planned '{expected_type}'."
            )

        if not slide.title.strip():
            raise InvalidGenerationOutputError(
                f"Slide {index} must have a non-empty title."
            )

        if slide.type == "title":
            if (
                slide.subtitle is not None
                and not slide.subtitle.strip()
            ):
                raise InvalidGenerationOutputError(
                    f"Slide {index} has an empty subtitle."
                )

        elif slide.type == "content":
            _validate_bullets(
                slide.bullets,
                slide_number=index,
                location="slide",
            )

        elif slide.type == "two-column":
            if not slide.left.heading.strip():
                raise InvalidGenerationOutputError(
                    f"Slide {index} left column must have a heading."
                )

            if not slide.right.heading.strip():
                raise InvalidGenerationOutputError(
                    f"Slide {index} right column must have a heading."
                )

            _validate_bullets(
                slide.left.bullets,
                slide_number=index,
                location="left column",
            )

            _validate_bullets(
                slide.right.bullets,
                slide_number=index,
                location="right column",
            )

        elif slide.type == "image-content":
            if not slide.image.prompt.strip():
                raise InvalidGenerationOutputError(
                    f"Slide {index} image prompt must not be empty."
                )

            if not slide.image.alt.strip():
                raise InvalidGenerationOutputError(
                    f"Slide {index} image alt text must not be empty."
                )

            _validate_bullets(
                slide.bullets,
                slide_number=index,
                location="slide",
            )

    return generated

def _validate_bullets(
    bullets: List[str],
    slide_number: int,
    location: str,
) -> None:
    if not 2 <= len(bullets) <= 5:
        raise ValueError(
            f"Slide {slide_number} {location} must have "
            f"between 2 and 5 bullets."
        )

    for bullet in bullets:
        if not bullet.strip():
            raise ValueError(
                f"Slide {slide_number} {location} contains "
                f"an empty bullet."
            )

# ---------------------------------------------------------------------------
# Canonical Presentation construction
# ---------------------------------------------------------------------------

def _build_presentation(
    request: GenerationRequest,
    generated: GeneratedPresentationContent,
) -> Presentation:
    slides = []

    for slide in generated.slides:
        if slide.type == "title":
            slides.append(
                TitleSlide(
                    type="title",
                    title=slide.title,
                    subtitle=slide.subtitle,
                )
            )

        elif slide.type == "content":
            slides.append(
                ContentSlide(
                    type="content",
                    title=slide.title,
                    bullets=slide.bullets,
                )
            )

        elif slide.type == "two-column":
            slides.append(
                TwoColumnSlide(
                    type="two-column",
                    title=slide.title,
                    left=Column(
                        heading=slide.left.heading,
                        bullets=slide.left.bullets,
                    ),
                    right=Column(
                        heading=slide.right.heading,
                        bullets=slide.right.bullets,
                    ),
                )
            )

        elif slide.type == "image-content":
            slides.append(
                ImageContentSlide(
                    type="image-content",
                    title=slide.title,
                    image=Image(
                        prompt=slide.image.prompt,
                        alt=slide.image.alt,
                        url=None,
                    ),
                    bullets=slide.bullets,
                )
            )

        else:
            raise ValueError(
                f"Unsupported generated slide type: {slide.type}"
            )

    return Presentation(
        title=slides[0].title,
        theme=request.style,
        slides=slides,
    )

# ---------------------------------------------------------------------------
# Public entry point
# ---------------------------------------------------------------------------

def generate_presentation(
    request: GenerationRequest,
) -> Presentation:
    """
    Generate a Presentation from a GenerationRequest.

    FastAPI controls the presentation structure.
    The AI generates only the content.

    Raises:
        ConfigurationError:
            Missing OPENROUTER_API_KEY.

        OpenRouterError:
            OpenRouter request failed.

        InvalidGenerationOutputError:
            AI response was invalid or unusable.
    """

    client = _get_client()

    # 1. Application decides the structure.
    slide_plan = _build_slide_plan(request)

    # 2. Tell the AI what content to generate.
    messages = _build_messages(
        request,
        slide_plan,
    )

    # 3. Give the AI a simple content-only schema.
    schema = _build_content_json_schema(
        request.slide_count
    )

    try:
        response = client.chat.completions.create(
            model=OPENROUTER_MODEL,
            messages=messages,
            response_format={
                "type": "json_schema",
                "json_schema": {
                    "name": "presentation_content",
                    "strict": True,
                    "schema": schema,
                },
            },
        )

    except Exception as exc:
        print("OPENROUTER ERROR:", repr(exc))
        raise OpenRouterError(
            f"OpenRouter request failed: {exc}"
        ) from exc

    # 4. Extract model response.
    content = response.choices[0].message.content

    if not content:
        raise InvalidGenerationOutputError(
            "OpenRouter returned an empty response"
        )

    # 5. Parse JSON.
    try:
        raw_content = json.loads(content)
    except json.JSONDecodeError as exc:
        raise InvalidGenerationOutputError(
            f"OpenRouter response was not valid JSON: {exc}"
        ) from exc

    # 6. Validate AI-specific output.
    generated = _validate_generated_content(
        raw_content,
        request,
    )

    # 7. Construct the canonical Presentation ourselves.
    return _build_presentation(
        request,
        generated,
    )