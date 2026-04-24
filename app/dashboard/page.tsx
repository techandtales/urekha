import { redirect } from "next/navigation";
import { Suspense } from "react";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import AgentDashboardClient from "./dashboard-client";

export default async function AgentDashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/agent/login");
  }

  const { data: agentData, error: agentError } = await supabase
    .from("agentdata")
    .select("*")
    .eq("agent_uuid", user.id)
    .single();

  if (agentError || !agentData) {
    
    // Fallback: search by email just in case agent_uuid isn't set yet
    const { data: fallbackData } = await supabase
      .from("agentdata")
      .select("*")
      .eq("email", user.email!)
      .single();

    if (fallbackData) {
      // We could potentially update it here, but let's just use it for now
      return (
        <div className="p-8 text-white min-h-screen bg-[#050A0A]">
          <h1 className="text-xl font-bold mb-4">Account Sync Required</h1>
          <p>We found your profile, but it's not linked to your login ID yet.</p>
          <p className="mt-2 text-sm text-zinc-400">Please run the SQL script provided in the walkthrough to sync your account.</p>
        </div>
      );
    }

    return (
      <div className="p-8 text-white min-h-screen bg-[#050A0A] flex flex-col items-center justify-center text-center">
        <div className="max-w-md w-full bg-white/[0.02] border border-white/5 p-8 rounded-3xl shadow-2xl">
          <h1 className="text-2xl font-bold mb-4 text-red-500">Agent Profile Not Found</h1>
          <p className="text-white/60 mb-6">We couldn't find an entry in the <code className="bg-white/10 px-1 rounded text-white">agentdata</code> table for your account.</p>
          
          <div className="text-left bg-black/40 p-4 rounded-xl space-y-2 font-mono text-xs mb-8">
            <p><span className="text-brand-gold">Email:</span> {user.email}</p>
            <p><span className="text-brand-gold">ID:</span> {user.id}</p>
          </div>

          <p className="text-sm text-white/40 mb-8 italic">
            Tip: Run the SQL script from the walkthrough to link existing accounts, or try signing up as an agent again.
          </p>

          <Link 
            href="/auth/agent/login"
            className="block w-full py-3 bg-brand-gold text-black rounded-xl font-bold uppercase tracking-widest hover:brightness-110 transition-all text-center"
          >
            Back to Login
          </Link>
        </div>
      </div>
    );
  }

  // 2. Fetch agentreports using the agentdata.id (bigint PK)
  const { data: recentReports } = await supabase
    .from("agentreports")
    .select("*, pricing_plans(name)")
    .eq("agent_id", agentData.id)
    .order("created_at", { ascending: false })
    .limit(50);

  // 3. Fetch branch using agentdata.agent_id
  const { data: branchData } = await supabase
    .from("branch")
    .select("*")
    .eq("agent_id", user.id)
    .single();

  // 4. Fetch Pricing Plans for Agents
  const { data: plansData } = await supabase
    .from("pricing_plans")
    .select("*")
    .eq("target_audience", "agent")
    .eq("is_active", true)
    .order("display_order", { ascending: true });

  // 5. Fetch token history
  const { data: tokenRequests } = await supabase
    .from("token_transactions")
    .select("*")
    .eq("agent_id", agentData.id)
    .order("created_at", { ascending: false });

  return (
    <Suspense fallback={<div className="p-8 text-white min-h-screen bg-[#050A0A] flex items-center justify-center">Loading Dashboard...</div>}>
      <AgentDashboardClient
        agentData={agentData}
        recentReports={recentReports || []}
        branchData={branchData}
        agentPlans={plansData || []}
        tokenRequests={tokenRequests || []}
      />
    </Suspense>
  );
}
