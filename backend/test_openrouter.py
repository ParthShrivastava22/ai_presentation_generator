import json
import os

from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

api_key = os.getenv("OPENROUTER_API_KEY")

if not api_key:
    raise ValueError("OPENROUTER_API_KEY is not set")

client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=api_key,
)

# ---------------------------------------------------------
# User's presentation request
# ---------------------------------------------------------

generation_request = {
    "topic": "The Evolution of Smartphones",
    "description": (
        "Explain how smartphones evolved from early mobile phones "
        "to modern devices and how they changed everyday life."
    ),
    "audience": "college-students",
    "slideCount": 8,
    "style": "modern",
    "instructions": (
        "Keep the presentation engaging and use real-world examples."
    ),
}

# ---------------------------------------------------------
# Backend-defined slide plan
#
# The AI does NOT decide the structure.
# FastAPI decides what each slide should be.
# ---------------------------------------------------------

slide_plan = [
    {
        "slideNumber": 1,
        "type": "title",
    },
    {
        "slideNumber": 2,
        "type": "content",
        "purpose": "Introduce the topic and explain the early history of mobile phones.",
    },
    {
        "slideNumber": 3,
        "type": "content",
        "purpose": "Explain how mobile phones developed into feature phones and early smartphones.",
    },
    {
        "slideNumber": 4,
        "type": "content",
        "purpose": "Explain the major changes introduced by the iPhone and app ecosystem.",
    },
    {
        "slideNumber": 5,
        "type": "content",
        "purpose": "Explain the rise of Android and competition in the smartphone market.",
    },
    {
        "slideNumber": 6,
        "type": "content",
        "purpose": "Describe important capabilities of modern smartphones.",
    },
    {
        "slideNumber": 7,
        "type": "content",
        "purpose": "Explain how smartphones changed everyday life.",
    },
    {
        "slideNumber": 8,
        "type": "content",
        "purpose": "Discuss future smartphone trends and conclude the presentation.",
    },
]

# ---------------------------------------------------------
# Simple AI output schema
#
# The AI only supplies content.
# It does NOT supply slide types.
# ---------------------------------------------------------

content_schema = {
    "type": "object",
    "properties": {
        "slides": {
            "type": "array",
            "minItems": 8,
            "maxItems": 8,
            "items": {
                "type": "object",
                "properties": {
                    "title": {
                        "type": "string"
                    },
                    "subtitle": {
                        "type": ["string", "null"]
                    },
                    "bullets": {
                        "type": "array",
                        "items": {
                            "type": "string"
                        },
                        "minItems": 0,
                        "maxItems": 5
                    }
                },
                "required": [
                    "title",
                    "subtitle",
                    "bullets"
                ],
                "additionalProperties": False
            }
        }
    },
    "required": [
        "slides"
    ],
    "additionalProperties": False
}

# ---------------------------------------------------------
# System prompt
# ---------------------------------------------------------

system_prompt = """
You generate content for a presentation.

The application has already decided the presentation structure.
You MUST NOT create, remove, reorder, or rename slides.

Generate content for each slide in the provided slide plan.

Rules:

- Return exactly one result for every slide in the slide plan.
- Preserve the slide order.
- Do not generate slide types.
- Do not generate themes.
- Do not generate slide numbers.
- Do not generate image URLs.
- Do not generate HTML, CSS, React, Markdown, or code.
- Use concise presentation-style language.
- Avoid paragraphs.
- Use 2-5 bullets for normal content slides.
- Bullets should normally be short and presentation-friendly.
- The title slide should contain a presentation title and a short subtitle.
- For the title slide, bullets should be an empty array.
- For normal content slides, subtitle should be null.
- Keep the content appropriate for the requested audience.
- Write everything in English unless another language is explicitly requested.
"""

# ---------------------------------------------------------
# User prompt
# ---------------------------------------------------------

user_prompt = f"""
Create content for this presentation.

Presentation request:

{json.dumps(generation_request, indent=2)}

The application has already created this slide plan:

{json.dumps(slide_plan, indent=2)}

Generate content for this exact slide plan.
"""

# ---------------------------------------------------------
# OpenRouter request
# ---------------------------------------------------------

response = client.chat.completions.create(
    model="minimax/minimax-m3:free",
    messages=[
        {
            "role": "system",
            "content": system_prompt,
        },
        {
            "role": "user",
            "content": user_prompt,
        },
    ],
    response_format={
        "type": "json_schema",
        "json_schema": {
            "name": "presentation_content",
            "strict": True,
            "schema": content_schema,
        },
    },
)

content = response.choices[0].message.content

print("\n--- RAW RESPONSE ---\n")
print(content)

# ---------------------------------------------------------
# Parse JSON
# ---------------------------------------------------------

print("\n--- PARSED JSON ---\n")

result = json.loads(content)

print(json.dumps(result, indent=2))

# ---------------------------------------------------------
# Basic validation
# ---------------------------------------------------------

print("\n--- BASIC VALIDATION ---")

print("Response type:", type(result).__name__)

if isinstance(result, dict):
    print("Top-level keys:", list(result.keys()))

    slides = result.get("slides", [])

    print("Number of slides:", len(slides))

    if slides:
        print("\nGenerated slides:")

        for index, slide in enumerate(slides, start=1):
            print(
                f"  Slide {index}: "
                f"{slide.get('title')}"
            )

            print(
                f"    Subtitle: "
                f"{slide.get('subtitle')}"
            )

            print(
                f"    Bullets: "
                f"{len(slide.get('bullets', []))}"
            )

else:
    print(
        "Expected an object, but received:",
        type(result).__name__,
    )