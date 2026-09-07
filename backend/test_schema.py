import json

from app.schemas.presentation import Presentation


sample_response = {
    "title": "The Evolution of Smartphones",
    "theme": "modern",
    "slides": [
        {
            "type": "title",
            "title": "The Evolution of Smartphones",
            "subtitle": "From Basic Phones to Connected Worlds",
        },
        {
            "type": "content",
            "title": "Early Mobile Phones",
            "bullets": [
                "Analog technology dominated initial mobile communications",
                "Limited to voice calls and simple text messaging",
                "Heavy reliance on physical networks and infrastructure",
                "Durable but bulky designs with small screens",
                "Paved the way for digital transformation",
            ],
        },
        {
            "type": "two-column",
            "title": "Feature Phones vs. Smartphones",
            "left": {
                "heading": "Feature Phones (1990s-2000s)",
                "bullets": [
                    "Basic call functionality only",
                    "Text messaging via SMS",
                    "No internet access",
                    "Simple keypad interfaces",
                    "Limited app ecosystem",
                ],
            },
            "right": {
                "heading": "Smartphones (2010s-Present)",
                "bullets": [
                    "Touchscreen interfaces and multitasking",
                    "High-speed internet connectivity",
                    "App-based services and platforms",
                    "Advanced cameras and sensors",
                    "Integrated biometric security",
                ],
            },
        },
        {
            "type": "content",
            "title": "The iPhone Revolution",
            "bullets": [
                "Released in 2007 by Apple Inc.",
                "Combined phone, iPod, and internet communicator",
                "Introduced multi-touch interface and iOS platform",
                "Set new standards for mobile design",
                "Accelerated smartphone adoption globally",
            ],
        },
        {
            "type": "content",
            "title": "Modern Smartphone Capabilities",
            "bullets": [
                "Powerful processors and high-resolution displays",
                "5G connectivity and cloud integration",
                "AI-powered assistants and machine learning",
                "Foldable and rollable screen technologies",
                "Health monitoring and augmented reality features",
            ],
        },
        {
            "type": "content",
            "title": "Impact on Everyday Life",
            "bullets": [
                "Constant connectivity and instant communication",
                "Educational tools and online research access",
                "Social media and digital community building",
                "Remote work and mobile productivity",
                "Entertainment streaming and gaming on-the-go",
            ],
        },
        {
            "type": "content",
            "title": "Future Trends & Innovations",
            "bullets": [
                "Artificial intelligence integration and personalization",
                "Sustainable and eco-friendly device manufacturing",
                "Brain-computer interfaces and neural connections",
                "Extended reality (XR) and mixed reality experiences",
                "Quantum computing capabilities in handheld form",
            ],
        },
        {
            "type": "content",
            "title": "Conclusion",
            "bullets": [
                "Smartphones transformed society fundamentally",
                "Continuous innovation drives future possibilities",
                "Critical thinking about digital responsibility",
                "Balancing technology with well-being",
                "Ongoing journey toward smarter connected lives",
            ],
        },
    ],
}


try:
    presentation = Presentation.model_validate(sample_response)

    print("✅ Presentation is valid!")
    print()
    print("Title:", presentation.title)
    print("Theme:", presentation.theme)
    print("Slides:", len(presentation.slides))
    print("First slide:", presentation.slides[0].type)

    print()
    print("--- JSON sent to frontend ---")
    print(json.dumps(
        presentation.model_dump(by_alias=True),
        indent=2,
    ))

except Exception as error:
    print("❌ Validation failed!")
    print(error)