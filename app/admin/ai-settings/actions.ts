"use server";

import { createClient } from "@/utils/supabase/server";

export interface AISettings {
  id: number;
  gemini_api_keys: string[];
  gemini_models: string[];
  openai_api_keys: string[];
  openai_models: string[];
}

export async function getAISettings(): Promise<{ success: boolean; data?: AISettings; error?: string }> {
  try {
    const supabase = await createClient();
    
    // We only care about id = 1 as per requirements
    const { data, error } = await supabase
      .from("ai_settings")
      .select("*")
      .eq("id", 1)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No row found, return an empty template
        return { 
          success: true, 
          data: { 
            id: 1, 
            gemini_api_keys: [], 
            gemini_models: [], 
            openai_api_keys: [], 
            openai_models: [] 
          } 
        };
      }
      throw error;
    }

    return { success: true, data };
  } catch (error: any) {
    console.error("Failed to fetch AI settings:", error);
    return { success: false, error: error.message };
  }
}

export async function updateAISettings(settings: Omit<AISettings, "id">): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();

    // Upsert the data for id = 1
    const { error } = await supabase
      .from("ai_settings")
      .upsert({
        id: 1,
        ...settings,
      });

    if (error) throw error;

    return { success: true };
  } catch (error: any) {
    console.error("Failed to update AI settings:", error);
    return { success: false, error: error.message };
  }
}
