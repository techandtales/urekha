"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

/**
 * Server-side guard: Validates that the agent exists and has enough tokens
 * for the selected plan. Called BEFORE pipeline starts (only for new kundlis).
 * Actual token deduction happens in finalizeKundliGeneration after success.
 */
export async function generateReport(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !user.email) {
    return { success: false, message: "Unauthorized" };
  }

  // Fetch agent
  const { data: agentData, error: agentError } = await supabase
    .from("agentdata")
    .select("*")
    .eq("agent_uuid", user.id)
    .single();

  if (agentError || !agentData) {
    return { success: false, message: "Agent profile not found" };
  }

  // Fetch the selected plan to get its token_cost
  const planId = formData.get("plan") as string;
  const { data: plan, error: planError } = await supabase
    .from("pricing_plans")
    .select("id, name, token_cost")
    .eq("id", planId)
    .single();

  if (planError || !plan) {
    return { success: false, message: "Selected plan not found" };
  }

  // Check token sufficiency
  const tokensTotal = agentData.tokens_total || 0;
  const tokensUsed = agentData.tokens_used || 0;
  const remaining = tokensTotal - tokensUsed;

  if (remaining < plan.token_cost) {
    return {
      success: false,
      message: `Insufficient credits. You need ${plan.token_cost.toLocaleString()} tokens for the ${plan.name} plan, but only have ${remaining.toLocaleString()} available.`,
    };
  }
  revalidatePath("/dashboard");
  return { success: true, message: "Report approved for generation" };
}

export async function updateAgentProfile(name: string, phone: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, message: "Authentication required" };
  }

  const { error } = await supabase
    .from("agentdata")
    .update({
      name: name,
      phone: phone,
    })
    .eq("agent_uuid", user.id);

  if (error) {
    console.error("Profile update error:", error);
    return { success: false, message: error.message };
  }

  revalidatePath("/dashboard");
  return { success: true, message: "Profile updated successfully" };
}
