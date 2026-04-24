"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

/**
 * Initialize user kundli generation.
 * 
 * 1. Checks and Deducts tokens from `userdata`
 * 2. Inserts 'processing' report record into `user_reports`
 * 3. Returns `reportId` for the Orchestrator to use.
 */
export async function initializeUserKundliGeneration(params: {
  name: string;
  dob: string;
  tob: string;
  lat: number;
  lng: number;
  gender: string;
  locationName: string;
  planId: number | string;
  isNewKundli: boolean;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized", tokensDeducted: 0 };
  }

  // 1. Get user profile data
  const { data: userData, error: userError } = await supabase
    .from("userdata")
    .select("id, tokens_total, tokens_used")
    .eq("email", user.email)
    .single();

  if (userError || !userData) {
    return { success: false, error: "User profile not found", tokensDeducted: 0 };
  }

  // 2. Get plan details
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

  // 3. Deduct tokens if it's a new generation (for users, we might always deduct or follow agent logic)
  // For now, let's follow the agent logic: only deduct if isNewKundli is true
  if (params.isNewKundli) {
    const available = (userData.tokens_total || 0) - (userData.tokens_used || 0);

    if (available < tokenCost) {
      return {
        success: false,
        error: `Insufficient tokens. Need ${tokenCost}, have ${available}.`,
        tokensDeducted: 0,
      };
    }

    // 3a. Update tokens_used in userdata
    const { error: tokenError } = await supabase
      .from("userdata")
      .update({ tokens_used: (userData.tokens_used || 0) + tokenCost })
      .eq("id", userData.id);

    if (tokenError) {
      console.error("[finalizeUserKundli] Token deduction error:", tokenError);
      return {
        success: false,
        error: "Token deduction failed",
        tokensDeducted: 0,
      };
    }

    tokensDeducted = tokenCost;
  }

  // 4. Insert report record into user_reports
  const birthdetails = {
    name: params.name,
    dob: params.dob,
    tob: params.tob,
    gender: params.gender,
    lat: params.lat,
    lng: params.lng,
    locationName: params.locationName,
  };

  const { data: reportData, error: reportError } = await supabase.from("user_reports").insert({
    user_id: user.id,
    birthdetails: birthdetails,
    plan_id: plan.id,
    payment_mode: "token",
    paid_amount: tokensDeducted,
    tokens_used: tokensDeducted,
    transaction_id: `USER-TX-${Date.now()}`,
    status: "processing"
  }).select("id").single();

  if (reportError || !reportData) {
    console.error("[initializeUserKundli] Report insert error:", reportError);
    return { success: false, error: "Failed to initialize report record." };
  }

  revalidatePath("/profile");
  return {
    success: true,
    reportId: reportData.id,
    tokensDeducted,
    planName: plan.name,
    tokenCost: plan.token_cost,
  };
}
