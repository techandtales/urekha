import { NextRequest, NextResponse } from "next/server";
import redis from "@/lib/redis";
import fs from "fs";
import path from "path";

export async function GET(req: NextRequest) {
  try {
    // 1. Get Client IP
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
    const redisKey = `ratelimit:demo_download:${ip}`;

    // 2. Check & Increment Rate Limit (3 downloads per hour)
    const currentCount = await redis.get(redisKey);
    const count = currentCount ? parseInt(currentCount) : 0;

    if (count >= 3) {
      return NextResponse.json(
        { 
            error: "Rate limit exceeded", 
            message: "The Architect's resources are cooling down. Please try again in an hour." 
        },
        { status: 429 }
      );
    }

    // Increment and set expiry (1 hour)
    if (count === 0) {
      await redis.set(redisKey, 1, "EX", 3600);
    } else {
      await redis.incr(redisKey);
    }

    // 3. Serve the file
    const filePath = path.join(process.cwd(), "public", "sample.pdf");
    
    if (!fs.existsSync(filePath)) {
        return NextResponse.json(
            { error: "File not found", message: "Sample report is missing on the server." },
            { status: 404 }
        );
    }

    const fileBuffer = fs.readFileSync(filePath);
    
    return new Response(fileBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="urekha-sample-report.pdf"',
      },
    });

  } catch (error) {
    console.error("[DOWNLOAD_API_ERROR]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
