"use server";

import { createClient } from "@/utils/supabase/server";
import { getMongoDb } from "@/lib/mongodb";

interface BirthDetails {
  date_of_birth: string;
  time_of_birth: string;
  latitude: number;
  longitude: number;
  timezone: number;
  language: string;
}

interface InitReportParams {
  birthdetails: BirthDetails;
  plan_id?: number | null;
  payment_mode?: "token" | "online" | null;
  transaction_id?: string | null;
  paid_amount?: number | null;
  token_used?: number | null;
}

export async function initializeUserReport(params: InitReportParams) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (!user || userError) {
      return { error: "Authentication required to generate reports." };
    }

    const { data, error } = await supabase
      .from("user_reports")
      .insert({
        user_id: user.id,
        birthdetails: params.birthdetails,
        plan_id: params.plan_id,
        payment_mode: params.payment_mode,
        transaction_id: params.transaction_id,
        paid_amount: params.paid_amount,
        token_used: params.token_used,
        status: "processing"
      })
      .select("id")
      .single();

    if (error) {
      console.error("Initialize User Report Error:", error);
      return { error: error.message };
    }

    return { success: true, report_id: data.id };
  } catch (err: any) {
    console.error("Initialize User Report Exception:", err);
    return { error: err.message || String(err) };
  }
}

export async function finalizeUserReport(
  reportId: string, 
  coreData: any, 
  predictions: any
) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { error: "Unauthenticated" };
    }

    // 1. Store heavy payload in MongoDB
    const db = await getMongoDb();
    const collection = db.collection("report_data");
    
    await collection.updateOne(
      { report_id: reportId },
      {
        $set: {
          user_id: user.id,
          core_astrology_data: coreData,
          ai_predictions: predictions,
          updated_at: new Date()
        },
        $setOnInsert: {
          created_at: new Date()
        }
      },
      { upsert: true }
    );

    // 2. Mark report complete in Supabase
    const { error: updateError } = await supabase
      .from("user_reports")
      .update({
        status: "completed",
        updated_at: new Date().toISOString()
      })
      .eq("id", reportId)
      .eq("user_id", user.id);

    if (updateError) {
      console.error("Finalize Report Supabase Error:", updateError);
      return { error: updateError.message };
    }

    return { success: true };
  } catch (err: any) {
    console.error("Finalize User Report Exception:", err);
    return { error: err.message || String(err) };
  }
}

export async function fetchUserReportFromMongo(reportId: string) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { error: "Unauthenticated" };
    }

    // 1. Fetch metadata from Supabase (standard user reports)
    let { data: reportMeta } = await supabase
      .from("user_reports")
      .select("*")
      .eq("id", reportId)
      .eq("user_id", user.id)
      .single();

    // 2. If not found, try agent reports
    if (!reportMeta) {
      // First get the agent's internal ID
      const { data: agentData } = await supabase
        .from("agentdata")
        .select("id")
        .eq("agent_uuid", user.id)
        .single();
      
      if (agentData) {
        const { data: agentReport } = await supabase
          .from("agentreports")
          .select("*")
          .eq("report_id", reportId)
          .eq("agent_id", agentData.id)
          .single();
        
        if (agentReport) {
          reportMeta = {
            id: agentReport.report_id,
            user_id: user.id,
            user_details: agentReport.user_details,
            birth_details: agentReport.user_details, // Compatibility alias
            source: "agent_dashboard"
          };
        }
      }
    }

    const db = await getMongoDb();
    
    // Try 'report_data' first (Current Unified Schema)
    // We already verified ownership/access via Supabase above, so we lookup by report_id
    let doc = await db.collection("report_data").findOne({ 
      report_id: reportId 
    });

    if (doc) {
      return { 
        success: true, 
        meta: reportMeta || { id: reportId, birth_details: doc.birth_details },
        coreData: doc.core_astrology_data,
        predictions: doc.ai_predictions,
        birth_details: doc.birth_details,
        source: "report_data"
      };
    }

    // Try 'summary_report' (Legacy Agent Schema)
    doc = await db.collection("summary_report").findOne({ 
      report_id: reportId
    });

    if (doc) {
      return { 
        success: true, 
        meta: reportMeta || { id: reportId, birth_details: doc.birth_details },
        coreData: doc.astrology,
        predictions: doc.predictions,
        birth_details: doc.birth_details,
        source: "summary_report"
      };
    }

    return { error: "Report details are missing from the database." };
  } catch (err: any) {
    console.error("Fetch User Report Exception:", err);
    return { error: err.message || String(err) };
  }
}

