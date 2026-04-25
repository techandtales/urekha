"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { getMongoDb } from "@/lib/mongodb";

/**
 * Agent requests tokens.
 */
export async function requestTokens(amount: number, remarks?: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  // Get agent data
  const { data: agentData, error: agentError } = await supabase
    .from("agentdata")
    .select("id")
    .eq("agent_uuid", user.id)
    .single();

  if (agentError || !agentData) {
    return { success: false, error: "Agent not found" };
  }

  // Insert token request
  const { error: insertError } = await supabase
    .from("token_transactions")
    .insert({
      agent_id: agentData.id,
      amount,
      remarks,
      status: "pending",
    });

  if (insertError) {
    console.error("Error inserting token request:", insertError);
    return { success: false, error: insertError.message };
  }

  revalidatePath("/dashboard");
  return { success: true };
}

/**
 * Agent cancels their own pending token request.
 */
export async function cancelTokenRequest() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  // Get agent data
  const { data: agentData, error: agentError } = await supabase
    .from("agentdata")
    .select("id")
    .eq("agent_uuid", user.id)
    .single();

  if (agentError || !agentData) {
    return { success: false, error: "Agent not found" };
  }

  // Delete the pending token request for this agent
  const { error: deleteError, count } = await supabase
    .from("token_transactions")
    .delete()
    .eq("agent_id", agentData.id)
    .eq("status", "pending");

  if (deleteError) {
    console.error("Error cancelling token request:", deleteError);
    return { success: false, error: deleteError.message };
  }

  revalidatePath("/dashboard");
  return { success: true, deleted: count };
}

/**
 * Admin: Check if current user is admin.
 */
async function isAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { isAdmin: false, email: null };

  const { data: roleData } = await supabase
    .from("roles")
    .select("*")
    .eq("user_id", user.id)
    .in("role", ["admin", "superadmin"])
    .single();

  return { isAdmin: !!roleData, email: user.email };
}

/**
 * Admin: Get pending token requests.
 */
export async function getPendingTokenRequests() {
  const adminCheck = await isAdmin();
  if (!adminCheck.isAdmin) return { success: false, error: "Unauthorized" };

  const supabase = await createClient();
  
  // Note: We need a join with agentdata to get agent email/name, but supabase-js handles this easily
  // if foreign keys are set up. Since token_transactions has agent_id -> agentdata(id):
  const { data, error } = await supabase
    .from("token_transactions")
    .select(`
      *,
      agent:agentdata(email, name, phone, agent_uuid)
    `)
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, data };
}

/**
 * Admin: Get count of pending token requests.
 */
export async function getPendingTokenRequestCount() {
  const adminCheck = await isAdmin();
  if (!adminCheck.isAdmin) return { success: false, count: 0 };

  const supabase = await createClient();
  const { count, error } = await supabase
    .from("token_transactions")
    .select("*", { count: "exact", head: true })
    .eq("status", "pending");

  if (error) {
    return { success: false, count: 0 };
  }

  return { success: true, count: count || 0 };
}

/**
 * Admin: Approve or Reject a token request.
 */
export async function approveTokenRequest(transactionId: number, isApproved: boolean) {
  const adminCheck = await isAdmin();
  if (!adminCheck.isAdmin) return { success: false, error: "Unauthorized" };

  const supabase = await createClient();

  // 1. Get the transaction details
  const { data: transaction, error: txError } = await supabase
    .from("token_transactions")
    .select("*")
    .eq("id", transactionId)
    .single();

  if (txError || !transaction) {
    return { success: false, error: "Transaction not found" };
  }

  if (transaction.status !== "pending") {
    return { success: false, error: "Transaction is already " + transaction.status };
  }

  const newStatus = isApproved ? "approved" : "rejected";

  // 2. Update transaction status
  const { error: updateTxError } = await supabase
    .from("token_transactions")
    .update({
      status: newStatus,
      approved_by: adminCheck.email,
      approved_at: new Date().toISOString(), // Using PostgreSQL now() usually doesn't work easily from client side if we don't use raw strings or RPC, so JS Date is fine.
    })
    .eq("id", transactionId);

  if (updateTxError) {
    return { success: false, error: updateTxError.message };
  }

  // 3. If approved, update agent's tokens_total
  if (isApproved) {
    // We need to fetch current total to add to it because RPC isn't set up.
    // To avoid race conditions, we should ideally use a Postgres function (RPC), 
    // but a simple read/write is fine.
    
    // An RPC would be better: create function increment_tokens(agent_id bigint, amount int)
    // For now, let's fetch and update
    const { data: agent, error: agentError } = await supabase
      .from("agentdata")
      .select("tokens_total")
      .eq("id", transaction.agent_id)
      .single();
      
    if (agent && !agentError) {
      await supabase
        .from("agentdata")
        .update({
          tokens_total: (agent.tokens_total || 0) + transaction.amount
        })
        .eq("id", transaction.agent_id);
    }
  }

  revalidatePath("/admin/tokens/requests");
  revalidatePath("/dashboard"); // Also invalidate agent dashboard just in case
  
  return { success: true };
}

/**
 * Admin: Get all agents
 */
export async function getAllAgents() {
  const adminCheck = await isAdmin();
  if (!adminCheck.isAdmin) return { success: false, error: "Unauthorized" };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("agentdata")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return { success: false, error: error.message };
  return { success: true, data };
}

/**
 * Admin: Get all users
 */
export async function getAllUsers() {
  const adminCheck = await isAdmin();
  if (!adminCheck.isAdmin) return { success: false, error: "Unauthorized" };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("userdata")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return { success: false, error: error.message };
  return { success: true, data };
}

/**
 * Admin: Get comprehensive dashboard insights
 */
export async function getAdminDashboardInsights() {
  const adminCheck = await isAdmin();
  if (!adminCheck.isAdmin) return { success: false, error: "Unauthorized" };

  const supabase = await createClient();

  try {
    const [
      { count: totalAgents },
      { count: totalUsers },
      // Revenue & Activity Trends (Last 30 Days)
      { data: revenueTrends },
      // Location Analytics
      { data: locationData },
      // Pricing Plan Popularity
      { data: pricingData },
      // Top Agents
      { data: topAgents },
      // Token Status
      { data: tokenStats }
    ] = await Promise.all([
      supabase.from("agentdata").select("*", { count: "exact", head: true }),
      supabase.from("userdata").select("*", { count: "exact", head: true }),
      
      // Daily Revenue & Reports
      supabase.rpc("get_daily_stats"), // Using RPC for complex GROUP BY if available, otherwise fallback
      
      // Top Locations from generated_kundlis
      supabase.from("generated_kundlis")
        .select("location_name")
        .not("location_name", "is", null),

      // Pricing Comparison
      supabase.from("agentreports")
        .select(`
          paid_amount,
          plan:pricing_plans(name)
        `),

      // Agent Performance
      supabase.from("agentdata")
        .select("name, email, revenue, tokens_total")
        .order("revenue", { ascending: false })
        .limit(5),

      // Token Liquidity
      supabase.from("token_transactions")
        .select("amount, status")
    ]);

    // Fallback for Revenue Trends if RPC fails or isn't used
    // Since we can't easily do GROUP BY in JS without fetching rows (expensive)
    // We'll fetch last 30 days of agentreports for simple aggregation
    const { data: recentReports } = await supabase
      .from("agentreports")
      .select("created_at, paid_amount")
      .gte("created_at", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

    const { data: recentUsers } = await supabase
      .from("userdata")
      .select("created_at")
      .gte("created_at", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

    // Process Location Data
    const locationCounts: Record<string, number> = {};
    locationData?.forEach(item => {
      const loc = item.location_name?.split(",").pop()?.trim() || "Unknown";
      locationCounts[loc] = (locationCounts[loc] || 0) + 1;
    });
    const topLocations = Object.entries(locationCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);

    // Process Pricing Data
    const pricingCounts: Record<string, { count: number; revenue: number }> = {};
    pricingData?.forEach((item: any) => {
      const planName = item.plan?.name || "Standard";
      if (!pricingCounts[planName]) pricingCounts[planName] = { count: 0, revenue: 0 };
      pricingCounts[planName].count++;
      pricingCounts[planName].revenue += item.paid_amount || 0;
    });
    const pricingComparison = Object.entries(pricingCounts).map(([name, data]) => ({
      name,
      count: data.count,
      revenue: data.revenue
    }));

    // Process Trends
    const trendsByDate: Record<string, { date: string; revenue: number; reports: number; users: number }> = {};
    recentReports?.forEach(r => {
      const date = new Date(r.created_at).toLocaleDateString();
      if (!trendsByDate[date]) trendsByDate[date] = { date, revenue: 0, reports: 0, users: 0 };
      trendsByDate[date].revenue += r.paid_amount || 0;
      trendsByDate[date].reports++;
    });
    recentUsers?.forEach(u => {
      const date = new Date(u.created_at).toLocaleDateString();
      if (!trendsByDate[date]) trendsByDate[date] = { date, revenue: 0, reports: 0, users: 0 };
      trendsByDate[date].users++;
    });

    const activeTrends = Object.values(trendsByDate).sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const totalRevenue = pricingComparison.reduce((sum, p) => sum + p.revenue, 0);
    const pendingTokens = tokenStats?.filter(t => t.status === "pending").reduce((sum, t) => sum + (t.amount || 0), 0) || 0;

    return {
      success: true,
      data: {
        stats: {
          totalAgents: totalAgents || 0,
          totalUsers: totalUsers || 0,
          totalRevenue,
          pendingTokens
        },
        trends: activeTrends,
        topLocations,
        pricingComparison,
        topAgents: topAgents || []
      }
    };
  } catch (error: any) {
    console.error("Dashboard Insight Error:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Admin: Get overall dashboard stats (Simplified for backwards compatibility or quick looks)
 */
export async function getDashboardStats() {
  const adminCheck = await isAdmin();
  if (!adminCheck.isAdmin) return { success: false, error: "Unauthorized" };

  const supabase = await createClient();
  
  const [{ count: agentCount }, { count: userCount }, { data: reports }] = await Promise.all([
    supabase.from("agentdata").select("*", { count: "exact", head: true }),
    supabase.from("userdata").select("*", { count: "exact", head: true }),
    supabase.from("agentreports").select("paid_amount")
  ]);

  const totalRevenue = reports?.reduce((sum, r) => sum + (r.paid_amount || 0), 0) || 0;

  return {
    success: true,
    data: {
      totalAgents: agentCount || 0,
      totalUsers: userCount || 0,
      totalRevenue,
      totalTokensGranted: 0 // Will be handled by insights if needed
    }
  };
}

/**
 * Admin: Get token history
 */
export async function getTokenHistory() {
  const adminCheck = await isAdmin();
  if (!adminCheck.isAdmin) return { success: false, error: "Unauthorized" };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("token_transactions")
    .select(`
      *,
      agent:agentdata(email, name, phone, agent_uuid)
    `)
    .order("created_at", { ascending: false });

  if (error) return { success: false, error: error.message };
  return { success: true, data };
}

/**
 * Agent: Get own token history
 */
export async function getAgentTokenHistory() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { success: false, error: "Unauthorized" };

  const { data: agentData } = await supabase
    .from("agentdata")
    .select("id")
    .eq("agent_uuid", user.id)
    .single();

  if (!agentData) return { success: false, error: "Agent not found" };

  const { data, error } = await supabase
    .from("token_transactions")
    .select("*")
    .eq("agent_id", agentData.id)
    .order("created_at", { ascending: false });

  if (error) return { success: false, error: error.message };
  return { success: true, data };
}

/**
 * Admin: Get all pre-orders from MongoDB
 */
export async function getPreOrders() {
  const adminCheck = await isAdmin();
  if (!adminCheck.isAdmin) return { success: false, error: "Unauthorized" };

  try {
    const db = await getMongoDb();
    const preOrders = await db.collection("pre_orders")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    // Convert MongoDB objects to plain JS objects for Next.js server components
    const serializedPreOrders = preOrders.map(order => ({
      ...order,
      _id: order._id.toString(),
      createdAt: order.createdAt instanceof Date ? order.createdAt.toISOString() : order.createdAt
    }));

    return { success: true, data: serializedPreOrders };
  } catch (error: any) {
    console.error("Error fetching pre-orders:", error);
    return { success: false, error: error.message };
  }
}

