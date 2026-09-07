"""
Pydantic schemas for Slate's presentation data contract.

Source of truth: docs/presentation-contract.md (v1.0)

These models define:
- GenerationRequest: sent from Next.js -> FastAPI
- Presentation: returned by FastAPI -> Next.js (and used to validate
  OpenRouter's generated JSON)
"""

from typing import Annotated, List, Literal, Optional, Union

from pydantic import BaseModel, ConfigDict, Field
from pydantic.alias_generators import to_camel


# ---------------------------------------------------------------------------
# Shared base config: enables camelCase JSON in/out while keeping
# snake_case attribute names in Python.
# ---------------------------------------------------------------------------

class ContractModel(BaseModel):
    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
        extra="forbid",
    )


# ---------------------------------------------------------------------------
# Enums (modeled as Literals per the contract)
# ---------------------------------------------------------------------------

Audience = Literal[
    "general",
    "school-students",
    "college-students",
    "professionals",
    "business-executives",
]

PresentationTheme = Literal[
    "modern",
    "professional",
    "minimal",
    "academic",
    "creative",
]

# The frontend currently only offers these exact slide counts.
SlideCount = Literal[5, 8, 10, 12, 15]


# ---------------------------------------------------------------------------
# 1. GenerationRequest
# ---------------------------------------------------------------------------

class GenerationRequest(ContractModel):
    topic: str
    description: str
    audience: Audience
    slide_count: SlideCount
    style: PresentationTheme
    instructions: Optional[str] = None


# ---------------------------------------------------------------------------
# 2. Slide sub-components (Column, Image)
# ---------------------------------------------------------------------------

class Column(ContractModel):
    heading: str
    bullets: List[str]


class Image(ContractModel):
    prompt: str
    alt: str
    url: Optional[str] = None


# ---------------------------------------------------------------------------
# 3. Slide types (discriminated union on `type`)
# ---------------------------------------------------------------------------

class TitleSlide(ContractModel):
    type: Literal["title"]
    title: str
    subtitle: Optional[str] = None


class ContentSlide(ContractModel):
    type: Literal["content"]
    title: str
    bullets: List[str]


class TwoColumnSlide(ContractModel):
    type: Literal["two-column"]
    title: str
    left: Column
    right: Column


class ImageContentSlide(ContractModel):
    type: Literal["image-content"]
    title: str
    image: Image
    bullets: List[str]


Slide = Annotated[
    Union[
        TitleSlide,
        ContentSlide,
        TwoColumnSlide,
        ImageContentSlide,
    ],
    Field(discriminator="type"),
]


# ---------------------------------------------------------------------------
# 4. Presentation
# ---------------------------------------------------------------------------

class Presentation(ContractModel):
    title: str
    theme: PresentationTheme
    slides: List[Slide]