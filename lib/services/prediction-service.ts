/**
 * Prediction Service
 *
 * This module is kept as a lightweight utility.
 * All prediction orchestration (triggering, socket listening, store updates)
 * is handled by the pipeline orchestrator (`lib/pipeline/orchestrator.ts`).
 *
 * Predictions are fully dynamic — the Supabase `prompts` table and
 * `pricing_plan_prompts` junction table determine which categories
 * are generated for a given plan.
 */

import { API_BASE_URL } from "@/lib/config/api";

const BACKEND_URL = API_BASE_URL;

/**
 * Send a single prediction request to the backend.
 * Used as a utility if direct backend calls are needed outside
 * the pipeline orchestrator flow.
 */
export async function requestPrediction(
  category: string,
  data: any,
  room: string,
  words: number = 1000,
  promptTemplate?: string,
) {
  try {
    const response = await fetch(`${BACKEND_URL}/predict/${category}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        data,
        room_name: room,
        words,
        prompt_template: promptTemplate,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to start prediction for ${category}`);
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
}
