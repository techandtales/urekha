import { NextRequest, NextResponse } from "next/server";
import redisClient from "@/lib/redis";

// helper to mimic backend's deterministic JSON stringification
function stringifyAlphabetically(obj: any): string {
  if (Array.isArray(obj)) {
    return `[${obj.map(stringifyAlphabetically).join(",")}]`;
  }
  if (typeof obj === "object" && obj !== null) {
    const keys = Object.keys(obj).sort();
    const sortedObj: any = {};
    for (const key of keys) {
      if (obj[key] !== undefined) {
        sortedObj[key] = obj[key];
      }
    }
    return JSON.stringify(sortedObj);
  }
  return JSON.stringify(obj);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { items } = body; 
    // items: Array<{ type: 'jyotisham' | 'predict', slug: string, payload: any }>

    if (!items || !Array.isArray(items)) {
      return NextResponse.json({ error: "Invalid items array" }, { status: 400 });
    }

    const results: Record<string, any> = {};

    // Use a pipeline for blazing fast batched redis reads
    const pipeline = redisClient.pipeline();
    const keysToFetch: string[] = [];

    for (const item of items) {
      const { type, slug, payload } = item;
      const sortedPayload = stringifyAlphabetically(payload);
      
      let key = "";
      if (type === "jyotisham") {
        key = `jyotisham:${slug}:${sortedPayload}`;
      } else if (type === "predict") {
        key = `${slug}:${sortedPayload}`;
      } else {
        continue;
      }
      
      keysToFetch.push(key);
      pipeline.get(key);
    }

    if (keysToFetch.length === 0) {
      return NextResponse.json({ success: true, data: {} });
    }

    const execResults = await pipeline.exec();

    if (execResults) {
      execResults.forEach((result: any, index: number) => {
        const [err, val] = result;
        const currentItem = items[index];
        // we map it back to the original slug
        if (!err && val && typeof val === "string") {
          try {
            results[currentItem.slug] = JSON.parse(val);
          } catch (e) {
            results[currentItem.slug] = null;
          }
        } else {
          results[currentItem.slug] = null;
        }
      });
    }

    return NextResponse.json({ success: true, data: results });
  } catch (err: any) {
    console.error("[Kvrocks Batch Fetch error]", err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
