"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

/**
 * Check if a kundli with the given birth details already exists globally.
 * Uses 2-decimal rounding for lat/lng (~1km precision).
 */
export async function checkKundliExists(
  dob: string,
  tob: string,
  lat: number,
  lng: number,
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { exists: false, error: "Unauthorized" };

  // Round to 2 decimal places to match the numeric(7,2) column type
  const roundedLat = Math.round(lat * 100) / 100;
  const roundedLng = Math.round(lng * 100) / 100;

  const { data, error } = await supabase
    .from("generated_kundlis")
    .select("id")
    .eq("dob", dob)
    .eq("tob", tob)
    .eq("latitude", roundedLat)
    .eq("longitude", roundedLng)
    .maybeSingle();

  if (error) {
    console.error("[checkKundliExists] Error:", error);
    return { exists: false };
  }

  return { exists: !!data, kundliId: data?.id || null };
}

/**
 * Finalize kundli generation after pipeline + predictions complete successfully.
 *
 * 1. If new kundli → save birth details to `generated_kundlis` + deduct tokens
 * 2. Always → insert report record into `agentreports` with plan & token info
 */
export async function finalizeKundliGeneration(params: {
  name: string;
  dob: string;
  tob: string;
  lat: number;
  lng: number;
  gender: string;
  locationName: string;
  planId: number | string;
  isNewKundli: boolean;
  paperQuality: "regular" | "premium";
  report_id?: string | null;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized", tokensDeducted: 0 };
  }

  // 1. Get agent data
  const { data: agentData, error: agentError } = await supabase
    .from("agentdata")
    .select("id, tokens_total, tokens_used")
    .eq("agent_uuid", user.id)
    .single();

  if (agentError || !agentData) {
    return { success: false, error: "Agent not found", tokensDeducted: 0 };
  }

  // 2. Get plan details (which plan costs how many tokens)
  const { data: plan, error: planError } = await supabase
    .from("pricing_plans")
    .select("id, name, token_cost")
    .eq("id", Number(params.planId))
    .single();

  if (planError || !plan) {
    return { success: false, error: "Plan not found", tokensDeducted: 0 };
  }

  const tokenCost = plan.token_cost || 0;
  let tokensDeducted = 0;

  // 3. If NEW kundli → deduct tokens + save fingerprint
  if (params.isNewKundli) {
    const remaining =
      (agentData.tokens_total || 0) - (agentData.tokens_used || 0);

    if (remaining < tokenCost) {
      return {
        success: false,
        error: `Insufficient tokens. Need ${tokenCost}, have ${remaining}.`,
        tokensDeducted: 0,
      };
    }

    // 3a. Save to generated_kundlis (upsert to gracefully handle race conditions)
    const roundedLat = Math.round(params.lat * 100) / 100;
    const roundedLng = Math.round(params.lng * 100) / 100;

    const { error: kundliError } = await supabase
      .from("generated_kundlis")
      .upsert(
        {
          dob: params.dob,
          tob: params.tob,
          latitude: roundedLat,
          longitude: roundedLng,
          name: params.name,
          gender: params.gender,
          location_name: params.locationName,
          agent_id: agentData.id,
          plan_id: plan.id,
          tokens_deducted: tokenCost,
        },
        { onConflict: "dob,tob,latitude,longitude", ignoreDuplicates: true },
      );

    if (kundliError) {
      console.error(
        "[finalizeKundli] Error saving kundli record:",
        kundliError,
      );
      // Non-fatal: might be a race condition duplicate
    }

    // 3b. Deduct tokens from agent
    const { error: tokenError } = await supabase
      .from("agentdata")
      .update({ tokens_used: (agentData.tokens_used || 0) + tokenCost })
      .eq("id", agentData.id);

    if (tokenError) {
      console.error("[finalizeKundli] Token deduction error:", tokenError);
      return {
        success: false,
        error: "Token deduction failed",
        tokensDeducted: 0,
      };
    }

    tokensDeducted = tokenCost;
  }

  // 4. Get branch_id for the report
  const { data: branchData } = await supabase
    .from("branch")
    .select("id")
    .eq("agent_id", user.id)
    .single();

  // 5. Always insert a report record (tracks per-agent, per-plan usage + tokens)
  const userDetails = {
    name: params.name,
    dob: params.dob,
    tob: params.tob,
    gender: params.gender,
    lat: params.lat,
    lng: params.lng,
    locationName: params.locationName,
  };

  const { error: reportError } = await supabase.from("agentreports").insert({
    agent_id: agentData.id,
    user_details: userDetails,
    plan_id: plan.id,
    payment_mode: "token",
    paid_amount: tokensDeducted,
    tokens_used: tokensDeducted,
    paper_quality: params.paperQuality,
    branch_id: branchData?.id || 1, // Fallback to branch 1 if not found, since it's NOT NULL
    transaction_id: `TX-${Date.now()}`,
    pdf_url: null,
    report_id: params.report_id || null,
  });

  if (reportError) {
    console.error("[finalizeKundli] Report insert error:", reportError);
    // Non-fatal: tokens already deducted, report record is secondary
  }

  revalidatePath("/dashboard");
  return {
    success: true,
    tokensDeducted,
    planName: plan.name,
    tokenCost: plan.token_cost,
  };
}
