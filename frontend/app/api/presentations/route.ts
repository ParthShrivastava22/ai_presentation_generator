import { NextResponse } from "next/server";

const BACKEND_URI = process.env.NEXT_BACKEND_URI;

export async function POST(request: Request) {
  if (!BACKEND_URI) {
    return NextResponse.json(
      { detail: "NEXT_BACKEND_URI is not configured." },
      { status: 500 },
    );
  }

  try {
    const body = await request.json();

    const response = await fetch(`${BACKEND_URI}/api/presentations/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const responseText = await response.text();

    return new NextResponse(responseText, {
      status: response.status,
      headers: {
        "Content-Type":
          response.headers.get("Content-Type") ?? "application/json",
      },
    });
  } catch (error) {
    console.error("Backend request failed:", error);

    return NextResponse.json(
      { detail: "Failed to reach the presentation backend." },
      { status: 502 },
    );
  }
}
