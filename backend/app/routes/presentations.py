"""
Route for POST /api/presentations/generate.

Thin HTTP layer: receives a GenerationRequest, delegates to the
presentation generation service, and translates service failures into
HTTP errors. No LLM or prompt logic lives here.
"""

from fastapi import APIRouter, HTTPException

from app.schemas.presentation import GenerationRequest, Presentation
from app.services.presentation_generator import (
    ConfigurationError,
    InvalidGenerationOutputError,
    OpenRouterError,
    generate_presentation,
)

router = APIRouter(prefix="/api/presentations", tags=["presentations"])


@router.post("/generate", response_model=Presentation)
def generate(request: GenerationRequest) -> Presentation:
    try:
        return generate_presentation(request)
    except ConfigurationError:
        # Do not leak details about missing/invalid server configuration.
        raise HTTPException(
            status_code=500,
            detail="Presentation generation is not configured correctly.",
        )
    except OpenRouterError:
        raise HTTPException(
            status_code=502,
            detail="Failed to reach the presentation generation provider.",
        )
    except InvalidGenerationOutputError as exc:
        raise HTTPException(
            status_code=502,
            detail=f"Presentation generation produced an invalid result: {exc}",
        )