import { NextRequest, NextResponse } from "next/server";

import { API_BASE_URL } from "@/lib/config/api";

const BACKEND_URL = API_BASE_URL;

export async function POST(req: NextRequest) {
  try {
    const { slug, template, data, wordCount, socketRoom, birthCache } = await req.json();

    if (!slug || !template || !data || !socketRoom) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Forward the prediction request to the backend server's /predict/:category endpoint
    const backendResponse = await fetch(`${BACKEND_URL}/predict/${slug}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        room_name: socketRoom,
        words: Number(wordCount) || 1000,
        prompt_template: template,
        data: data,
        birth_cache: birthCache ?? null,   // ← forwarded to backend for cache key
      }),
      signal: AbortSignal.timeout(15000),
    });

    const result = await backendResponse.json();

    if (!backendResponse.ok) {
      return NextResponse.json(
        { error: result.message || "Backend prediction failed" },
        { status: backendResponse.status }
      );
    }

    return NextResponse.json({
      status: "success",
      message: `Prediction for ${slug} queued`,
    });

  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
